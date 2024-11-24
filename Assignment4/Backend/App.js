// Author: Caleb Hemmestad
// ISU Netid : cihem@iastate.edu
// Date :  11 17, 2024

var express = require("express");
var cors = require("cors");
var fs = require("fs");
var bodyParser = require("body-parser");

// var app = express();
// app.use(cors());
// app.use(bodyParser.json());

// Server
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // Serve images statically

const port = "8081";
const host = "localhost";

const { MongoClient } = require("mongodb");
const multer = require("multer");
const path = require("path");

// const url = "mongodb://127.0.0.1:27017";
// const dbName = "secoms3190";
// const client = new MongoClient(url);
// const db = client.db(dbName);

// MySQL
const mysql = require("mysql2");
const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "fallstudent",
    password: "fallstudent",
    database: "secoms3190",
});

// Set up multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save images in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage: storage });
// Create "uploads" folder if it doesn't exist
const fs = require("fs");
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}



app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const query = "INSERT INTO contact (contact_name, phone_number, message, image_url) VALUES (?, ?, ?, ?)";
    const checkQuery = "SELECT * FROM contact WHERE contact_name = ?";
    db.query(checkQuery, [contact_name], (checkErr, checkResult) => {
        if (checkErr) {
            console.error("Database error during validation:", checkErr);
            return res.status(500).send({ error: "Error checking contact name: " + checkErr.message });
        }
        if (checkResult.length > 0) {
            // If contact_name exists, send a conflict response
            return res.status(409).send({ error: "Contact name already exists." });
        }
    });
    try {
        db.query(query, [contact_name, phone_number, message, imageUrl], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ error: "Error adding contact" + err });
            } else {
                res.status(201).send("Contact added successfully");
            }
        });
    } catch (err) {
        // Handle synchronous errors
        console.error("Error in POST /contact:", err);
        res.status(500).send({ error: "An unexpected error occurred: " + err.message });
    }
});

app.get("/contact", (req, res) => {
    try {
        db.query("SELECT * FROM contact", (err, result) => {
            if (err) {
                console.error({ error: "Error reading all posts:" + err });
                return res.status(500).send({ error: "Error reading all contacts" + err });
            }
            res.status(200).send(result);
        });
    } catch (err) {
        console.error({ error: "An unexpected error occurred" + err });
        res.status(500).send({ error: "An unexpected error occurred" + err });
    }
});

app.get("/listRobots", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");

    const query = {};
    const results = await db
        .collection("movie")
        .find(query)
        .limit(100)
        .toArray();
    console.log(results);

    res.status(200);
    res.send(results);
});

app.get("/:id", async (req, res) => {
    const movieId = req.params.id;
    console.log("Movie to find :", movieId);
    await client.connect();
    console.log("Node connected successfully to GET-id MongoDB");
    const query = { movieId: movieId };
    const results = await db.collection("movie")
        .findOne(query);
    console.log("Results :", results);
    if (!results)
        res.send("Not Found").status(404);
    else
        res.send(results).status(200);
});

app.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const query = { id: id };
});

app.get("/contact/name", (req, res) => {
    const { contact_name } = req.query;
    if (!contact_name) {
        return res.status(400).send({ error: "contact_name is required" });
    }
    const query = "SELECT * FROM contact WHERE LOWER(contact_name) LIKE LOWER(?)";
    const searchValue = `%${contact_name}%`; // Add wildcards for partial match
    try {
        db.query(query, [searchValue], (err, result) => {
            if (err) {
                console.error("Error fetching contacts:", err);
                return res.status(500).send({ error: "Error fetching contacts" });
            }
            res.status(200).send(result);
        });
    } catch (err) {
        console.error({ error: "An unexpected error occurred in GET by name" + err });
        res.status(500).send({ error: "An unexpected error occurred in GET by name" + err });
    }
});

app.post("/contact", upload.single("image"), (req, res) => {
    const { contact_name, phone_number, message } = req.body;
});

app.post("/robot", async () => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).send({ error: 'Bad request: No data provided.' });
    }
    try {
        await client.connect();
        const newDocument = {
            "id": req.body.id,
            "name": req.body.name,
            "price": req.body.price,
            "description": req.body.description,
            "imageUrl": req.body.imageUrl
        };
        const existingDoc = await db
            .collection("robot")
            .findOne({ id: newDocument.id });
        if (existingDoc) {
            return res
                .status(409)
                .send({ error: "Conflict: A robot with this ID already exists." });
        }

        console.log(newDocument);
        const results = await db
            .collection("robot")
            .insertOne(newDocument);
        res.status(200);
        res.send(results);
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send({ error: 'An internal server error occurred' });
    }
});

app.delete("/contact/:id", (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM contact WHERE id = ?";
    try {
        db.query(query, [id], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ err: "Error deleting contact" });
            } else if (result.affectedRows === 0) {
                res.status(404).send({ err: "Contact not found" });
            } else {
                res.status(200).send("Contact deleted successfully");
            }
        });
    } catch (err) {
        // Handle synchronous errors
        console.error("Error in DELETE /contact:", err);
        res.status(500).send({ error: "An unexpected error occurred in DELETE: " + err.message });
    }
});

app.delete("/robot/:id", async (req, res) => {
    const robotDeleted = await db.collection("robot").findOne(query);
    try {
        // Read parameter id
        const id = Number(req.params.id);
        console.log("Robot to delete :", id);
        // Connect Mongodb
        await client.connect();
        // Delete by its id
        const query = { id: id };
        // Delete
        const results = await db.collection("robot").deleteOne(query);
        // Response to Client
        res.status(200);
        res.send(robotDeleted);
    }
    catch (error) {
        console.error("Error deleting robot:", error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.put("/robot/:id", async (req, res) => {
    const robotUpdated = await db.collection("robot").findOne(query);
    const id = Number(req.params.id); // Read parameter id
    console.log("Robot to Update :", id);
    await client.connect(); // Connect Mongodb
    const query = { id: id }; // Update by its id
    // Data for updating the document, typically comes from the request body
    console.log(req.body);
    const updateData = {
        $set: {
            "name": req.body.name,
            "price": req.body.price,
            "description": req.body.description,
            "imageUrl": req.body.imageUrl
        }
    };
    // Add options if needed, for example { upsert: true } to create a document if it doesn't exist
    const options = {};
    const results = await db.collection("robot").updateOne(query, updateData, options);
    // Response to Client
    res.status(200);
    res.send(robotUpdated);
});
