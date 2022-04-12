const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.post("/signup", (req, res) => {
    let { name, email, password, dateOfBirth } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    // dateOfBirth = dateOfBirth.trim();

    if(name == "" || email == "" || password == "" || dateOfBirth == "") {
        res.status(404).json({message: "All fields are empty"});
    } else if (password.length < 4) {
        res.status(404).json({ message: "Password is to small !!" })
    } else {
        User.find({email}).then(result => {
            if(result.length) {
                res.status(404).json({ message: "User already exist !!" })
            } else {
               
                    const newUser = new User({
                        name,
                        email,
                        password,
                        dateOfBirth
                    });

                    newUser.save().then(result => {
                        res.status(202).json({ message: "Signup Successful", data: result })
                    }).catch(err => {
                        res.status(404).json({ message: "An error occured while saving user account !!" })
                    })

               
            }

        }).catch(err => {
            console.log(err);
            res.status(404).json({ message: "An error occured while checking for existing user !!" })
        })
    }
})

router.post("/login", (req, res) => {
    let { email, password } = req.body;
    // email = email.trim();
    // password = password.trim();

    if(email == "" || password == "") {
        res.status(404).json({
            message: "Email and Pass fild is empty !!"
        })
    } else {
        User.find({email})
        .then(data => {
            if(data.length) {
                const previousPassword = data[0].password;
                bcrypt.compare(password, previousPassword).then(result => {
                    if(result) {
                        res.status(202).json({ message: "Signin Successful !!" })
                    } else {
                        res.status(404).json({ message: "Invalid Password !!" })
                    }
                }).catch(err => {
                    console.log(err);
                    res.status(404).json({ message: "An error occur while comparing the passwords !!" })
                })
            } else {
                res.status(404).json({ message: "Something Went wrong while login/signin !!" })
            }
        }).catch(err => {
            res.status(404).json({ message: "Error occured while checking for existing user" })
        })
    }
})

module.exports = router;