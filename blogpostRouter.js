const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const {BlogPosts} = require('./models')

// add blog posts to test
BlogPosts.create('Hiking Adventure', 'Nice text about going on a hike.', 'Amanda', '9/9/2017')
BlogPosts.create('IEs rock', 'Being an IE is so much fun. I get to walk around the plant and fix things.', 'Ashley', '10/01/2017')

// GET request (read)
// no required fields
// returns json object of all blog posts
router.get('/', (req, res) => {
  res.json(BlogPosts.read())
})

// POST request (create)
// check required fields, if missing log error and return 400 status code and message
// if no errors add new post, and return it with a status 201 (created)
router.post('/', jsonParser, (req, res) => {
  // check that `title`, `author` and `content` are in request body, `date` is optional
  const requiredFields = ['title', 'author', 'content']

  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`
      return res.status(400).send(message)
    }
  })

  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author)
  res.status(201).json(item)
})

// DELETE request (delete)
// delte a request using its id
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id)
  res.status(204).end()
})

// PUT request (update)
// check required fields, respond with 400 status code and message if error
// if no errors, update the blog post
router.put('/:id', jsonParser, (req, res) => {
  // check that `title`, `author`, `content` and `publishDate` are in request body
  const requiredFields = ['title', 'author', 'content', 'publishDate']
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`
      return res.status(400).send(message)
    }
  })
  // check that id in the request matches the id in the paramaters
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id ${req.params.id} and request body id ${req.body.id} must match`)
    return res.status(400).send(message)
  }
  // update post
  const updatedPost = BlogPosts.update({
    id: req.params.id,
    author: req.body.author,
    title: req.body.title,
    content: req.body.content,
    publishDate: req.body.publishDate
  })
  res.status(200).json(updatedPost)
})

module.exports = router
