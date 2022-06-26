const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    authorId: {
        type: objectId,
        required: true,
        ref: "authorDB",
    },
    tags: {
        type: Array     // this is also = [String]
    },

    category: {
        type: String,
        required: true,
    },
    subcategory: [String],

    isDeleted: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: false
    },

    deletedAt: Date,
    publishedAt: Date
},
    { timestamps: true });


module.exports = mongoose.model('blogDb', blogSchema)
