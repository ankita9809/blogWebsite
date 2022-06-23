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
    tags: [String],

    category: {
        type: String,
        required : true,
    },    
    subcategory : { 
        tpye : [String],
    },
    isDeleted : { 
        type : Boolean,
        default : false
    },
    ispublished : {
        type : Boolean,
        default : false
    }, 
    
    deletedAt : Date,
    publishedAt: Date 
},    
{timestamps : true});


module.exports = mongoose.model ('blogDb', blogSchema)
