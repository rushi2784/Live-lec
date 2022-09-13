const express = require("express");
const cors = require("cors");
require("dotenv").config();

const expressEjsLayouts=require("express-ejs-layouts")


app.set("view engine",'ejs')
const app = express();
app.use(express.json());

app.use(cors());


const connection = require("./config/config");

const URLSchema = require("./Models/urls")

app.post("/", async (req, res) => {
    const { originalURL, shortURL } = req.body;
    console.log(shortURL)

    const url = await URLSchema.find({ shortURL });

    if (url.length === 1) {
        return res.json({ "message": "This url name is already present" })
    }

    const fullURL = "http://" + req.get('host') + "/" + shortURL;


    const newURL = new URLSchema({
        originalURL,
        shortURL,
        fullURL
    })
    newURL.save()

    res.send({ success: true, fullURL })


})

app.get("/:shortURL", async (req, res) => {
    const { shortURL } = req.params;

    const data = await URLSchema.find({ shortURL });
    console.log(data.length)

    if (data.length <= 0) {
        res.send({ erroe: true, "msg": "Error 404, This url not Found" })
    }
    else {
        res.send(data)
    }
})


app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log(`connect to db on port ${process.env.PORT}`)
    }
    catch (err) {
        console.log(`err in connecting to db ${err}`)
    }
})