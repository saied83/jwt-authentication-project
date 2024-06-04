const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

//dotenv config
dotenv.config();

// rest object
const app = express();

//middlewares
app.use(express.json());

const authenticateToken = (req, res, nxt) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403);
    req.user = user;
    nxt();
  });
};

// posts
const posts = [
  {
    username: "jim",
    title: "Post 1",
  },
  {
    username: "kyle",
    title: "Post 2",
  },
];

//routers
app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

//listen
app.listen(8000, () => {
  console.log("Server Running on Port: 8000");
});
