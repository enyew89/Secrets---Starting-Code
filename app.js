//jshint esversion:6
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import path from "path";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });
const connection_string = process.env.MONGOOSE_CONNECTION_STRING;
const app = express();
const port = 3000;
let currentEmail;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.set({ strictQuery: true });

mongoose
  .connect(connection_string, {
    tls: true,
    tlsAllowInvalidCertificates: false,
  })
  .then(() => {
    console.log("connected successfully!");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/logout", (req, res) => {
  res.render("home");
});
app.get("/submit", (req, res) => {
  res.render("submit");
});
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const key = process.env.SECRET;
console.log(key);

const User = new mongoose.model("User", userSchema);

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      console.log(err.message);
    } else {
      const user = new User({
        email: email,
        password: hash,
      });
      user.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          res.render("secrets");
        }
      });
    }
  });
});
app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  const user = await User.findOne({ email: email });
  if(!user) {
    return res.send("User not find!");
  }
  console.log(user);
  bcrypt.compare(password, user.password, function(err, result) {
    if(result === true){
      currentEmail = user.email
      res.render("secrets")
    }
    else{
      console.log(err)
    }
  })
});
app.post("/submit", (req, res) => {
  console.log(currentEmail);
});

app.listen(port, () => {
  console.log(`Server is runnig on port ${port}`);
});
