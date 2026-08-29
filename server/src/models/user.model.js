/**
 * @file user.model.js
 * @description Defines account persistence for institution and administrator access.
 * @layer Server Model
 * @interacts auth.service.js and MongoDB through Mongoose.
 * @futureWork Add account lifecycle fields only when a defined product requirement exists.
 * @nonGoal Do not create credentials, tokens, or HTTP responses here.
 */
import mongoose from 'mongoose';

export const USER_ROLES = Object.freeze({
  INSTITUTION: 'INSTITUTION',
  ADMIN: 'ADMIN',
});

const userSchema = new mongoose.Schema({
  institutionName: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 254 },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: Object.values(USER_ROLES), default: USER_ROLES.INSTITUTION, required: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
