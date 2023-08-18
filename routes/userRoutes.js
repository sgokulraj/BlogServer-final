const express = require("express")
const User = require("../models/Usermodel.js")
const bcrypt = require("bcrypt")
const Post = require("../models/Postmodel.js")

const router = express.Router()

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password, mobile, gender, images: profilephoto } = req.body
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        const user = await User.create({ username, email, mobile, gender, profilephoto, password: passwordHash });
        res.status(201).json(user)
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send("Email already exists")
        }
        res.status(400).send(error.message)
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            const passwordCheck = await bcrypt.compare(password, user.password);
            if (passwordCheck) {
                delete user.password;
                res.status(200).json(user);
            } else {
                res.status(400).send("Invalid Credentials");
            }
        } else {
            res.status(400).send("User not found");
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
})

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const getUser = await User.findById(id)
        res.status(200).json(getUser)
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, mobile, gender, images: profilephoto } = req.body
        const updatedUser = await User.findByIdAndUpdate(id, { username, email, mobile, gender, profilephoto })
        const getUpdatedUser = await User.findById(id)
        res.status(200).json(getUpdatedUser)
    } catch (error) {
        res.status(400).send(error.message);
    }
})


router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).populate('posts')
        user.posts.map(async (post) => {
            await Post.findByIdAndDelete(post._id)
        })
        await User.findByIdAndDelete(id)
        res.send("user deleted successfully")
    } catch (err) {
        res.status(400).send(err.message);
    }
})

// to get user post
router.get("/:id/post", async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).populate('posts')
        res.json(user.posts)
    } catch (error) {
        res.status(400).send(error.message)
    }
})


module.exports = router