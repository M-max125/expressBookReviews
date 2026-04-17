const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getAllBooks = () => {
    return new Promise((resolve) => {
        resolve(books);
    });
}

const getBookByISBN = (isbn) => {
    return new Promise((resolve) => {
        resolve(books[isbn]);
    });
}

const getBookByAuthor = (author) => {
    return new Promise((resolve) => {
        const book = Object.values(books).find(b => b.author === author);
        resolve(book);
    });
}

const getBookByTitle = (title) => {
    return new Promise((resolve) => {
        const book = Object.values(books).find(b => b.title === title);
        resolve(book);
    });
}


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  // Missing username
  if (!username) {
    return res.status(400).json({
        success: false,
        message: "Username is required"
    });
  }

  // Missing password
  if (!password) {
    return res.status(400).json({
        success: false,
        message: "Password  is required"
    });
  }
  // check if user already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({
        success: false,
        message: "Username already exists"
    });
  }
  // add new user
  users.push({username, password});
  return res.status(201).json({
    success: true,
    message: "User registered successfully", 
    users
  });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  const allBooks = await getAllBooks();
  return res.json(allBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = await getBookByISBN(isbn);
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  return res.json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const author = req.params.author;
  const book = await getBookByAuthor(author);
  if (!book) {
    return res.status(404).json({message: "No book with this author"});
  }
  return res.json(book);
  
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const title = req.params.title;
  const book = await getBookByTitle(title);
  if (!book) {
    return res.status(404).json({message: "No book with this title"});
  }
  return res.json(book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({message: " Book not found "});  
  } 
  return res.json(book.reviews);
});

module.exports.general = public_users;
