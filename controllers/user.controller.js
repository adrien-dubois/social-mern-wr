const UserModel = require('../models/user.model');
const ObjectId = require('mongoose').Types.ObjectId;

/*----- GET ALL USERS WITHOUT PASSWORDS -----*/
module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
};

/*----- GET ONE USER BY ITS ID WITHOUT PASSWORD -----*/
module.exports.getUser = (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).json('ID unknown : ' + req.params.id)

    UserModel.findById(req.params.id, (err, data) => {
        if(!err) res.status(200).json(data);
        else console.log('ID unknown : ' + err);
    }).select('-password');
};

/*----- UPDATE AN USER BY ITS ID -----*/
module.exports.updateUser = async (req, res) => {

    const { id: _id } = req.params;
    const bio = req.body.bio;

    if (!ObjectId.isValid(_id)) return res.status(404).send('ID unknown');

    try{
        await UserModel.findOneAndUpdate(
            { _id },
            {
                $set: { bio }
            },
            {new: true, upsert: true, setDefaultsOnInsert: true});

        return res.status(200).json("L'utilisateur a bien été mis à jour");

    } catch(err) {
        return res.status(500).json({ message: err });
    }
};