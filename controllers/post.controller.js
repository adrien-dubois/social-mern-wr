const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectId = require('mongoose').Types.ObjectId;

/**
 * Get all posts
 * */
exports.readPost = (req, res) => {
    PostModel.find((err, docs) => {
        if(!err) res.send(docs);
        else console.log('Error to get data ' + err);
    })
};

/**
 * Create a new post
 * */
exports.createPost = async (req, res) => {
    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        video: req.body.video,
        likers: [],
        comments: []
    });

    try{
        const post = await newPost.save();
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400).json(err);
    }
};


/**
 * Update a post with its ID
 * */
exports.updatePost = async (req, res) => {
    const updatedRecord = {
        message: req.body.message
    };
    const { id: _id } = req.params;

    try{
        const updatedPost = await PostModel.findByIdAndUpdate(
            { _id },
            { $set: updatedRecord },
            { new: true, runValidators: true });
        if(!updatedPost) return res.status(404).json({ message: "Message inconnu." });

        res.status(200).json('Le post a bien été mis à jour');
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};


/**
 * Delete a post by its ID
 * */
exports.deletePost = async (req, res) => {
    try{
        const post = await PostModel.findByIdAndDelete({ _id: req.params.id });

        if(!post) return res.status(404).json({ message: "Message inconnu." });

        res.status(200).json({ message: "Le post a bien été supprimé." });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};