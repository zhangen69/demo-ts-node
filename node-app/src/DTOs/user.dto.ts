export class UserDTO {
    // tslint:disable-next-line:variable-name
    _id: string;
    username: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    avatarImageUrl: string;
    signatureImageUrl: string;
    isLocked: boolean;
    isResetPasswordLocked: boolean;
    isAccessFailedLocked: boolean;
    lastLoggedIn: Date;
    audit: any;

    constructor(user) {
        this._id = user._id;
        this.username = user.username;
        this.displayName = user.displayName;
        this.email = user.email;
        this.phoneNumber = user.phoneNumber;
        this.avatarImageUrl = user.avatarImageUrl;
        this.signatureImageUrl = user.signatureImageUrl;
        this.isLocked = user.isLocked;
        this.isResetPasswordLocked = user.isResetPasswordLocked;
        this.isAccessFailedLocked = user.isAccessFailedLocked;
        this.lastLoggedIn = user.lastLoggedIn;
        this.audit = user.audit;
    }

}

export function mapColletionToUserDTO(collection: any): UserDTO[] {
    const users: UserDTO[] = [];

    for (const index in collection) {
        users.push(new UserDTO(collection[index]));
    }

    return users;
}

export function mapDocToUserDTO(doc: any): UserDTO {
    return new UserDTO(doc);
}
