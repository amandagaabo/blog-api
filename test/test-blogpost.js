const chai = require('chai')
const chaiHttp = require('chai-http')
const {app, runServer, closeServer} = require('../server')

// use should style syntax in chai tests
const should = chai.should()

// use chai to make HTTP requests in tests
chai.use(chaiHttp)

describe('Blog post', function () {

  // Before tests run, activate the server and return promise
  before(function () {
    return runServer()
  })

  // close server at the end of these tests, return promise
  after(function () {
    return closeServer()
  })

  //   1. make a GET request to `/blogposts`
  //   2. inspect response object and prove it has the right status code (200)
  //   and right keys in the response object (title, author, content, publishDate)
  it('should list blog posts on GET', function () {

    return chai.request(app)
      .get('/blogposts')
      .then(function (res) {
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('array')
        // because we create two items on app load
        res.body.length.should.be.at.least(1)
        // each item should be an object with keys title, author, content and publishDate
        res.body.forEach(function (item) {
          item.should.be.a('object')
          item.should.include.all.keys('title', 'author', 'content', 'publishDate')
        })
        // resolve promise
        return Promise.resolve()
      })
  })

  //  1. make a POST request with data for a new blog post
  //  2. inspect response object and prove it has the right
  //  status code and that the returned object has an `id`
  it('should add blog post on POST', function () {
    const newPost = {title: 'Title', author: 'Steve', content: 'blog post content, blah, blah, blah'}
    return chai.request(app)
      .post('/blogposts')
      .send(newPost)
      .then(function (res) {
        res.should.have.status(201)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.include.keys('id', 'title', 'author', 'content', 'publishDate')
        res.body.id.should.not.be.null
        res.body.title.should.equal(newPost.title)
        res.body.author.should.equal(newPost.author)
        res.body.content.should.equal(newPost.content)
        // resolve promise
        return Promise.resolve()
      })
  })

  //  1. initialize update data (add id later)
  //  2. make a GET request so we can get an id
  //  3. add the `id` to `updateData`
  //  4. Make a PUT request with `updateData`
  //  5. Inspect the response object to ensure it
  //  has the right status code and that we get back an updated
  //  item with the right data in it.
  it('should update a blog post on PUT', function () {

    const updateData = {
      author: 'better author',
      title: 'improved title',
      content: 'new updated content',
      publishDate: '11/11/2011'
    }

    return chai.request(app)
      // get recipes so we have access to an id
      .get('/blogposts')
      .then(function (res) {
        updateData.id = res.body[0].id
        // this will return a promise whose value will be the response
        // object, which we can inspect in the next `then` block.
        return chai.request(app)
          .put(`/blogposts/${updateData.id}`)
          .send(updateData)
      })
      // prove that the PUT request has right status code
      .then(function (res) {
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.include.keys('id', 'title', 'author', 'content', 'publishDate')
        res.body.id.should.not.be.null
        res.body.title.should.equal(updateData.title)
        res.body.author.should.equal(updateData.author)
        res.body.content.should.equal(updateData.content)
        res.body.publishDate.should.equal(updateData.publishDate)
        // resolve promise
        return Promise.resolve()
      })
  })

  //  1. GET all blog posts so we can get the ID of one to delete.
  //  2. DELETE an item using the ID and ensure we get back a status 204
  it('should delete a blog post on DELETE', function () {
    return chai.request(app)
      // get recipes so we have access to an id
      .get('/blogposts')
      .then(function (res) {
        return chai.request(app)
          .delete(`/blogposts/${res.body[0].id}`)
      })
      .then(function (res) {
        res.should.have.status(204)
        // resolve promise
        return Promise.resolve()
      })
  })
})
