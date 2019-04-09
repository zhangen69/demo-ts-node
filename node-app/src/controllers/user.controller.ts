import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { mapColletionToUserDTO, mapDocToUserDTO } from '../DTOs/user.dto';
import IMongooseQueryModel from '../interfaces/mongoose/mongooseQueryModel.interface';
import { IChangePasswordRequest, IEmailConfirmRequest, IForgotPasswordRequest, IResetPasswordRequest, IUser, IUserLogin, IUserRegister, IVerifyTokenRequest } from '../interfaces/user.interface';
import QueryModel from '../models/query.model';
import User from '../models/user.model';

class Controller {
    // user
    async register(model: IUserRegister) {
        // check duplicate username and email
        const users = await this.findUsers({ $or: [{ username: model.username }, { email: model.email }] });

        if (users.length > 0) {
            return { status: 400, message: 'Username or Email already existed. Please try again' };
        }

        return await this.createUser(model, 'user created successfully!');
    }

    async login(model: IUserLogin) {
        const user = await this.findUser({ username: model.username });

        if (user == null) {
            return { status: 500, message: 'User not found.' };
        }

        const errorRes = { status: 401, message: 'Username or Password are incorrect. Please try again' };

        if (!user) {
            return errorRes;
        }

        if (!bcrypt.compareSync(model.password, user.passwordHash)) {
            if (user.isAccessFailedLocked) {
                return { status: 423, message: 'Your account access failed 3 times, please contact admin to unlock the account' };
            }

            if (user.accessFailedCount < 3) {
                const accessFailedCount = user.accessFailedCount + 1;
                const isAccessFailedLocked = user.accessFailedCount + 1 === 3;
                await this.updateUser(user, { accessFailedCount, isAccessFailedLocked });
            }

            return errorRes;
        }

        const { succeeded, status, message } = this.userLockHandler(user);

        if (!succeeded) {
            return ({ status, message });
        }

        const result = {
            status: 200,
            message: `logged in!`,
            token: jwt.sign({ username: user.username, _id: user._id }, 'secret this should be longer', { expiresIn: '1d' }),
            expiresIn: 60 * 60 * 24,
        };

        if (user.accessFailedCount > 0) {
            await this.updateUser(user, { accessFailedCount: 0 });
        }

        return (result);
    }

    async changePassword(model: IChangePasswordRequest, auth) {
        const user = await this.findUser({ username: model.username });

        if (user == null) {
            return { status: 500, message: 'User not found.' };
        }

        if (!bcrypt.compareSync(model.password, user.passwordHash)) {
            return { status: 403, message: 'Password are invalid! Please try again.' };
        }

        user.passwordHash = bcrypt.hashSync(model.newPassword, 10);

        return await this.saveUser(user, `user password changed successfully!`);
    }

    async fetchProfile(id: string) {
        const user = await this.findUserById(id);
        return { status: 200, data: mapDocToUserDTO(user) };
    }

    async updateProfile(model: IUser) {
        return await this.findUserByIdAndUpdate(model._id, model, 'update profile successfully!');
    }

    async forgotPassword(model: IForgotPasswordRequest) {
        const user = await this.findUser({ username: model.username, email: model.email });

        if (user == null) {
            return { status: 500, message: 'User not found.' };
        }

        const set = { isResetPasswordLocked: true, resetPasswordToken: uuid() };
        const url = `http://localhost:4200/auth/resetPassword/${set.resetPasswordToken}`;
        return await this.updateUser(user, set, `sent reset password email to ${model.email}, account will temperarily locked until user changed password.`);
    }

    async verifyResetPasswordToken(model: IVerifyTokenRequest) {
        const user = await this.findUser({ resetPasswordToken: model.token });

        if (user == null) {
            return { status: 500, message: 'Token is invalid.' };
        }

        return { status: 200, verified: true };
    }

    // admin
    async fetch(id: string) {
        const user = await this.findUserById(id);
        return { status: 200, data: mapDocToUserDTO(user) };
    }

    async fetchAll(queryModel: QueryModel, auth?) {
        const { conditions, options } = new QueryModel(queryModel).getQuery();
        if (auth.isAuth) {
            // $ne as NOT EQUAL, username not equal to current user
            conditions.username = { $ne: auth.user.username };
        }
        const count = await this.estimatedDocumentCount(conditions);
        const users = await this.findUsers(conditions, options);
        return {
            status: 200,
            data: mapColletionToUserDTO(users),
            totalItems: count,
            currentPage: queryModel.currentPage,
            totalPages: Math.ceil(count / queryModel.pageSize),
        };
    }

    async update(model: IUser, auth) {
        return await this.findUserByIdAndUpdate(model._id, this._getUpdateConditions(model, auth), 'user updated successfully!');
    }

    async lock(model: IUser, auth) {
        return await this.findUserByIdAndUpdate(model._id, { isLocked: true }, 'user locked successfully!');
    }

    async unlock(model: IUser, auth) {
        const user = await this.findUserById(model._id);

        if (user == null) {
            return { status: 500, message: 'User not found.' };
        }

        const set: any = { isLocked: false };
        if (user.isAccessFailedLocked) {
            set.isAccessFailedLocked = false;
            set.accessFailedCount = 0;
        }

        if (user.isResetPasswordLocked) {
            return { status: 500, message: 'failed to unlock account, because it is locked by reset password. either user changed password or retry send a new reset password email to unlock the account.' };
        }

        return await this.updateUser(user, set, `user locked successfully!`);
    }

    async resetPassword(model: IResetPasswordRequest) {
        const user = await this.findUser({ username: model.username, resetPasswordToken: model.token });

        if (user == null) {
            return { status: 500, message: 'Failed to reset password. Username or Token is invalid.' };
        }

        const newPasswordHash = bcrypt.hashSync(model.newPassword, 10);
        const set = {
            passwordHash: newPasswordHash,
            resetPasswordToken: null,
            isResetPasswordLocked: false,
        };
        return await this.updateUser(user, set, 'your password was changed successfully!');
    }

    private findUsers(conditions, options?) {
        return new Promise<any>((resolve, reject) => {
            const sortQuery = (options.sortDirection === 'ASC' ? '' : '-') + options.sort;
            User.find(conditions).sort(sortQuery).skip(options.skip).limit(options.limit).exec((err, docs) => this.resHandler({ resolve, reject }, { err, res: docs }));
        });
    }

    private findUser(conditions) {
        return new Promise<any>((resolve, reject) => {
            User.findOne(conditions, (err, doc) => this.resHandler({ resolve, reject }, { err, res: doc }));
        });
    }

    private findUserById(id) {
        return this.findUser({ _id: id });
    }

    private async findUserByIdAndUpdate(id, model, message?) {
        const user = await this.findUserById(id);
        return await this.updateUser(user, model, message);
    }

    private createUser(model, message?) {
        return new Promise<any>((resolve, reject) => {
            model.passwordHash = bcrypt.hashSync(model.password, 10);
            const user = new User(model);
            user.save((err, doc) => this.resHandler({ resolve, reject }, { err, res: doc }, { status: 201, message }));
        });
    }

    private updateUser(user, model?, message?) {
        return new Promise<any>((resolve, reject) => {
            user.updateOne(model, (err, doc) => this.resHandler({ resolve, reject }, { err, res: doc }, { status: 200, message }));
        });
    }

    private saveUser(user, message?) {
        return new Promise<any>((resolve, reject) => {
            user.save((err, doc) => this.resHandler({ resolve, reject }, { err, res: doc }, { status: 200, message }));
        });
    }

    private estimatedDocumentCount(conditions) {
        return new Promise<any>((resolve, reject) => {
            User.estimatedDocumentCount(conditions, (err, count) => this.resHandler({ resolve, reject }, { err, res: count }));
        });
    }

    private userLockHandler(user): { succeeded: boolean, status: number, message: string } {
        const result: any = {
            succeeded: true,
            status: 200,
            message: '',
        };

        if (user.isLocked || user.isResetPasswordLocked || user.isAccessFailedLocked) {
            result.succeeded = false;
            result.status = 423;

            if (user.isLocked) {
                result.message = 'Account is loced, please contact admin to unlock the account.';
            } else if (user.isResetPasswordLocked) {
                result.message = 'Your account is locked by reset password, please check your mailbox to reset your password.';
            } else if (user.isAccessFailedLocked) {
                result.message = 'Your account access failed 3 times, please contact admin to unlock the account.';
            }
        }

        return result;
    }

    private _getUpdateConditions(model, auth) {
        const updateModel: IMongooseQueryModel = { $set: model };

        if (model.hasOwnProperty('audit')) {
            if (auth.isAuth) {
                model.audit.updatedBy = auth.user._id;
            }

            Object.keys(model.audit).forEach((key) => updateModel.$set[`audit.${key}`] = model.audit[key]);
            delete updateModel.$set.audit;
            delete updateModel.$set['audit.updatedDate'];
            updateModel.$currentDate = { 'audit.updatedDate': { $type: 'date' } };
        }

        return updateModel;
    }

    private resHandler({ resolve, reject }, { err, res }, resMessage?) {
        if (err) {
            return reject(err);
        } else {
            if (resMessage) {
                return resolve(resMessage);
            }

            return resolve(res);
        }
    }
}

const UserController = new Controller();

export { UserController };
