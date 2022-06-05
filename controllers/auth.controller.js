const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { signUpErrors, signinErrors } = require("../utils/errors.utils");

/*----- This calc for 3 days valid -----*/
const maxAge = 3 * 24 * 60 * 60 * 1000;

/**
 * Register method
 * */
const signUp = async (req, res) => {

    const { pseudo, email, password, picture } = req.body

    try {
        const user = await UserModel.create({pseudo, email, password, picture});
        res.status(201).json({ user: user._id });
    }
    catch (err){
        const errors = signUpErrors(err);
        res.status(500).json({ errors });
    }
};

/**
 * Login method
 * */
const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email: email});
        if(!existingUser) return res.status(404).json({ message: "Email et/ou mot de passe incorrect(s)." });

        const isPasswordsValid = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordsValid) return res.status(400).send( "Email et/ou mot de passe incorrect(s)." );


        const token = jwt.sign(
            {  email: existingUser.email ,id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: maxAge }
        );

        res.cookie('jwt', token, { httpOnly: true, maxAge });
        res.status(200).json({ result: existingUser, message: "Connection established" });

    } catch (err) {
        const errors = signinErrors(err);
        res.status(500).json({ errors });
    }
};

/**
 * Logout method
 * */
const logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};

module.exports = {
    logout,
    signUp,
    signIn
};