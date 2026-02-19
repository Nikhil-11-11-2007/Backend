const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

async function followUserController(req, res) {

    // this user name come from who already logged in
    // jo follow user kr rha hai wo follower hai
    const followerUsername = req.user.username

    // user name came from /follow/:username
    // jis useer ko follow kiya ja rha hai vo hao followee
    const followeeUsername = req.params.username

    if (followeeUsername == followerUsername) {
        return res.status(400).json({
            message: "You cannot follow yuerself"
        })
    }

    const isValidFollowee = await userModel.findOne({
        username: followeeUsername
    })

    if (!isValidFollowee) {
        return res.status(404).json({
            message: "Username not found"
        })
    }

    const existingFollow = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if (existingFollow) {
        if (existingFollow.status === "pending") {
            return res.status(200).json({
                message: "Follow request already sent"
            })
        }

        if (existingFollow.status === "accepted") {
            return res.status(200).json({
                message: `You are already following ${followeeUsername}`
            })
        }

        if (existingFollow.status === "rejected") {
            existingFollow.status = "pending"
            await existingFollow.save()

            return res.status(200).json({
                message: "Follow request sent again"
            })
        }
    }

    const followRecord = await followModel.create({
        follower: followerUsername,
        followee: followeeUsername,
        status: "pending"
    })

    res.status(201).json({
        message: `You are now following ${followeeUsername}`,
        followRecord
    })
}

async function unfollowUserController(req, res) {

    const followerUsername = req.user.username

    const followeeUsername = req.params.username

    if (followeeUsername == followerUsername) {
        return res.status(400).json({
            message: "you cannot follow or unfollow yourself"
        })
    }

    const isUserFollowed = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if (!isUserFollowed) {
        return res.status(200).json({
            message: `You are not following ${followeeUsername}`
        })
    }

    await followModel.findByIdAndDelete(isUserFollowed._id)

    res.status(200).json({
        message: `You have unfollowe ${followeeUsername}`
    })

}

module.exports = { followUserController, unfollowUserController }