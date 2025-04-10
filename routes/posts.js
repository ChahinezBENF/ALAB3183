const express = require("express");
const router = express.Router();

const posts = require("../data/posts");
const comments = require("../data/comments"); 

// This is the same code as the previous example!
// We've simply changed "app" to "router" and
// included an export at the end of the file.
// We also change the route paths to be relative to
// the base paths defined in index.js.

router
  .route("/")
  .get((req, res) => {

    const links = [
      {
        href: "posts/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json(posts);
  })
  .post((req, res) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else res.json({ error: "Insufficient Data" });
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);
   
    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];
   
    if (post) res.json(post);
    else next();
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });

//Part 2: Adding Additional Routes  

//2- GET /api/posts?userId=<VALUE>
// Retrieves all posts by a user with the specified postId.
// It is common for APIs to have multiple endpoints that accomplish the same task.
//  This route uses a "userId" query parameter to filter posts, while the one above uses a route parameter.

router.get("/", (req, res) => {
  if (req.query.userId) {
    const filteredPosts = posts.filter((post) => post.userId == req.query.userId);
    res.json(filteredPosts);
  } else {
    res.json(posts); // Return all posts if no query provided
  }
});

//10- GET /posts/:id/comments
// Retrieves all comments made on the post with the specified id.

router.get("/:id/comments", (req, res) => {
  const postComments = comments.filter((comment) => comment.postId == req.params.id);
  res.json(postComments);
});

//12- GET /posts/:id/comments?userId=<VALUE>
// Retrieves all comments made on the post with the specified id by a user with the specified userId.

router.get("/:id/comments", (req, res) => {
  const postComments = comments.filter((comment) => comment.postId == req.params.id);
  if (req.query.userId) {
    return res.json(postComments.filter((comment) => comment.userId == req.query.userId));
  }
  res.json(postComments);
});


module.exports = router;
