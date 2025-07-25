import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    verifyOTP: { type: String, default: '' },
    verifyOTPExpireAt: { type: Number, default: 0 },
    bio: { type: String, default: '' },
    profilePic: { type: String, default: '' },
    nativeLanguage: { type: String, default: '' },
    learningLanguage: { type: String, default: '' },
    location: { type: String, default: ""},
    isOnboarded: { type: Boolean, default: false },
    isAccountVerified: { type: Boolean, default: false },
    ResetOTP: { type: String, default: '' },
    ResetOTPExpireAt: { type: Number, default: 0 },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true })

//pre hook (middleware) to hash the password before saving to DB (migrated feature from controller function only)
userSchema.pre('save', async function (next) {
    // Only hash if the password is new or modified
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        this.email = this.email.toLowerCase();
        next();
    } catch (error) {
        next(error);
    }
})

const userModel = mongoose.models.users || mongoose.model('User', userSchema);

export default userModel;