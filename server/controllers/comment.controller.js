import Comment from "../models/comment.model.js";

//A Function to creaate a Comment 
export const createComment = async (req, res) => {
    try {
        const { content, postId, userId } = req.body;

        if (userId !== req.user.id) {
            return res.json({ success: false, message: "'You are not allowed to create this comment'" });
        }
        const newComment = new Comment({
            content,
            postId,
            userId,
        });
        await newComment.save();
        return res.json({ success: true, message: "Successfully created new comment!" })
    } catch (error) {
        return res.json({ success: false, message: "Error in Create Comment" });
    }
};

//A Function to Get all comments from particular post
export const getPostComments = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({
            createdAt: -1,
        });
        return res.json({ success: true, message: "All comments retrived ", comments });
    } catch (error) {
        next(error);
    }
};

//A Function to count and add likes to a comment
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
        return res.json({ success: true, message: "Your update is add Successfully" })
    } catch (error) {
        return res.json({ success: false, message: "Error in Liked Comment" });
    }
};

// A Function to Edit a Comment 
export const editComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.json({ success: false, message: "Comment not found!" });
        }
        if (comment.userId !== req.user.id && req.user.role !== 'admin') {
            return res.json({ success: false, message: 'You are not allowed to edit this comment' });
        }

        const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content: req.body.content,
            },
            { new: true }
        );
        return res.json({ success: true, message: "Your update is add Successfully" })
    } catch (error) {
        return res.json({success: false, message: "Error in Edit Comment"});
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.json({success: false, message: 'Comment not found'});
        }
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return res.json({success: false, message: 'You are not allowed to delete this comment'});
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        return res.json({success: true, message: 'Comment has been deleted'});
    } catch (error) {
        return res.json({success: false, message: "Error in Delete Comment"});
    }
};

export const getcomments = async (req, res, next) => {
    if (!req.user.isAdmin)
        return res.json({success: false, message: 'You are not allowed to get all comments'});
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
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthComments = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        return res.json({ success: true,comments, totalComments, lastMonthComments });
    } catch (error) {
        return res.json({ success: false, message: "Error in Get Comments" });
    }
};