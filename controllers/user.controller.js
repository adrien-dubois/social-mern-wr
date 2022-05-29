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
        return res.status(404).json('ID unknown : ' + req.params.id)

    UserModel.findById(req.params.id, (err, data) => {
        if(!err) res.status(200).json(data);
        else console.log('ID unknown : ' + err);
    }).select('-password');
};

/*----- UPDATE AN USER BY ITS ID -----*/
module.exports.updateUser = async (req, res) => {

    const { id: _id } = req.params;
    const bio = req.body.bio;

    try{
        const updateUser = await UserModel.findByIdAndUpdate(
            { _id },
            {
                $set: { bio }
            },
            { new: true, runValidators: true });
        if(!updateUser){
            return res.status(404).json({ message: "L'utilisateur " + req.params.id + " n'existe pas" });
        }

        res.status(200).json("L'utilisateur a bien été mis à jour");

    } catch(e) {
        return res.status(500).json({ message: e });
    }
};

exports.deleteUser = async (req, res) => {

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