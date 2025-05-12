import Post from "../models/post.model.js";

//A Function to Create a Post
export const createPost = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin access only" });
    }
    if (!req.body.title || !req.body.content) {
        return res.json({ success: false, message: "Please provide all Fields" })
    }
    try {
        const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
        const newPost = new Post({ ...req.body, slug, userId: req.user.id, });
        await newPost.save();

        return res.json({ success: true, message: "Successfully created new post!" })
    } catch (error) {
        return res.json({ success: false, message: "Error in Create Post" });
    }
}

// A Function to Get a Post
export const getposts = async (req, res) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
        })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.json({
            success: true,
            message: "Post is retrived",
            posts,
            totalPosts,
            lastMonthPosts,
        });
    } catch (error) {
        return res.json({ success: true, message: "Error in Getting Post" })
    }
};

//A Function to Delete a Post
export const deletePost = async (req, res) => {
    if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
        return res.json({ success: false, message: "You're not allowed to delete this post" });
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        return res.json({ success: true, message: "The post has been deleted" });
    } catch (error) {
        return res.json({ success: false, message: "Error in Delete in Post" });
    }
}

//A Function to Update a Post
export const updatePost = async (req, res) => {
    if (req.user.role !== 'admin' || req.user.id !== req.params.userId) {
        return res.json({ success: false, message: "You are not allowed to update this post" });
    }
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            { ...req.body },
            { new: true }
        );
        if (!updatedPost) {
            return res.json({ success: false, message: "Post not found" });
        }
        return res.json({ success: true, message: "Post updated successfully", data: updatedPost });
    } catch (error) {
        return res.json({ success: false, message: "Error in Update Post" });
    }
}