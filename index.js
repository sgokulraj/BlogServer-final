const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")

const userRoutes = require("./routes/userRoutes.js")
const postRoutes = require("./routes/postRoutes.js")
const imageRoutes = require("./routes/imageRoutes.js")

dotenv.config()
const app = express()

const PORT = process.env.PORT;
const CONNECTION_URL = process.env.CONNECTION_URL

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use("/users", userRoutes)
app.use("/posts", postRoutes)
app.use("/images", imageRoutes)


app.get("/", (req, res) => {
    res.send("hello world")
})

mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, console.log(`server is connected`));
}).catch((err) => console.log(err));