import express from "express";
import fs from "fs";
import multer from "multer";
import cors from "cors";
import mongoose from "mongoose";
import {
  registrValidation,
  loginValidation,
  postCreateValidation,
  CommentsValidation,
} from "./validations.js";

import { handleValidationErrors, CheckAuth} from "./utils/index.js";
import {
  UserController,
  PostController,
  CommentController,
} from "./Controllers/index.js";
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));
const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);

app.post(
  "/auth/register",
  registrValidation,
  handleValidationErrors,
  UserController.register
);

app.get("/auth/me", CheckAuth, UserController.getMe);

app.post("/upload", CheckAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.post("/userimg", upload.single("userIMG"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
} )



app.get("/tags", PostController.getLastTags);


app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getLastTags);

app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  CheckAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.post(
  "/posts/:id", 
  PostController.commentsCount
)
app.delete("/posts/:id", CheckAuth, PostController.remove);
app.patch(
  "/posts/:id",
  CheckAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);
app.get('/tags/:id', PostController.getSortTags)
app.get('/getsortposts', PostController.getSortPosts)

app.post(
  "/comments",
  CheckAuth,
  CommentsValidation,
  CommentController.createComments
);
app.get(
    "/comments/:id",
    CommentController.getComments
);
app.get(
  "/comments",
  CommentController.getAllComments
)
app.delete('/comments/:id', CommentController.remove)
app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
