import { Router } from "express";
import db from "../utils/db.js";
import { ObjectId } from "mongodb";

const questionsRouter = Router();

questionsRouter.get("/", async (req, res) => {
  try {
    const topic = req.query.topic;
    const category = req.query.category;

    let query = {};
    if (topic) {
      query.topic = new RegExp(topic, "i");
    }
    if (category) {
      query.category = category;
    }
    const collection = db.collection("questions");

    const results = await collection.find(query).limit(10).toArray();
    res.json({ data: results });
  } catch {
    return res.status(400).send("Something went wrong");
  }
});

questionsRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const id = new ObjectId(req.params.id);

    const results = await collection.find({ _id: id }).limit(10).toArray();
    res.json({ data: results });
  } catch {
    return res.status(400).send("Something went wrong");
  }
});

questionsRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questionBody = { ...req.body };
    const createAt = new Date();

    await collection.insertOne({ ...questionBody, createAt });
    res.json({ Message: "Created question done" });
  } catch {
    return res.status(400).send("Create went wrong");
  }
});

questionsRouter.put("/:id", async (req, res) => {
  try {
    const updateAt = new Date();
    const questionBody = { ...req.body };

    let queryEdit = {};
    if (questionBody.topic) {
      queryEdit = { topic: questionBody.topic };
    }
    if (questionBody.description) {
      queryEdit = { description: questionBody.description };
    }

    const collection = db.collection("questions");
    const id = new ObjectId(req.params.id);

    await collection.updateOne(
      { _id: id },
      { $set: { ...queryEdit, updateAt } }
    );
    res.json({ Message: "Update question done" });
  } catch {
    return res.status(400).send("Update went wrong");
  }
});

questionsRouter.delete("/:id", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const id = new ObjectId(req.params.id);

    await collection.deleteOne({ _id: id });
    res.json({ Message: "Deleted Question done" });
  } catch {
    return res.status(400).send("Invalid data requirement");
  }
});
export default questionsRouter;
