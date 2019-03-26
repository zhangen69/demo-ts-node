import mongoose from 'mongoose';
import auditable from './auditable.model';

const schema = new mongoose.Schema({
    username: { type: String, required: true },
    passwordHash: { type: String, required: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    avatarImageUrl: { type: String, default: null },
    signatureImageUrl: { type: String, default: null },
    isLocked: { type: Boolean, default: false },
    isResetPasswordLocked: { type: Boolean, default: false },
    resetPasswordToken: { type: String, default: null },
    lastLoggedIn: { type: Date, default: null },
    accessFailedCount: { type: Number, default: 0 },
    isAccessFailedLocked: { type: Boolean, default: false },
});

schema.add(auditable);

export default mongoose.model('User', schema);
