const express = require("express")
const Post = require("../models/Postmodel.js")
const User = require("../models/Usermodel.js")

const router = express.Router()

// to create a post
router.post("/", async (req, res) => {
    try {
        const { author, title, summary, description, images: cover } = req.body
        const likes = {}
        const comments = []
        const user = await User.findById(author)
        const post = await Post.create({ author, title, summary, description, cover, likes: likes, comments: comments })
        user.posts.push(post)
        user.markModified("posts")
        await user.save()
        const posts = await Post.find()
        res.status(201).json(posts)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

// to get all posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().populate("author", ["username"])
        res.status(200).json(posts)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

// to get a post
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate("author", ["username", "email", "profilephoto"])
        res.status(200).json(post)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

// to edit a post 
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, title, summary, description, images: cover } = req.body
        const getPost = await Post.findById(id)
        const isAuthor = (JSON.stringify(userId) === JSON.stringify(getPost.author))
        if (isAuthor) {
            const post = await Post.findByIdAndUpdate(id, { title, summary, description, cover })
            const posts = await Post.find()
            res.status(200).json(posts)
        } else {
            res.status(401).json("You aren't permitted")
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})


// to delete a post
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body
        const posts = await Post.findById(id)

        const isAuthor = (JSON.stringify(userId) === JSON.stringify(posts.author))
        if (isAuthor) {
            await Post.findByIdAndDelete(id);
            const post = await Post.find()
            res.status(200).json(post)
        } else {
            res.status(401).json("You aren't permitted")
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})

//Update Likes
router.patch("/:id/likes", async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatePost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true } // to return the updated value 
        );
        const updatedposts = await Post.find()
        res.status(200).json(updatedposts)

    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.patch("/:id/comments", async (req, res) => {
    try {
        const { id } = req.params;
        const { loggedUser, username, email, comment } = req.body;
        const post = await Post.findById(id);
        post.comments.push({ loggedUser, username, email, comment })
        const updatedpost = await Post.findByIdAndUpdate(id, { comments: post.comments }, { new: true })
        const updatedposts = await Post.find()
        res.status(200).json(updatedposts)

    } catch (error) {
        res.status(400).send(error.message)
    }
})



module.exports = router

