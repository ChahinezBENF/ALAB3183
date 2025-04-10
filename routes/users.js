const express = require("express");
const router = express.Router();
const comments = require("../data/comments"); 

const users = require("../data/users");

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
          href: "users/:id",
          rel: ":id",
          type: "GET",
        },
      ];
    res.json(users);
  })
  .post((req, res) => {
    if (req.body.name && req.body.username && req.body.email) {
      if (users.find((u) => u.username == req.body.username)) {
        res.json({ error: "Username Already Taken" });
        return;
      }

      const user = {
        id: users[users.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };

      users.push(user);
      res.json(users[users.length - 1]);
    } else res.json({ error: "Insufficient Data" });
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);
    
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
    
    if (user) res.json(user);
    else next();
  })
  .patch((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          users[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  })
  .delete((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        users.splice(i, 1);
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  });


//Part 2: Adding Additional Routes

// 1- GET /api/users/:id/posts
// Retrieves all posts by a user with the specified id.

const posts = require("../data/posts"); // Import posts data

router.get("/:id/posts", (req, res) => {
  const userPosts = posts.filter((post) => post.userId == req.params.id);
  res.json(userPosts);
});

//11- GET /users/:id/comments
// Retrieves comments made by the user with the specified id.

router.get("/:id/comments", (req, res) => {
  const userComments = comments.filter((comment) => comment.userId == req.params.id);
  res.json(userComments);
});

//13- GET /users/:id/comments?postId=<VALUE>
// Retrieves comments made by the user
// with the specified id on the post with the specified postId.
router.get("/:id/comments", (req, res) => {
  const userComments = comments.filter((comment) => comment.userId == req.params.id);
  if (req.query.postId) {
    return res.json(userComments.filter((comment) => comment.postId == req.query.postId));
  }
  res.json(userComments);
});
module.exports = router;


