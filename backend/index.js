import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express()
const PORT = 3000
const saltRounds = 10;

app.use(express.json())
app.use(cors({ origin: 'http://localhost:3001' }));

const db = new pg.Client({
  host: "localhost",
  user: "postgres",
  database: "ProgressStreak",
  password: "server1",
  port: 5432
});

db.connect();

app.get("/", (req, res) => {
  res.send("In progress");
});

app.post("/signup", async (req, res) => {

  if (req.body.username === '' || req.body.password === '')
    res.status(500).send({ msg: "Fill in username and password" });

  db.query("SELECT * from users where username = $1", [req.body.username], (err1, result1) => {
    if (err1) {
      console.log("Error while searching for exact username : ", err1.stack);
      res.status(500).send({ msg: "Error while searching for exact username" });
    } else {
      if (result1.rows.length == 0) {
        bcrypt.hash(req.body.password, saltRounds, (error, hash) => {
          if (error) {
            console.log("Error in hashing the password : ", error.stack);
            res.status(500).send({ msg: "Error in hashing the password" });
          } else {
            db.query("INSERT INTO users values ($1, $2)", [req.body.username, hash], (err2, result2) => {
              if (err2) {
                console.log("Error signing up new users : ", err2.stack);
                res.status(500).send({ msg: err2.stack });
              } else {
                res.status(200).send({ msg: "Successfully created new users" });
              }
            });
          }
        })
      }
      else {
        res.status(500).send({ msg: "username already exist" });
      }
    }
  })
});

app.post("/login", async (req, res) => {

  if (req.body.username === '' || req.body.password === '')
    res.status(500).send({ msg: "Fill in username and password" });

  db.query("SELECT * from users where username = $1", [req.body.username], (err1, result1) => {
    if (err1) {
      console.log("Error while searching for exact username : ", err1.stack);
      res.status(500).send({ msg: "Error while searching for exact username" });
    } else {
      if (result1.rows.length == 0) {
        res.status(500).send({ msg: "Wrong username" });
      }
      else {
        const storedPassword = result1.rows[0].password;
        bcrypt.compare(req.body.password, storedPassword, (err, result) => {
          if (err) {
            console.log("Error comparing password with hash : ", err.stack);
            res.status(500).send({ msg: "Error comparing password with hash" })
          }
          if (result) {
            res.status(200).send({ msg: "successfully login" });
          } else {
            res.status(401).send({ msg: "Wrong username or password" });
          }
        });
      }
    }
  })
});



app.listen(PORT, () => {
  console.log(`Server up and running on PORT ${PORT}`)
})