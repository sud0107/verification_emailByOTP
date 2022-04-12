const mongoose = require("mongoose");

mongoose.connect(process.env.CONNECTDB, {
    useUnifiedTopology: true
}).then(() => {
    console.log("Database is connected !!");
}).catch((err) => {
    console.log(`Ohh No Error ${err}`);
})