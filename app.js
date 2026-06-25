//jshint esversion:6
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]); 


const connection_string = "mongodb+srv://enyewyirga89_db_user:q5lMce4zTdu8LHqp@learnode.vmidjzh.mongodb.net/myDatabaseName?retryWrites=true&w=majority&appName=learnode";
const app = express();
const port = 3000;
let currentEmail;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose
  .connect(connection_string,
    {
      tls: true,
      tlsAllowInvalidCertificates: false,
    },
  )
  .then(() => {
    console.log("connected successfully!");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home")
})
app.get("/login", (req, res) => {
  res.render("login")
})
app.get("/register", (req, res) => {
  res.render("register")
})
app.get("/logout", (req, res) => {
  res.render("home");
})
app.get("/submit", (req, res) => {
  res.render("submit")
})
const userSchema = new mongoose.Schema({
  email: String,
  password: String
})




const User = new mongoose.model("User", userSchema);

app.post("/register", async(req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  const user = new User({
    email: email,
    password: password
  })
  await user.save();
  res.render("secrets")
})
app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  const user = await User.findOne({email: email});
  console.log(user[0]);
  if(user[0].password === password){
    currentEmail = email;
    res.render("secrets");
  }
})
app.post("/submit", (req, res) => {
  console.log(currentEmail)

})


app.listen(port, () => {
  console.log(`Server is runnig on port ${port}`);
});


