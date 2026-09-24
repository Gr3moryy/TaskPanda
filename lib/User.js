import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["client", "provider", "admin"],
      default: "client",
    },
    fullName: {
      type: String,
      trim: true,
      maxlength: [50, "Full name cannot exceed 50 characters"],
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    professions: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const bcrypt = (await import("bcryptjs")).default;
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const bcrypt = (await import("bcryptjs")).default;
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(token).digest("hex");
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
  return token;
};

userSchema.methods.validatePasswordResetToken = function (token) {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const isMatch = this.passwordResetToken === hashedToken;
  const isExpired = this.passwordResetExpires < Date.now();
  return { isMatch, isExpired };
};

userSchema.methods.clearPasswordResetToken = function () {
  this.passwordResetToken = undefined;
  this.passwordResetExpires = undefined;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;