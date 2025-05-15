import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV, SENDER_EMAIL } from "../config/env.js";
import transporter from "../config/nodemailer.js";


export const register = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.json({ success: false, message: "Please provide all the fields" });
    }

    try {
        const exitsUser = await User.findOne({ email });
        const exitsUsername = await User.findOne({ username });
        if (exitsUsername && exitsUser) {
            return res.json({ success: false, message: "Username and Email already exists" });
        } else if (exitsUsername) {
            return res.json({ success: false, message: "Username already exists" });
        } else if (exitsUser) {
            return res.json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.cookie("token", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // Send Welcome email
        const mailOptions = {
            from: SENDER_EMAIL,
            to: email,
            subject: "🎉 Welcome to SWAGATOM – Let's Get Started!",
            html: `
    <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f9f9f9; color: #333;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); overflow: hidden;">
        <div style="background: #4B0082; color: #fff; padding: 20px 30px;">
          <h1 style="margin: 0;">Welcome to <span style="color: #FFD700;">SWAGATOM WORLD LLP</span>!</h1>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 18px;">Hi <strong>${username}</strong>,</p>
          <p style="font-size: 16px; line-height: 1.6;">
            We're absolutely thrilled to have you join the <strong>SWAGATOM</strong> family! 🚀<br />
            Whether you're here for amazing trips, inspiring activities, or new opportunities — you're in for an exciting journey.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Stay tuned for updates, announcements, and special events curated just for you.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">Cheers to new adventures!</p>
          <p style="margin-top: 30px;">Warm regards,<br /><strong>The SWAGATOM Team</strong></p>
        </div>
        <div style="background: #f1f1f1; text-align: center; padding: 15px; font-size: 14px; color: #777;">
          © ${new Date().getFullYear()} SWAGATOM. All rights reserved.
        </div>
      </div>
    </div>
  `,
        }

        await transporter.sendMail(mailOptions)

        return res.json({ success: true, message: "Registration successful", user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        return res.json({ success: false, message: "Error in registration" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: "Please provide all the fields" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.cookie("token", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Sanitize user (omit password) and log the returned user (for debugging)
        const sanitizedUser = { ...user.toObject(), password: undefined };
        return res.json({ success: true, message: "Login successful", user: sanitizedUser });
    } catch (error) {
        return res.json({ success: false, message: "Error in login" });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: NODE_ENV === "production" ? "none" : "strict",
        });
        return res.json({ success: true, message: "Logout successful" });
    } catch (error) {
        return res.json({ success: false, message: "Error in logout" });
    }
}

export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.user;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000)); // OTP generation
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10-minute expiration
        await user.save();

        // Send OTP via email
        const mailOption = {
            from: SENDER_EMAIL,
            to: user.email,
            subject: "🔐 Verify Your SWAGATOM Account",
            html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background-color: #4B0082; color: #fff; padding: 25px 30px;">
        <h1 style="margin: 0; font-size: 26px;">Welcome to <span style="color: #FFD700;">SWAGATOM</span>!</h1>
        <p style="margin: 5px 0 0; font-size: 16px;">Let's get your account verified.</p>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 18px; margin-bottom: 16px;">Hello <strong>${user.username}</strong>,</p>
        <p style="font-size: 16px; margin-bottom: 16px;">To complete your registration and secure your account, please use the One-Time Password (OTP) below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #4B0082; background: #f0f0f0; padding: 14px 28px; border-radius: 8px; border: 2px dashed #4B0082;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 16px; color: #555;">⚠️ This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
        <p style="margin-top: 30px;">Need help? Feel free to reply to this email or contact our support team.</p>
        <p style="margin-top: 40px;">With gratitude,<br/><strong>The SWAGATOM Team</strong></p>
      </div>
      <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 13px; color: #777;">
        © ${new Date().getFullYear()} SWAGATOM. All rights reserved.
      </div>
    </div>
  </div>
  `,
        };

        await transporter.sendMail(mailOption, (error, info) => {
            if (error) {
                console.error("Error sending OTP email:", error);
                return res.status(500).json({ success: false, message: "Error sending OTP email" });
            }
            console.log("OTP email sent:", info.response);
        });
        // Send success response

        return res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error in sending OTP:", error);
        return res.status(500).json({ success: false, message: "Error in sending OTP" });
    }
};

export const verifyEmail = async (req, res) => {
    const { otp } = req.body;
    const userId = req.user;
    if (!userId || !otp) {
        return res.json({ success: false, message: "Please provide all the fields" });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "user is not found" });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '',
            user.verifyOtpExpireAt = 0;
        await user.save();

        return res.json({ success: true, message: "Email Verified" })
    } catch (error) {
        return res.json({ success: false, message: "Error in verifying email" });
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        return res.json({ success: false, message: "Not authenticated" });
    }
}

//send otp for password reset
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ success: false, message: "Please provide all the fields" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        if (user.isAccountVerified === false) {
            return res.json({ success: false, message: "Account not verified" });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000)); // OTP generation
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10-minute expiration
        await user.save();

        const mailOption = {
            from: SENDER_EMAIL,
            to: email,
            subject: "🔐 Reset Your SWAGATOM Password",
            html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f2f2f2; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1); overflow: hidden;">
      
      <div style="background-color: #4B0082; color: #ffffff; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Reset Your <span style="color: #FFD700;">SWAGATOM</span> Password</h1>
      </div>

      <div style="padding: 30px;">
        <p style="font-size: 18px; margin-bottom: 20px;">Hello <strong>${user.username}</strong>,</p>
        
        <p style="font-size: 16px; margin-bottom: 16px;">
          We received a request to reset your password. Use the One-Time Password (OTP) below to continue:
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #4B0082; background-color: #f9f9f9; padding: 16px 32px; border: 2px dashed #4B0082; border-radius: 10px;">
            ${otp}
          </span>
        </div>
        
        <p style="font-size: 16px; color: #555;">
          ⏳ <strong>This OTP is valid for 10 minutes.</strong> Please do not share it with anyone.
        </p>

        <p style="margin-top: 30px;">If you did not request this, you can safely ignore this email.</p>

        <p style="margin-top: 40px;">Warm regards,<br><strong>The SWAGATOM Team</strong></p>
      </div>

      <div style="background-color: #f1f1f1; text-align: center; padding: 20px; font-size: 13px; color: #777;">
        © ${new Date().getFullYear()} SWAGATOM. All rights reserved.
      </div>

    </div>
  </div>
  `
        };

        await transporter.sendMail(mailOption, (error, info) => {
            if (error) {
                console.error("Error sending OTP email:", error);
                return res.status(500).json({ success: false, message: "Error sending OTP email" });
            }
            console.log("OTP email sent:", info.response);
        });

        return res.json({ success: true, message: "Reset Password OTP sent successfully" });
    } catch (error) {
        return res.json({ success: false, message: "Error in sending Reset Password OTP" });
    }
}

export const resetPassword = async (req, res) => {
    const { email, newpassword, otp } = req.body;
    if (!email || !newpassword || !otp) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.isAccountVerified) {
            return res.status(403).json({ success: false, message: "Account not verified" });
        }

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.status(401).json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(410).json({ success: false, message: "OTP has expired" });
        }

        const hashedPassword = await bcrypt.hash(newpassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};