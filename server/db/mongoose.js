
const mongoose = require('mongoose');

//console.log("in mongoose" ,process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI);
module.exports =  { mongoose }