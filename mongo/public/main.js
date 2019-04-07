let update = document.getElementById("update");

update.addEventListener("click", function() {
    fetch("quotes", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Darth Vader",
            quote: "I find your lack of faith disturbing."
        })
    })
        .then(res => {
            if (res.ok) return res.json();
        })
        .then(data => {
            console.log(data);
            window.location.reload(true);
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
