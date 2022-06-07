var express = require('express');
var router = express.Router();

var blogs = require("../public/sampleBlogs");
const blogPosts = blogs.blogPosts;

const { blogsDB } = require("../mongo");
const { Db } = require("mongodb");

// GET Blogs listing
router.get('/', async function (req, res, next) {
    try{
    const collection = await blogsDB().collection("blogs50")
    const blogs50 = await collection.find({}).toArray();
    res.json(blogs50);
    } catch (e) {
        res.status(500).send("Error fetching posts" + e)
    }
    // res.render('blogs', {title: 'Blogs'});
});
//  /blogs/all?sort=desc
router.get('/all', async function (req, res, next) {
 try{
     let sortField= req.query.sortField;   
     let sortOrder = req.query.sortOrder;
     if (sortOrder === "asc") {
        sortOrder = 1
     } 
     if (sortOrder === "desc") {
        sortOrder = -1
     }
     const collection = await blogsDB().collection("blogs50")
     const blogs50 = await collection.find({}).sort({
        [sortField]: sortOrder
     }).toArray();
     res.json(blogs50);
  } catch (e) {
    res.status(500).send("Error fetching posts" + e)
 }
});

//Display single blog by id
router.get("/singleBlog/:blogId", async function (req, res, next) {
   try {
    const blogId = Number(req.params.blogId);
    const collection = await blogsDB().collection("blogs50")
    // const blogs50 = await collection.findOne({id: Number(blogId)});
    // const blogs = await collection.find({}).toArray();
    const foundBlog = await collection.findOne({id: blogId});
    if (!foundBlog) {
        const noBlog = {
            title: "",
            text: "This Blog does not exist",
            author: '',
            id: ""
        }
        res.json(noBlog)
    } else {
        res.json(foundBlog);
    }
   

   } catch (e) {
    res.status(500).send("Error fetching posts" + e)
   }
    
});

router.get('/postblog', function (req, res, next){
    res.render('postBlog');
})

//Submit Post
router.post("/submit", async function (req, res, next) {
    try {
      const collection = await blogsDB().collection("blogs50");
      const sortedBlogArray = await collection.find({}).sort({id:1}).toArray();
      const lastBlog = sortedBlogArray[sortedBlogArray.length - 1]

      let newPost = req.body
  
      newPost = {
          
        // title: req.body.title,
        // author: req.body.author,
        // text: req.body.text,
        // category: req.body.category,
        //use spread operator instead
        ... newPost,
        createdAt: new Date(),
        lastModified: new Date(),
        id: Number(lastBlog.id + 1),
      };
  
      // res.status(201);
      // let newBlog = addBlogPost(req.body);
      // blogPosts.push(newBlog);
      // console.log(blogPosts);
  
      await collection.insertOne(newPost);
      res.status(200).send("Post has been submitted");
    } catch (error) {
      res.status(500).send("Error posting to blog." + error);
    }
  });

router.put("/updateBlog/:blogId", async function (req, res) {
    try {
      const collection = await blogsDB().collection("blogs50");
      const blogId = Number(req.params.blogId);
    //   const blogs = await collection.find({}).toArray();
      const originalBlog = await collection.findOne({id: blogId});
      if (!originalBlog) {
          res.send('Blog Id: ' + blogId + "does not exist.")
      } else {
        let updateBlog = req.body;
        const blogTitle = updateBlog.title ? updateBlog.title : originalBlog.title;
        const blogText = updateBlog.text ? updateBlog.text : originalBlog.text;
        const blogAuthor = updateBlog.author ? updateBlog.author : originalBlog.author;
        const blogCategory = updateBlog.category ? updateBlog.category : originalBlog.category;
    
        updateBlog = {
          lastModified: new Date(),
          title: blogTitle,
          text: blogText,
          author: blogAuthor,
          category: blogCategory,
        };
        await collection.updateOne({ id: blogId }, { $set: updateBlog });
        res.status(200).send('Successfully Updated Blog Id: ' + blogId)
      }

    } catch (error) {
      res.status(500).send("Error updating blog." + error);
    }
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
// router.delete('/deleteBlog/:blogId', function (req, res, next) {
//     const blogToDelete = req.params.blogId

//     for (let i = 0; i < blogPosts.length; i++) {
//         let blog = blogPosts[i];
//         if (blog.id === blogToDelete) {
//             blogPosts.splice(i,1);
//         }
        
//     }

//     res.send('Successfully Deleted')
// });

router.delete('/deleteBlog/:blogId', async function(req, res){
    try {
        const blogId = Number(req.params.blogId);
        const collection = await blogsDB().collection("blogs50");
        const blogToDelete = await collection.deleteOne({id: blogId});
        console.log(blogToDelete.deletedCount);
        // await collection.deleteOne({id: blogId});
        // res.status(200).send('Successfully Deleted')
        if (blogToDelete.deletedCount === 1) {
            res.status(200).send("Successfully Deleted.");
          } else {
            res.send("This blog does not exist.").status(204);
          }
    } catch (error) {
        res.status(500).send("Error deleting post." + error);
    }
})








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