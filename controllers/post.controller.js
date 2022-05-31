const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const mongoose = require('mongoose');

/**
 * Get all posts
 * */
const readPost = (req, res) => {
    PostModel.find((err, docs) => {
        if(!err) res.send(docs);
        else console.log('Error to get data ' + err);
    })
};

/**
 * Create a new post
 * */
const createPost = async (req, res) => {
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
const updatePost = async (req, res) => {
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
const deletePost = async (req, res) => {
    try{
        const post = await PostModel.findByIdAndDelete({ _id: req.params.id });

        if(!post) return res.status(404).json({ message: "Message inconnu." });

        res.status(200).json({ message: "Le post a bien été supprimé." });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};


/**
 * Like a new post by its ID
 * */
const like = async (req, res) => {

    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Post to like unknown'});

    try {
        const like = await PostModel.findByIdAndUpdate(
            {_id: req.params.id},
            { $addToSet: { likers: req.body.id } },
            { new: true, runValidators: true }
        );

        const liked = await UserModel.findByIdAndUpdate(
            {_id: req.body.id},
            { $addToSet: { likes: req.params.id } },
            { new: true, runValidators: true }
        );

        if(!like || !liked ) return res.status(404).json({ message: "Post to like unknown !!" });

        res.status(200).json({ message: 'Post liked.' });

    } catch (err) {
        res.status(500).json({ message: err});
    }
};

/**
 * Unlike a post by its ID
 * */
const unlike = async (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Post to unlike unknown'});

    try {
        const like = await PostModel.findByIdAndUpdate(
            {_id: req.params.id},
            { $pull: { likers: req.body.id } },
            { new: true, runValidators: true }
        );

        const liked = await UserModel.findByIdAndUpdate(
            {_id: req.body.id},
            { $pull: { likes: req.params.id } },
            { new: true, runValidators: true }
        );

        if(!like || !liked ) return res.status(404).json({ message: "Post to unlike unknown !!" });

        res.status(200).json({ message: 'Post unliked.' });

    } catch (err) {
        res.status(500).json({ message: err});
    }
};
                                                                        
module.exports = {
    createPost,
    readPost,
    updatePost,
    deletePost,
    like,
    unlike
}