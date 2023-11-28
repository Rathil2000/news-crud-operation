const News = require('../models/newsModel');

// Get all news
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get news by ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (news) {
      res.json(news);
    } else {
      res.status(404).json({ message: 'News not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
};

// Create news
exports.createNews = async (req, res) => {
  const news = new News({
    title: req.body.title,
    content: req.body.content,
  });

  try {
    const newNews = await news.save();
    res.status(201).json(newNews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update news
exports.updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (news) {
      news.title = req.body.title || news.title;
      news.content = req.body.content || news.content;

      const updatedNews = await news.save();
      res.json(updatedNews);
    } else {
      res.status(404).json({ message: 'News not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    return;
  }
};

// Delete news
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (news) {

      res.json({ message: 'News deleted successfully' });
    } else {
      res.status(404).json({ message: 'News not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};