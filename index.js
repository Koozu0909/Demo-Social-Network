const express = require('express')
const { json } = require('sequelize')
const app = express()
const port = 3005
const db = require('./models')
const cors = require('cors')


app.use(express.json());
app.use(cors())


///Router
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);


db.sequelize.sync().then(()=>{
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
});

