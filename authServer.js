const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

//dotenv config
dotenv.config();

// rest object
const app = express();

//middlewares
app.use(express.json());

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
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

const refreshTokens = [];
//routers
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json(accessToken);
  });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((t) => t !== req.body.token);
  res.sendStatus(204);
});

app.post("/login", (req, res) => {
  //Authenticate user

  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

//listen
app.listen(4000, () => {
  console.log("Server Running on Port: 4000");
});
