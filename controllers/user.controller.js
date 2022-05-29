const UserModel = require('../models/user.model');
const mongoose = require('mongoose');

/**
 * Get all users without sending password
 * */
const getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
};

/**
 * Get one user by its ID  without sending password
 * */
const getUser = (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json('ID unknown : ' + req.params.id)

    UserModel.findById(req.params.id, (err, data) => {
        if(!err) res.status(200).json(data);
        else console.log('ID unknown : ' + err);
    }).select('-password');
};

/**
 * Update a user by its ID user by its ID
 * */
const updateUser = async (req, res) => {

    const { id: _id } = req.params;
    const bio = req.body.bio;

    try{
        const updateUser = await UserModel.findByIdAndUpdate(
            { _id },
            { $set: { bio } },
            { new: true, runValidators: true });
        if(!updateUser){
            return res.status(404).json({ message: "L'utilisateur " + req.params.id + " n'existe pas" });
        }

        res.status(200).json("L'utilisateur a bien été mis à jour");

    } catch(e) {
        return res.status(500).json({ message: e });
    }
};


/**
 * Delete a user by its ID
 * */
const deleteUser = async (req, res) => {

    try{
        const user = await UserModel.findByIdAndDelete({_id: req.params.id})

        if(!user){
            return res.status(404).json({ message: "L'utilisateur " + req.params.id + " n'existe pas"});
        }

        res.status(200).json({ message: "L'utilisateur a bien été supprimé"});
    } catch (e) {
        res.status(500).json({ message: e });
    }
}

/**
 * Follow another user
 * */
const follow = async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(req.body.idToFollow))
        return res.status(404).json('ID to follow unknown')

    try {
        /*----- ADD TO THE FOLLOWER LIST -----*/
        const follow = await UserModel.findByIdAndUpdate(
            {_id: req.params.id},
            { $addToSet: { following: req.body.idToFollow } },
            { new: true, runValidators: true }
        );

        /*----- ADD TO FOLLOWING LIST -----*/
        const followed = await UserModel.findByIdAndUpdate(
            {_id: req.body.idToFollow},
            { $addToSet: { followers: req.params.id } },
            { new: true, runValidators: true }
        );

        if (!follow || !followed){
            return res.status(404).json({ message: "L'utilisateur n'existe pas" })
        }

        res.status(200).json({ message: "Contact followed !" })

    } catch (e) {
        res.status(500).json({ message: e });
    }
}

/**
 * Unfollow another user
 * */
const unfollow = async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(req.body.idToUnfollow))
        return res.status(404).json('ID to follow unknown')

    try {
        const unfollow = await UserModel.findByIdAndUpdate(
            {_id: req.params.id},
            { $pull: { following: req.body.idToUnfollow } },
            { new: true, runValidators: true }
        );

        const unfollowed = await UserModel.findByIdAndUpdate(
            {_id: req.body.idToUnfollow},
            { $pull: { followers: req.params.id } },
            { new: true, runValidators: true }
        );

        if(!unfollow || !unfollowed){
            return res.status(404).json({ message: "L'utilisateur n'existe pas" })
        }

        res.status(200).json({ message: "Contact unfollowed ! " })
    } catch (e) {
        res.status(500).json({ message: e });
    }
}

module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    follow,
    unfollow
};