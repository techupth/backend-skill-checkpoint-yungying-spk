import { Router } from "express";
import db from "../utils/db.js";
import { ObjectId } from "mongodb";

const answerRouter = Router();

answerRouter.get("/:id/answer", async (req, res) => {
    try{
  const collection = db.collection("answers");
  const questionId = req.params.id;
  const result = await collection.find({ questionId: questionId }).toArray();
  return res.json({ message: result });}
  catch(error){return res.status(400).json({message:"invalid data"})}
});

answerRouter.post("/:id/answer", async (req, res) => {
  try {
    const collection = db.collection("answers");
    const questionId = req.params.id;
    const comment = { ...req.body };
    console.log(comment.answer.length);
    if (comment.answer.length > 300) {
      return res.status(400).send("Answer is too long");
    }

    await collection.insertOne({ ...comment, questionId });
    return res.json({ message: comment });
  } catch {
    return res.status(400).send("Post went wrong");
  }
});

export default answerRouter;
