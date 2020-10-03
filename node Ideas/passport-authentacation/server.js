const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());

const USERS = [];

app.get("/users", (req, res) => {
  res.send(USERS);
});
app.post("/users", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(salt);
    console.log(hashedPassword);
    const user = { name: req.body.name, password: hashedPassword };
    USERS.push(user);
    res.sendStatus(201).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/users/login", async (req, res) => {
  const user = USERS.find((user) => (user.name = req.body.name));

  if (user == null) {
    res.status(400).send("Cannot find user");
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    }
    res.send("Not Allowed");
  } catch {
    res.status(500).send();
  }
});

app.listen(3000, () => console.log("server started"));
