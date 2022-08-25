import mongoose from "mongoose";
import CommentsModal from "../models/Comments.js";
import PostModel from '../models/Post.js'
export const createComments = async (req, res) => {
  try {
    const doc = new CommentsModal({
      user: req.userId,
      text: req.body.text,
      post: req.body.post, 
    });
    const comments = await doc.save();
    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось отправить коментарий",
    });
  }
};
export const getComments = async (req, res) => {
  try {
    const getIdComments = await CommentsModal.find({post: req.params.id}).populate('user').exec();
    res.json(getIdComments)
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить коментарий",
    });
  }
};


export const getAllComments = async(req, res) => {
  try {
    const getAll = await CommentsModal.find().populate('user').limit(5)
    res.json(getAll)
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить коментарий",
    });
  }
}
export const remove = async(req, res) => {
  try {
    const deleteAll = await CommentsModal.find({post: req.params.id}).deleteMany()
    res.json({
      success: true, 
    })
  } catch(err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить коментарий",
    });
  }
}
