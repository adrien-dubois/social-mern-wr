module.exports.signUpErrors = (err) => {
    let errors = { pseudo: "", email: "", password: ""};

    if(err.message.includes('pseudo'))
        errors.pseudo = "Email et/ou mot de passe incorrect(s)."

    if(err.message.includes('email'))
        errors.email = "Email et/ou mot de passe incorrect(s)."

    if(err.message.includes('password'))
        errors.password = "Le mot de passe doit contenir 6 caractères minimum."

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes('email'))
        errors.email = "Cette adresse mail est déjà enregistrée sur un autre compte."

    return errors
}