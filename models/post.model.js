const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        commenterId: {type: String, required: true},
        content: {type: String, required: true},
        likes: {type: [String], default: []}
    },
    {
        timestamps: true,
    });

const postSchema = new mongoose.Schema(
    {
        posterId: {type: String, required: true},
        content: {type: String},
        img: {type: String},
        comments: {type: [commentSchema], default: []},
        likes: {type: [String], default: []}
    },
    {
        timestamps: true,
    });

postSchema.pre('validate', function (next) {
    if (!this.content && !this.img) {
        const err = new Error('At least one of "content" or "img" is required');
        err.name = 'ValidationError';
        next(err);
    } else {
        console.log(this)
        next();
    }
});


const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;