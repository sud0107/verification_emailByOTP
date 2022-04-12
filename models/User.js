const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    name: String,
    email: String,
    Password: String,
    dataOfBirth: Date
})

const User = mongoose.model("User", UserSchema);

module.exports = User;