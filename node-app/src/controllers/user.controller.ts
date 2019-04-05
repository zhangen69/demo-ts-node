import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Promise from 'promise';
import { mapColletionToUserDTO, mapDocToUserDTO } from '../DTOs/user.dto';
import { IChangePasswordRequest, IEmailConfirmRequest, IForgotPasswordRequest, IUser, IUserLogin, IUserRegister, IVerifyTokenRequest } from '../interfaces/user.interface';
import QueryModel from '../models/query.model';
import User from '../models/user.model';

class Controller {
    // user
    register(model: IUserRegister) {
        model.passwordHash = bcrypt.hashSync(model.password, 10);
        return new Promise((resolve, reject) => {
            const user = new User(model);
            // check duplicate username and email
            User.find({ $or: [ { username: model.username }, { email: model.email } ] }).then((docs) => {
                if (docs.length > 0) {
                    reject({
                        status: 400,
                        message: 'Username or Email already existed. Please try again',
                    });
                } else {
                    user.save().then((data) => {
                        const result = {
                            status: 201,
                            message: `user created successfully!`,
                            data,
                        };
                        resolve(result);
                    });
                }
            });
        });
    }

    login(model: IUserLogin) {
        return new Promise((resolve, reject) => {
            User.findOne({ username: model.username }).then((user: any) => {
                if (!user || !bcrypt.compareSync(model.password, user.passwordHash)) {
                    return reject({
                        status: 401,
                        message: 'Username or Password are incorrect. Please try again',
                    });
                }

                const token = jwt.sign(
                    { username: user.username, _id: user._id },
                    'secret this should be longer',
                    { expiresIn: '1d' },
                );

                return resolve({
                    status: 200,
                    message: `logged in!`,
                    token,
                    expiresIn: 60 * 60 * 24,
                });
            });
        });
    }

    logout(model: IUserLogin) {}

    changePassword(model: IChangePasswordRequest) {}

    fetchProfile(id: string) {}

    updateProfile(model: IUser) {}

    emailConfirmed(model: IEmailConfirmRequest) {}

    forgotPassword(model: IForgotPasswordRequest) {}

    verifyResetPasswordToken(model: IVerifyTokenRequest) {}

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

    fetchAll(queryModel: QueryModel) {
        return new Promise((resolve, reject) => {
            const { conditions, selections, options } = new QueryModel(queryModel).getQuery();

            User.estimatedDocumentCount(conditions).then((count) => {
                User.find(conditions, selections, options, (err, docs: any) => {
                    if (err) {
                        reject(err);
                    }
                }).then((data: any) => {
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

    create(model: IUserRegister) {}

    update(model: IUser) {}

    lock(model: IUser) {}

    unlock(model: IUser) {}

    resetPassword(model: IUser) {}

}

const UserController = new Controller();

export { UserController };
