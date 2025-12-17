"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admission = void 0;
const mongoose_1 = require("mongoose");
const auth_model_1 = require("../auth/auth.model");
const AdmissionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        index: true,
    },
    collegeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "College",
        required: true,
        index: true,
    },
    candidateName: {
        type: String,
        required: true,
        trim: true,
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    candidateEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    candidatePhone: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    candidateImage: {
        type: auth_model_1.ImageSchema,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    applicationDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
AdmissionSchema.index({ userId: 1, collegeId: 1 }, { unique: true });
exports.Admission = (0, mongoose_1.model)("Admission", AdmissionSchema);
