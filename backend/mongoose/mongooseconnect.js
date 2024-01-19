const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb+srv://devmamgain123:Boltzman123@testinglearning.ltdjpi8.mongodb.net/?retryWrites=true&w=majority", {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    }catch(err){
        console.log(err)
    }
}

module.exports = connectDB;