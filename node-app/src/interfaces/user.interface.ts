interface IUserLogin {
    username: string;
    password: string;
}

interface IUserRegister {
    username: string;
    password: string;
    passwordHash: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    avatarImageUrl?: string;
    signatureImageUrl?: string;
}

interface IUser {
    _id?: string;
    displayName?: string;
    email?: string;
    phoneNumber?: string;
    avatarImageUrl?: string;
    signatureImageUrl?: string;
}

interface IForgotPasswordRequest {
    username: string;
    email: string;
}

interface IEmailConfirmRequest {
    email: string;
    token: string;
}

interface IVerifyTokenRequest {
    email: string;
    token: string;
}

interface IChangePasswordRequest {
    username: string;
    password: string;
    newPassword: string;
}

export {
    IUserLogin,
    IUserRegister,
    IUser,
    IForgotPasswordRequest,
    IEmailConfirmRequest,
    IVerifyTokenRequest,
    IChangePasswordRequest,
};
