// server.js
var customers = require("./customers.json");
var orders = require("./orders.json")
const commentJS = require('./comments.js');
const commonData = require("./common.js");

const fs = require("fs");
// const path = require('path');
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });


app.set("view engine", "ejs");

// Middleware to parse urlencoded form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static("public"));

// Middleware to make common data accessible in all views
app.use((req, res, next) => {
  res.locals.commonData = commonData;
  next();
});

// Define routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/index", (req, res) => {
  res.render("index");
});

app.get("/getpcs", (req, res) => {
  res.render("getpcs");
});
app.get("/all", (req, res) => {
  res.render("all");
});

app.get("/student", (req, res) => {
  res.render("student");
});
app.get("/trainer", (req, res) => {
  res.render("trainer");
});
app.get("/admin", (req, res) => {
  res.render("admin");
});
app.get("/clear", (req, res) => {  
  doTrainerCommand({name:"trainer",body:"clear"});
  // res.end();
  res.render("index");
});
app.get("/comments", (req, res) => {
  res.render("comments");
  
});

app.get("/commentsRead", (req, res) => {
  res.send(fs.readFileSync('comments.txt', 'utf8'));
});

app.get("/commentsDelete", (req, res) => {
  commentJS.deleteComments(fs);
  res.send("File deleted");
});

// Handle form submission for comments
app.post("/commentsSave", (req, res) => {
  commentJS.saveComments(req, fs);  
  res.send("Thank you 👍 Your comments are save.");
});



app.get("/customers", function (req, res) {
  res.send(customers);
});

app.get("/customers/:id", function (req, res) {
  let id = req.params.id;
  var data = customers.filter(
    (c) => c.CustomerID.toLowerCase() == id.toLowerCase()
  );
  res.send(data);
});

app.get("/orders", function (req, res) {
  res.send(orders);
});

app.get("/orders/:id", function (req, res) {
  let id = req.params.id;
  var data = orders.filter(
    (c) => c.CustomerID.toLowerCase() == id.toLowerCase()
  );
  res.send(data);
});

server.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is running!`);
  }
);

//------------------------------------------------------------

var messages = [];

function doTrainerCommand(data) {
  if (data.body == "delete") {
    messages = [];
    return;
  }
  if (data.body == "clear") {
    messages.forEach((m) => (m.body = ""));
    return;
  }
  if (data.body.startsWith("deletename")) {
    const studentName = data.body.substring(11).toLowerCase();

    let index = messages.findIndex((m) => m.name.toLowerCase() == studentName);

    if (index != -1) messages.splice(index, 1);
  }
}

function saveMessage(data) {
  const found = messages.find((m) => m.name.toLowerCase() == data.name.toLowerCase() );
  
  if (found) found.body = data.body;
  else messages.push({ name: data.name, body: data.body });
}

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    if (data.name.toLowerCase() == "trainer") {
      doTrainerCommand(data);
    } else {
      saveMessage(data);
    }

    io.sockets.emit("message", messages);
  });
});
