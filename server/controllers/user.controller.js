import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';

export const updateUser = async (req, res) => {
    if (req.user.id !== req.params.userId) {
        return res.json({ success: false, message: "You are not allowed to update this user" });
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters" });
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return res.json({ success: false, message: "Username must be between 7 and 20 characters" });
        }
        if (req.body.username.includes(' ')) {
            return res.json({ success: false, message: "Username cannot contain spaces" });
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return res.json({ success: false, message: "Username must be lowercase" });
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return res.json({ success: false, message: "Username can only contain letters and numbers" });
        }
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture,
                    password: req.body.password,
                },
            },
            { new: true }
        );
        const { password, ...rest } = updatedUser._doc;
        return res.json({ success: true, message: "User updated successfully", user: rest });
    } catch (error) {
        return res.json({ success: false, message: "Error in updating user" });
    }
};

export const deleteUser = async (req, res) => {
    if (!req.user.role === 'admin' && req.user.id !== req.params.userId) {
        return res.json({ success: false, message: 'You are not allowed to delete this user' });
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        return res.json({ success: true, message: 'User has been deleted' });
    } catch (error) {
        return res.json({ success: false, message: "Error in deleting user" });
    }
};

export const getUsers = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.json({ success: false, message: 'You are not allowed to see all users' });
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        });

        const totalUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            success: true,
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
        });
    } catch (error) {
        return res.json({ success: false, message: "Error in getting users" });
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const { password, ...rest } = user._doc;
        return res.status(200).json({ success: true, user: rest });
    } catch (error) {
        return res.json({ success: false, message: "Error in getting user" });
    }
};