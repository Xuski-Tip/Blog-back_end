import mongoose from "mongoose";


const CommentsModal = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    viewsCount: {
        type:Number,
        default: 0,
    },
    post: {
        type: String
    }
})


export default mongoose.model('Comments', CommentsModal)