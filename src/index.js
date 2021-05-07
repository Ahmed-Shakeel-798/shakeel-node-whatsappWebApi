const express = require("express");
var webdriver = require("selenium-webdriver");
const fs = require("fs");
const path = require("path")

const { openWhatsappWeb } = require('./whatsapp-web/initialize');
const { sendMessage, sendMessageByNumber } = require('./whatsapp-web/sendmessage');
const { createNewUser, fetchUser, deleteDriver } = require('./db');
const { fillArray, popMessage, getCurrentMessagesArray } = require('./messages-queue');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const filePath = path.join(__dirname, '/sc.png');
var driver;

// craetes a new user id & return it
app.post('/createUser', async (req, res) => {
    try {
        const driverId = createNewUser();
        console.log(driverId);
        if (driverId == 404) {
            throw new Error
        }
        res.set("id", `${driverId}`);
        res.status(200).send({ result: "success" });
    } catch (error) {
        console.log(e);
        res.status(500).send({ Error: "Server error!" });
    }
});

app.get('/initialize', async (req, res) => {
    try {
        await openWhatsappWeb(req.query.id).then(
            (outputObj) => {
                driverId = outputObj.driverId;
                driver = outputObj.driver;
                fs.writeFileSync('./src/sc.png', outputObj.output, 'base64');
                res.set("id", `${driverId}`);
                res.sendFile(filePath);
                setTimeout(async () => {
                    fs.unlink('./src/sc.png', (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("File is deleted.");
                    });
                }, 1000);
                driver.executeScript("document.body.style.zoom=1.0").then(() => { console.log("zoomed out") });
            }
        );


    } catch (e) {
        console.log(e);
        res.status(500).send({ Error: "Something went wrong!" });
    }
})


app.post('/sendMessageTextOnly/:id', async (req, res) => {
    try {
        var id = req.params.id;
        const user = fetchUser(id);
        if (!user) {
            return res.status(500).send({ Error: "No such user" });
        }
        let driver = user.driver;

        await sendMessageByNumber(req.body.contact, req.body.text, driver).then((output) => {
            if (output.check) {
                res.send({ output: output });
                check = output.check;
                // driver.navigate().refresh();
            }
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({ Error: "Can't send message!" });
    }
});

app.delete('/closeSession', (req, res) => {
    try {
        deleteDriver(req.query.id);
        res.status(200).send({ result: "driver deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ Error: "Can't send message!" });
    }
});


app.listen(PORT, () => {
    console.log(`server up and running on PORT: ${PORT}`);
});