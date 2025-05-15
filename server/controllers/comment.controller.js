import Comment from "../models/comment.model.js";

// Create a new comment
export const createComment = async (req, res) => {
    try {
        const { content, postId, userId } = req.body;

        if (userId !== req.user.id) {
            return res.json({ success: false, message: "You are not allowed to create this comment" });
        }

        const newComment = new Comment({ content, postId, userId });
        const savedComment = await newComment.save();

        // Populate user info for saved comment
        const populatedComment = await savedComment.populate('userId', 'username profilePicture');

        return res.json({
            success: true,
            message: "Successfully created new comment!",
            comment: populatedComment
        });
    } catch (error) {
        return res.json({ success: false, message: "Error in creating comment" });
    }
};

// Get all comments for a post
export const getPostComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId })
            .sort({ createdAt: -1 })
            .populate('userId', 'username profilePicture');

        return res.json({ success: true, message: "All comments retrieved", comments });
    } catch (error) {
        next(error);
    }
};

// Like or Unlike a comment
export const likeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.json({ success: false, message: "Comment not found!" });
        }

        const userIndex = comment.likes.indexOf(req.user.id);
        if (userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        } else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }
        await comment.save();

        // Emit real-time update event to all clients
        req.app.locals.io.emit('commentLiked', {
            commentId: comment._id,
            numberOfLikes: comment.numberOfLikes,
        });

        return res.json({
            success: true,
            message: "Comment like status updated successfully",
            numberOfLikes: comment.numberOfLikes
        });
    } catch (error) {
        return res.json({ success: false, message: "Error in liking/unliking comment" });
    }
};

// Edit a comment
export const editComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.json({ success: false, message: "Comment not found!" });
        }
        if (comment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.json({ success: false, message: 'You are not allowed to edit this comment' });
        }

        const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            { content: req.body.content },
            { new: true }
        );

        return res.json({ success: true, message: "Comment updated successfully", comment: editedComment });
    } catch (error) {
        return res.json({ success: false, message: "Error in editing comment" });
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.json({ success: false, message: 'Comment not found' });
        }
        if (comment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.json({ success: false, message: 'You are not allowed to delete this comment' });
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        return res.json({ success: true, message: 'Comment has been deleted' });
    } catch (error) {
        return res.json({ success: false, message: "Error in deleting comment" });
    }
};

// Admin: Get all comments with pagination and stats
export const getcomments = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.json({ success: false, message: 'You are not allowed to get all comments' });
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;

        const comments = await Comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalComments = await Comment.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        const lastMonthComments = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        return res.json({
            success: true,
            comments,
            totalComments,
            lastMonthComments,
        });
    } catch (error) {
        return res.json({ success: false, message: "Error in retrieving all comments" });
    }
};
