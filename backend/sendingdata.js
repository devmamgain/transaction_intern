const Transaction = require("./datamodels/transactionmodel")
const axios = require('axios');

const sendingdata = async()=>{
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
const transactions = response.data;
    const count = await Transaction.countDocuments()
    if(count===0){
        await Transaction.insertMany(transactions);
    }
}

module.exports = sendingdata