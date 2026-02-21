const express = require("express")
const { followUserController, unfollowUserController } = require("../controllers/user.controller")
const identifyUser = require("../middlewares/auth.middleware")

const userRouter = express.Router()

// method: post/api/users/follow/:userid
// follow a user
// private access

userRouter.post("/follow/:username", identifyUser, followUserController);

userRouter.post("/unfollow/:username", identifyUser, unfollowUserController)



module.exports = userRouter