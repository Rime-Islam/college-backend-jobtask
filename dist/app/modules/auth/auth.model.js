"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = exports.ImageSchema = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../../config"));
exports.ImageSchema = new mongoose_1.Schema({
    location: { type: String, required: true },
    key: { type: String, required: true },
}, { _id: false });
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ["admin", "student"],
        default: "student"
    },
    profileImage: {
        type: exports.ImageSchema,
    },
    university: { type: String, trim: true },
    address: { type: String, trim: true },
    dateOfBirth: { type: Date },
    phoneNumber: { type: String, trim: true },
}, { timestamps: true });
UserSchema.statics.isUserExist = async function (email) {
    return this.findOne({ email }).select("+password");
};
UserSchema.statics.isPasswordMatched = async function (plainTextPassword, hashTextPassword) {
    const match = await bcryptjs_1.default.compare(plainTextPassword, hashTextPassword);
    return match;
};
UserSchema.statics.updatePassword = async function (id, password) {
    const hashedPassword = await bcryptjs_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
    return await this.findByIdAndUpdate(id, { password: hashedPassword }, { new: true, runValidators: true }).select("+password");
};
exports.Users = (0, mongoose_1.model)("Users", UserSchema);
