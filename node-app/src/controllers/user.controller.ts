import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Promise from 'promise';
import { v4 as uuid } from 'uuid';
import { mapColletionToUserDTO, mapDocToUserDTO } from '../DTOs/user.dto';
import IMongooseQueryModel from '../interfaces/mongoose/mongooseQueryModel.interface';
import { IChangePasswordRequest, IEmailConfirmRequest, IForgotPasswordRequest, IResetPasswordRequest, IUser, IUserLogin, IUserRegister, IVerifyTokenRequest } from '../interfaces/user.interface';
import QueryModel from '../models/query.model';
import User from '../models/user.model';

class Controller {
    // user
    register(model: IUserRegister) {
        model.passwordHash = bcrypt.hashSync(model.password, 10);
        return new Promise((resolve, reject) => {
            const user = new User(model);
            // check duplicate username and email
            User.find({ $or: [{ username: model.username }, { email: model.email }] }).exec((err, docs) => {

                if (err) { throw new Error(err.toString()); }
                if (docs.length > 0) {
                    return reject({
                        status: 400,
                        message: 'Username or Email already existed. Please try again',
                    });
                }

                user.save((err, data) => {

                    if (err) { throw new Error(err.toString()); }
                    const result = {
                        status: 201,
                        message: `user created successfully!`,
                        data,
                    };
                    return resolve(result);
                });
            });
        });
    }

    login(model: IUserLogin) {
        return new Promise((resolve, reject) => {
            User.findOne({ username: model.username }).exec((err, user: any) => {

                if (err) { throw new Error(err.toString()); }
                if (!user || !bcrypt.compareSync(model.password, user.passwordHash)) {
                    const errorResult = {
                        status: 401,
                        message: 'Username or Password are incorrect. Please try again',
                    };

                    if (user && user.accessFailedCount < 3) {
                        const isLocked = user.accessFailedCount + 1 === 3;
                        user.updateOne({ accessFailedCount: user.accessFailedCount + 1, isAccessFailedLocked: isLocked }).exec((err, res: any) => {

                            if (err) { throw new Error(err.toString()); }
                            return reject(errorResult);
                        });
                    } else {
                        if (user && user.isAccessFailedLocked) {
                            errorResult.status = 423;
                            errorResult.message = 'Your account access failed 3 times, please contact admin to unlock the account.';
                        }

                        return reject(errorResult);
                    }
                } else {
                    const { succeeded, status, message } = this.userLockHandler(user);

                    if (!succeeded) {
                        return reject({ status, message });
                    }

                    const token = jwt.sign(
                        { username: user.username, _id: user._id },
                        'secret this should be longer',
                        { expiresIn: '1d' },
                    );

                    const result = {
                        status: 200,
                        message: `logged in!`,
                        token,
                        expiresIn: 60 * 60 * 24,
                    };

                    if (user.accessFailedCount > 0) {
                        user.updateOne({ accessFailedCount: 0 }).exec((err, res: any) => {
                            return resolve(result);
                        });
                    } else {
                        return resolve(result);
                    }
                }
            });
        });
    }

    logout(model: IUserLogin) {
        return new Promise((resolve, reject) => { });
    }

    changePassword(model: IChangePasswordRequest, auth) {
        return new Promise((resolve, reject) => {
            User.findOne({ username: model.username }).exec((err, user: any) => {
                if (user == null) { throw new Error('Not found user'); }

                if (!bcrypt.compareSync(model.password, user.passwordHash)) {
                    return reject({
                        status: 403,
                        message: 'Password are invalid! Please try again.',
                    });
                }

                user.passwordHash = bcrypt.hashSync(model.newPassword, 10);

                user.save().then((data) => {
                    const result = {
                        status: 201,
                        message: `user password changed successfully!`,
                        data,
                    };
                    resolve(result);
                });
            });
        });
    }

    fetchProfile(id: string) {
        return new Promise((resolve, reject) => {
            User.findById(id).then((user: any) => {
                if (user == null) { throw new Error('User not found'); }

                return resolve({
                    status: 200,
                    data: mapDocToUserDTO(user),
                });
            });
        });
    }

    updateProfile(model: IUser) {
        return new Promise((resolve, reject) => {
            User.findById(model._id).exec((err, user: any) => {
                if (user === null) { throw new Error('User not found'); }

                user.updateOne(model).exec((err, doc: any) => {
                    return resolve({
                        status: 201,
                        message: 'update profile successfully!',
                    });
                });
            });

        });
    }

    emailConfirmed(model: IEmailConfirmRequest) {
        return new Promise((resolve, reject) => { });
    }

    forgotPassword(model: IForgotPasswordRequest) {
        return new Promise((resolve, reject) => {
            User.findOne({ username: model.username, email: model.email }).exec((err, user: any) => {
                if (user == null) { return new Error('User not found'); }

                const set = { isResetPasswordLocked: true, resetPasswordToken: uuid() };

                const url = `http://localhost:4200/auth/resetPassword/${set.resetPasswordToken}`;

                // send email service

                user.updateOne(set).exec((err, data) => {
                    const result = {
                        status: 200,
                        url,
                        message: `sent forgot password email successfully!`,
                    };

                    return resolve(result);
                });
            });
        });
    }

    verifyResetPasswordToken(model: IVerifyTokenRequest) {
        return new Promise((resolve, reject) => {
            User.findOne({ resetPasswordToken: model.token }).exec((doc: any) => {
                if (doc == null) { throw new Error('Token is invalid'); }

                return resolve({
                    status: 200,
                    verified: true,
                });
            });
        });
    }

    // admin
    fetch(id: string) {
        return new Promise((resolve, reject) => {
            User.findById(id, (err, docs: any) => {
                if (err) {
                    reject(err);
                }
            }).then((doc: any) => {
                if (doc == null) { throw new Error('Product not found!'); }

                const result = {
                    status: 200,
                    data: mapDocToUserDTO(doc),
                };

                resolve(result);
            });
        });
    }

    fetchAll(queryModel: QueryModel, auth?) {
        return new Promise((resolve, reject) => {
            const { conditions, selections, options } = new QueryModel(queryModel).getQuery();

            if (auth.isAuth) {
                // $ne as NOT EQUAL, username not equal to current user
                conditions.username = { $ne: auth.user.username };
            }

            User.estimatedDocumentCount(conditions).then((count) => {
                User.find(conditions, selections, options).exec((err, data: any) => {
                    if (err) { reject(err); }
                    const result = {
                        status: 200,
                        data: mapColletionToUserDTO(data),
                        totalItems: count,
                        currentPage: queryModel.currentPage,
                        totalPages: Math.ceil(count / queryModel.pageSize),
                    };

                    resolve(result);
                });
            });
        });
    }

    create(model: IUserRegister) {
        return this.register(model);
    }

    update(model: IUser, auth) {
        return new Promise((resolve, reject) => {
            User.findById(model._id).exec((err, user) => {

                if (err) { throw new Error(err.toString()); }
                if (user == null) { throw new Error(`user not found!`); }

                user.updateOne(this._getUpdateConditions(model, auth)).exec((err, doc) => {

                    if (err) { throw new Error(err.toString()); }

                    const result = {
                        status: 201,
                        message: `user updated successfully!`,
                    };

                    resolve(result);
                });
            });
        });
    }

    lock(model: IUser, auth) {
        return new Promise((resolve, reject) => {
            User.findById(model._id).exec((err, doc) => {
                if (err) { throw new Error(err.toString()); }
                if (doc == null) { throw new Error(`user not found!`); }

                doc.updateOne({ isLocked: true }).then((res) => {
                    const result = {
                        status: 201,
                        message: `user locked successfully!`,
                    };

                    resolve(result);
                });

            });
        });
    }

    unlock(model: IUser, auth) {
        return new Promise((resolve, reject) => {
            User.findById(model._id).exec((err, user: any) => {

                if (err) { throw new Error(err.toString()); }
                if (user == null) { throw new Error(`user not found!`); }

                const set: any = { isLocked: false };

                if (user.isAccessFailedLocked) {
                    set.isAccessFailedLocked = false;
                    set.accessFailedCount = 0;
                }

                user.updateOne(set).exec((err, res) => {

                    if (err) { throw new Error(err.toString()); }
                    const result = {
                        status: 201,
                        message: `user unlocked successfully!`,
                    };

                    resolve(result);
                });

            });
        });
    }

    resetPassword(model: IResetPasswordRequest) {
        return new Promise((resolve, reject) => {
            User.findOne({ username: model.username, resetPasswordToken: model.token }).exec((err, user: any) => {

                if (err) { throw new Error(err.toString()); }
                if (user == null) { throw new Error('Failed to reset password. Username is invalid or token is expired.'); }

                const newPasswordHash = bcrypt.hashSync(model.newPassword, 10);
                const set = {
                    passwordHash: newPasswordHash,
                    resetPasswordToken: null,
                    isResetPasswordLocked: false,
                };

                user.update(set).exec((err, res: any) => {
                    if (err) { throw new Error(err.toString()); }
                    return resolve({
                        status: 201,
                        message: 'your password was changed successfully!',
                    });
                });
            });
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
}

const UserController = new Controller();

export { UserController };
