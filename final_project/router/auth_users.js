const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const JWT_SECRET = "user_secret_key";

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const regex = /^[a-zA-Z0-9]{3,}$/;
return regex.test(username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.find(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password required"});
  }
  const user = authenticatedUser(username, password);
  if (!user) {
    return res.status(401).json({message: "Invalid credentials"});
  }

  // create JWT token
  const token  = jwt.sign({username: user.username}, JWT_SECRET, {expiresIn: "1h"});
  req.session.authorization = {
    accessToken: token,
  }
  return res.json({
    message: "Login successfull",
    token
  })
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;
  // validate review
  if (!review) {
    return res.status(400).json({message: "Review is required in query"});
  }
  // check if book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  // add or update review
  book.reviews[username] = review;
  return res.json({
    message: "Review added/updated successfully",
    isbn,
    reviews: book.reviews
  })
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const username = req.user.username;
  
    // check if book exists
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({message: "Book not found"});
    }

    // check if a user has a review
    if (!book.reviews[username]) {
        return res.status(403).json({message: "You have no review to delete for this book"});  
    }
    delete book.reviews[username];
    return res.json({
      message: "Review deleted successfully",
      isbn,
      reviews: book.reviews
    })
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
