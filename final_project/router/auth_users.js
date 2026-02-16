const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//curl -X POST http://localhost:5000/customer/login -H "Content-Type: application/json" -d"{\"username\":\"john\",\"password\":\"123456\"}" -c cookies.txt
//only registered users can login
regd_users.post("/login", (req,res) => {
  //Completed!
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  }
  else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }

});

regd_users.get('/', function(req,res){
  res.send(JSON.stringify(users,null,4));
})


//curl -X PUT "http://localhost:5000/customer/auth/review/1?review=Great%20book!" -b cookies.txt
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Completed!
  // Check if user is logged in
  if (!req.session.authorization) {
    return res.status(401).json({ message: "User not logged in" });
  }

  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const review = req.query.review;

  // Validate review input
  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
  
});

//curl -X DELETE http://localhost:5000/customer/auth/review/1 -b cookies.txt
//Delete an existing review by the user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Completed!
  // Check if user is logged in
  if (!req.session.authorization) {
    return res.status(401).json({ message: "User not logged in" });
  }

  const username = req.session.authorization.username;
  const isbn = req.params.isbn;

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if user has a review for this book
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  // Delete the user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
    remainingReviews: books[isbn].reviews
  });

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
