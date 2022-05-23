var express = require('express');
var router = express.Router();

var blogs = require("../public/sampleBlogs");
const blogPosts = blogs.blogPosts;

// GET Blogs listing
router.get('/', function (req, res, next) {
    res.render('blogs', {title: 'Blogs'});
});

router.get('/all', function (req, res, next) {
    let sort = req.query.sort;
    res.json(sortBlogs(sort));
});

router.get("/singleBlog/:blogId", (req, res, next) => {
    console.log(req.params);
    const blogId = req.params.blogId;
    res.json(findBlogId(blogId));
});

router.get('/postblog', function (req, res, next){
    res.render('postBlog');
})


router.post("/submit", (req, res, next) => {
    res.status(201);
    let newBlog = addBlogPost(req.body);
    blogPosts.push(newBlog);
    console.log(blogPosts)
});

// router.post("/submit", function (req, res, next) {
//     console.log(req.body)
//     console.log("bloglist before ", blogsImport.blogPosts)
//     const today = new Date()
//     const newPost = {
//         title: req.body.title,
//         text: req.body.text,
//         author: req.body.author,
//         createdAt: today.toISOString(),
//         id: String(blogsImport.blogPosts.length + 1)
//     }
//     blogsImport.blogPosts.push(newPost)
//     console.log("bloglist after ", blogsImport.blogPosts)

//     res.send("OK");
// })

router.get('/displayBlogs', function (req, res, next) {
    res.render('displayBlogs');
});

router.get('/displaySingleBlog', function (req, res, next) {
    res.render('displaySingleBlog')
});

// DELETE
// this api end-point delete an existing item object from
// array of data, match by `id` find item and then delete
router.delete('/deleteblog/:blogId', function (req, res, next) {
    const blogToDelete = req.params.blogId

    for (let i = 0; i < blogPosts.length; i++) {
        let blog = blogPosts[i];
        if (blog.id === blogToDelete) {
            blogPosts.splice(i,1);
        }
        
    }

    res.send('Successfully Deleted')
});







// Helper Functions

//Find Blog Id
let findBlogId = (id) => {
    for (let i = 0; i < blogPosts.length; i++) {
        let blog = blogPosts[i];
        if (blog.id === id) {
            return blog;
        }
    }
};

//Sort Blog Array 
let sortBlogs = (order) => {
    if (order === "asc") {
        return blogPosts.sort(function (a, b) {
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
    } else if (order === "desc") {
        return blogPosts.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    } else {
        return blogPosts;
    }
};

let addBlogPost = (body) => {
    let id = blogPosts.length + 1;
    newDate = new Date();
    let blog = {
      createdAt: newDate.toISOString(),
      title: body.title,
      text: body.text,
      author: body.author,
      id: id.toString()
    }
    return blog
  }

  module.exports = router;