const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_database_password',
    database: 'your_database_name',
});

// let getRandomUser = () => {
//   return [
//     faker.string.uuid(),
//     faker.internet.userName(),
//     faker.internet.email(),
//     faker.internet.password(),
//   ];
// }

// HOME Route
app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user;`
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB")
  }
});


// SHOW Route
app.get("/user", (req, res) => {
  let q = `SELECT * FROM user;`
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("showusers.ejs",{users});
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB")
  }
});



// EDIT Route
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}';`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs",{user});
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB")
  }
});



// UPDATE (DB) Route
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPassword, username: formUsername } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}';`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPassword != user.password) {
        res.send("WRONG PASSWORD");
      }
      else {
        let q2 = `UPDATE user SET username='${formUsername}' WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB")
  }
});



// ADD New User
app.get("/user/new", (req, res) => {
  res.render("new.ejs")
})
app.post("/user", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();

  // Query to check if username or email already exists
  let checkQuery = "SELECT * FROM user WHERE username = ? OR email = ?";
  connection.query(checkQuery, [username, email], (err, result) => {
      if (err) {
          console.error(err);
          return res.send("Some error in DB");
      }

      if (result.length > 0) {
          let existingUser = result[0];
          if (existingUser.username === username) {
              return res.send("Username already exists. Enter another.");
          } else if (existingUser.email === email) {
              return res.send("Email already exists. Try signing in or enter another.");
          }
      }

      // If no conflict, proceed to insert new user
      let insertQuery = "INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)";
      connection.query(insertQuery, [id, username, email, password], (err, result) => {
          if (err) {
              console.error(err);
              return res.send("Some error in DB");
          }

          console.log('Record inserted:', username);
          res.redirect("/user");
      });
  });
});


// DELETE the record
app.delete("/user/:id", (req, res) => {
  let userId = req.params.id;

  let checkQuery = `DELETE FROM user WHERE id = ?`;

  connection.query(checkQuery, [userId], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send("Some error in DB");
      }

      if (result.length === 0) {
          return res.status(404).send("User not found");
      }
      console.log(`User with id ${userId} has been deleted`);
      res.redirect("/user");
  });
});




app.listen("8080", () => {
  console.log("listening to post 8080");
});

