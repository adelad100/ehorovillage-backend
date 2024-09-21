// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { verifyToken } = require('../middleware/auth');

// Get all posts
router.get('/', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Fetch all posts and sort by creation date
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Create a new post
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({
      title,
      content,
      userId: req.user.id, // Assuming you store the user's ID in the post
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get a single post by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update a post by ID
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    // Check if the logged-in user is the owner of the post
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    post.title = title || post.title;
    post.content = content || post.content;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a post by ID
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    // Check if the logged-in user is the owner of the post
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await post.deleteOne(); // Delete the post
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
