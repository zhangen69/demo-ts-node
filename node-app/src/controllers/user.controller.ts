import bcrypt from 'bcrypt';
import Promise from 'promise';
import { IChangePasswordRequest, IEmailConfirmRequest, IForgotPasswordRequest, IUser, IUserLogin, IUserRegister, IVerifyTokenRequest } from '../interfaces/userLogin.interface';
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

    login(model: IUserLogin) {}

    logout(model: IUserLogin) {}

    changePassword(model: IChangePasswordRequest) {}

    fetchProfile(id: string) {}

    updateProfile(model: IUser) {}

    emailConfirmed(model: IEmailConfirmRequest) {}

    forgotPassword(model: IForgotPasswordRequest) {}

    verifyResetPasswordToken(model: IVerifyTokenRequest) {}

    // admin
    fetchAll(queryModel: QueryModel) {}

    create(model: IUserRegister) {}

    fetch(id: string) {}

    update(model: IUser) {}

    lock(model: IUser) {}

    unlock(model: IUser) {}

    resetPassword(model: IUser) {}

}

const UserController = new Controller();

export { UserController };
