const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema ({
    title: {
        type: String,
        required : true,
    },
    body: {
        type: String,
        required : true,
    },
    authorId: {
        type: objectId,
        required : true,
        ref : "authorDB",
    },
    tag: [String],

    category: {
        type: String,
        required : true,
        examples: ["technology", "entertainment", "life style" , "food", "fashion"],
    },    
    subcategory : {
        tpye : [String],
        examples : [
            "technology"-["web development" , "mobile development", "AI", "ML"] 
        ]},
    isDeleted : {
        type : Boolean,
        default : false
    },
    ispublished : {
        type : Boolean,
        default : false
    }, 
    createdAt : Date,
    updatedAt : Date,
    deletedAt : Date,
},    
{timestamps : true});

    


module.exports = mongoose.model ('blogDb', blogSchema)
