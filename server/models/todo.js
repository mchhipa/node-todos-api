const mongoose = require('mongoose');


const Todo = mongoose.model('Todo',{
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports =  {Todo}