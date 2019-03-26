import Promise from 'promise';
import { IChangePasswordRequest, IEmailConfirmRequest, IForgotPasswordRequest, IUser, IUserLogin, IUserRegister, IVerifyTokenRequest } from '../interfaces/userLogin.interface';
import QueryModel from '../models/query.model';

class UserController {
    constructor() {}

    // user
    register(model: IUserRegister) {}

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

export { UserController };
