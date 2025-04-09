const express = require("express");
const router = express.Router();
const comments = require("../data/comments"); // Import the in-memory comments array
const fs = require("fs");

//Part 2: Adding Additional Routes
//3- GET /comments
// Note that we do not have any comments data yet; that is okay! Make sure that you create a place to store comments,
// but you do not need to populate that data.

//Retrive all comments filter by userId or postId
router.get("/", (req, res) => {
    if (req.query.userId) {
      return res.json(comments.filter((comment) => comment.userId == req.query.userId));
    }
    if (req.query.postId) {
      return res.json(comments.filter((comment) => comment.postId == req.query.postId));
    }
    res.json(comments); // Return all comments
  });

//4- POST /comments
// When creating a new comment object, it should have the following fields:
// id: a unique identifier.
// userId: the id of the user that created the comment.
// postId: the id of the post the comment was made on.
// body: the text of the comment.
router.post("/", (req, res) => {
    const { userId, postId, body } = req.body;
    if (userId && postId && body) {
      const newComment = {
        id: comments.length + 1,
        userId,
        postId,
        body,
      };
      comments.push(newComment);

      //to write the updated array back to the file i used the File System module (fs) 

      fs.writeFileSync(  "./data/comments.js",  `const comments = ${JSON.stringify(comments, null, 2)};\nmodule.exports = comments;`,
        "utf-8"  );
  
        res.json(newComment);
    } else {
      res.status(400).json({ error: "Insufficient Data" });
    }
});

//5- GET /comments/:id
// Retrieves the comment with the specified id.

router.get("/:id", (req, res) => {
    const comment = comments.find((c) => c.id == req.params.id);
    if (comment) res.json(comment);
    else res.status(404).json({ error: "Comment Not Found" });
});

//6-  PATCH /comments/:id
// Used to update a comment with the specified id with a new body.
router.patch("/:id", (req, res) => {
    const comment = comments.find((c) => c.id == req.params.id);
    if (comment) {
      comment.body = req.body.body || comment.body;

      fs.writeFileSync(
        "./data/comments.js",
        `const comments = ${JSON.stringify(comments, null, 2)};\nmodule.exports = comments;`,
        "utf-8"
      );


      res.json(comment);
    } else {
      res.status(404).json({ error: "Comment Not Found" });
    }
  });

//7- DELETE /comments/:id
// Used to delete a comment with the specified id.
router.delete("/:id", (req, res) => {
    const index = comments.findIndex((c) => c.id == req.params.id);
    if (index !== -1) {
      const removedComment = comments.splice(index, 1);

      fs.writeFileSync(
        "./data/comments.js",
        `const comments = ${JSON.stringify(comments, null, 2)};\nmodule.exports = comments;`,
        "utf-8"
      );

      res.json(removedComment);
    } else {
      res.status(404).json({ error: "Comment Not Found" });
    }
  });


module.exports = router; 
