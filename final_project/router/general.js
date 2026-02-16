//general.js Async-wait


const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


const BASE_URL = "http://localhost:5000";



public_users.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.some(user => user.username === username)) {
      return res.status(409).json({ message: "User already exists!" });
    }

    users.push({ username, password });

    return res.status(201).json({ message: "User successfully registered!" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

public_users.get('/', async (req, res) => {
  try {

    const response = await axios.get(`${BASE_URL}/books-data`);

    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  try {

    const response = await axios.get(`${BASE_URL}/books-data`);
    const allBooks = response.data;

    const isbn = req.params.isbn;

    if (!allBooks[isbn]) {
      return res.status(404).json({ message: "Invalid ISBN!" });
    }

    return res.json(allBooks[isbn]);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

public_users.get('/author/:author', async (req, res) => {
  try {

    const response = await axios.get(`${BASE_URL}/books-data`);
    const booksArray = Object.values(response.data);

    const author = req.params.author;

    const filtered = booksArray.filter(book =>
      book.author.toLowerCase() === author.toLowerCase()
    );

    if (filtered.length === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    return res.json(filtered);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

public_users.get('/title/:title', async (req, res) => {
  try {

    const response = await axios.get(`${BASE_URL}/books-data`);
    const booksArray = Object.values(response.data);

    const title = req.params.title;

    const filtered = booksArray.filter(book =>
      book.title.toLowerCase() === title.toLowerCase()
    );

    if (filtered.length === 0) {
      return res.status(404).json({ message: "No books found for this title" });
    }

    return res.json(filtered);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

public_users.get('/review/:isbn', async (req, res) => {
  try {

    const response = await axios.get(`${BASE_URL}/books-data`);
    const allBooks = response.data;

    const isbn = req.params.isbn;

    if (!allBooks[isbn]) {
      return res.status(404).json({ message: "Invalid ISBN!" });
    }

    return res.json(allBooks[isbn].reviews);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


module.exports.general = public_users;
