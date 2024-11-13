const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const {
  addNews,
  deleteNews,
  editNews,
  getNews
} = require("../repositories/Repository.news.js");

router.post('/getNews', async (req, res) => {
    const { Title, username } = req.body; // Extract Title and username from the request body

    // Check if Title and username are provided
    if (!Title || !username) {
        return res.status(400).json({ error: 'Title and username are required' });
    }

    try {
        const news = await getNews(Title, username); // Fetch the news using the getNews function

        // Check if any news was returned
        if (news.length === 0) {
            return res.status(404).json({ message: 'No news found for this title and writer' });
        }

        // Return the news as a response
        return res.json(news);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
    }
});

router.post(
  "/addNews",
  [
    body("title").notEmpty().withMessage("Title is required."),
    body("content").notEmpty().withMessage("Content is required."),
    body("sources").notEmpty().withMessage("Sources are required."),
    body("writer").notEmpty().withMessage("Writer is required."),
    body("images").isArray().withMessage("Images must be an array."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, sources, writer, images } = req.body;

    try {
      const newsletterId = await addNews(title, content, sources, writer, images);
      res.status(201).json({ newsletterId });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.delete(
  "/deleteNews/:id",
  async (req, res) => {
    const { id } = req.params;

    try {
      const success = await deleteNews(id);
      if (success) {
        res.status(200).send("News deleted successfully.");
      } else {
        res.status(404).send("News not found.");
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.put(
  "/editNews/:id",
  [
    body("title").notEmpty().withMessage("Title is required."),
    body("content").notEmpty().withMessage("Content is required."),
    body("sources").notEmpty().withMessage("Sources are required."),
    body("writer").notEmpty().withMessage("Writer is required."),
    body("images").isArray().withMessage("Images must be an array."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, content, sources, writer, images } = req.body;

    try {
      const success = await editNews(id, title, content, sources, writer, images);
      if (success) {
        res.status(200).send("News updated successfully.");
      } else {
        res.status(404).send("News not found.");
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;