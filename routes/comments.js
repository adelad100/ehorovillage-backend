// routes/comments.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Add a new comment
router.post('/add', auth, async (req, res) => {
  const { content, postId } = req.body;

  try {
    // Ensure post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create a new comment
    const comment = new Comment({
      content,
      author: req.user.id, // Get user ID from token
      post: postId,
    });

    // Save the comment to the database
    await comment.save();

    // Return a success response
    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    // Fetch comments for the given post ID and populate author information
    const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username');
    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a comment by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find the comment by ID
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the authenticated user is the author of the comment
    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this comment' });
    }

    // Delete the comment
    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
