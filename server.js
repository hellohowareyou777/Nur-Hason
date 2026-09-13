const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.listen(PORT, "0.0.0.0", function () {
    console.log("Nur Hason server is running.");
    console.log("Open on port " + PORT);
});
