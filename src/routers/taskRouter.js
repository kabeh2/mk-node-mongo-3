const Task = require("../db/models/task.model");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  try {
    await task.save();

    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "description"];
  const isValidUpdate = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid updates." });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(400).send({ error: "No user found." });
    }

    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    await req.user.populate("tasks").execPopulate();

    res.status(200).send(req.user.tasks);
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(400).send({ error: "There are no tasks." });
    }

    res.status(200).send(task);
  } catch (error) {
    res.status(500).send({ error });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(400).send({ error: "Task not found." });
    }

    res.status(200).send({ deletedTask: task });
  } catch (error) {
    res.status(500).send({ error });
  }
});

module.exports = router;
