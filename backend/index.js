const cors = require("cors");
const PORT = 8000;
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

const uri =
  "mongodb+srv://node-auth:Password@cluster0.oekeqhv.mongodb.net/?retryWrites=true&w=majority";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("hello to my world");
});

//Sign up to database
app.post("/signup", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;

  const generateId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await client.connect();
    const database = client.db("test");
    const users = database.collection("users");
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(409).send("User already exists. Please login.");
    }

    const cleanEmail = email.toLowerCase();
    const data = {
      user_id: generateId,
      email: cleanEmail,
      hashed_password: hashedPassword,
    };

    const addUser = await users.insertOne(data);

    const token = jwt.sign(addUser, cleanEmail, { expiresIn: 60 * 24 });
    res.status(201).json({ token, userId: generateId });
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

// log in to database
app.post("/login", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;

  try {
    await client.connect();
    const database = client.db("test");
    const users = database.collection("users");

    const user = await users.findOne({ email });

    const correctPassword = await bcrypt.compare(
      password,
      user.hashed_password
    );

    if (!correctPassword) {
      return res.status(409).send("Incorrect password.");
    }

    if (user && correctPassword) {
      const token = jwt.sign(user, email, {
        expiresIn: 60 * 24,
      });
      return res.status(201).json({ token, userId: user.user_id });
    }
    return res.status(409).json("Invalid Credentials");
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

// get users by userId
app.get("/users", async (req, res) => {
  const client = new MongoClient(uri);
  const userIds = JSON.parse(req.query.userIds);
  try {
    await client.connect();
    const database = client.db("test");
    const users = database.collection("users");

    const pipeline = [
      {
        $match: {
          user_id: {
            $in: userIds,
          },
        },
      },
    ];
    const foundUsers = await users.aggregate(pipeline).toArray();
    res.send(foundUsers);
  } finally {
    await client.close();
  }
});

// get all certain gender's users
app.get("/genderedUsers", async (req, res) => {
  const client = new MongoClient(uri);
  const gender = req.query.gender;
  const setting = req.query.setting;
  try {
    await client.connect();
    const database = client.db("test");
    const users = database.collection("users");

    if (gender === "everyone") {
      const query = { setting: "everyone" };
      const foundUsers = await users.find(query).toArray();
      res.json(foundUsers);
      console.log(foundUsers);
    } else {
      const query = { gender: gender };
      const foundUsers = await users.find(query).toArray();
      res.json(foundUsers);
    }
  } finally {
    await client.close();
  }
});

// update user with a match
app.put("/addmatch", async (req, res) => {
  const client = new MongoClient(uri);
  const { userId, matchedUserId } = req.body;

  try {
    await client.connect();
    const database = client.db("test");
    const users = database.collection("users");

    const query = { user_id: userId };

    const updateUser = await users.updateOne(query, {
      $push: { matches: { user_id: matchedUserId } },
    });
    res.send(updateUser);
  } finally {
    await client.close();
  }
});

// get user
app.get("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.query.userId;

  try {
    await client.connect();
    const database = client.db("test");
    const users = database.collection("users");

    const query = { user_id: userId };
    const user = await users.findOne(query);

    res.send(user);

    // res.send(user);
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

// add user profile to database
app.put("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const formData = req.body.formData;
  try {
    await client.connect();
    const database = client.db("test");
    const users = database.collection("users");

    const query = { user_id: formData.user_id };
    const updatedDocument = {
      $set: {
        name: formData.name,
        dob_day: formData.dob_day,
        dob_month: formData.dob_month,
        dob_year: formData.dob_year,
        show_gender: formData.show_gender,
        gender: formData.gender,
        gender_preference: formData.gender_preference,
        url: formData.url,
        about: formData.about,
        matches: formData.matches,
        setting: "everyone",
      },
    };

    const insertedUser = await users.updateOne(query, updatedDocument);
    res.json(insertedUser);
  } finally {
    await client.close();
  }
});

// get messages from "from" to "to"
app.get("/messages", async (req, res) => {
  const client = new MongoClient(uri);
  const { userId, correspondingUserId } = req.query;
  try {
    await client.connect();
    const database = client.db("test");
    const messages = database.collection("messages");

    const query = {
      from_userId: userId,
      to_userId: correspondingUserId,
    };
    const foundMessages = await messages.find(query).toArray();
    res.send(foundMessages);
  } finally {
    await client.close();
  }
});

// add message to database
app.post("/message", async (req, res) => {
  const client = new MongoClient(uri);
  const message = req.body.message;

  try {
    await client.connect();
    const database = client.db("test");
    const messages = database.collection("messages");
    const insertedMessage = await messages.insertOne(message);
    res.send(insertedMessage);
  } finally {
    await client.close();
  }
});

app.listen(PORT, (req, res) => {
  console.log(`Server started at Port ${PORT}`);
});
