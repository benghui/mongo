const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient;
// const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static("public"));

const url = "mongodb://beng:ZEwKaN7cSsCaXxv@ds131878.mlab.com:31878/prog";

const client = new MongoClient(url, { useNewUrlParser: true });

let db;

client.connect(err => {
    if (err) return console.log(err);
    db = client.db("prog");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log("~~~ Tuning in to waves of port " + PORT + "~~~");
    });
});

app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/index.html");
// });

app.get("/", (req, res) => {
    let cursor = db
        .collection("quotes")
        .find()
        .toArray((err, result) => {
            if (err) return console.log(err);

            res.render("index.ejs", { quotes: result });
        });
});

app.post("/quotes", (req, res) => {
    db.collection("quotes").insertOne(req.body, (err, result) => {
        if (err) return console.log(err);

        console.log("saved to database");
        res.redirect("/");
    });
});

app.put("/quotes", (req, res) => {
    db.collection("quotes").findOneAndUpdate(
        { name: "Yoda" },
        {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        },
        {
            sort: { _id: -1 },
            upsert: true
        },
        (err, result) => {
            if (err) return res.send(err);
            res.send(result);
        }
    );
});

app.delete("/quotes", (req, res) => {
    db.collection("quotes").findOneAndDelete(
        { name: req.body.name },
        (err, result) => {
            if (err) return res.send(500, err);
            res.send({ message: "A darth vadar quote got deleted" });
        }
    );
});
