const express = require("express");
var webdriver = require("selenium-webdriver");
const fs = require("fs");
const path = require("path")

const { openWhatsappWeb } = require('./whatsapp-web/initialize');
const { sendMessage, sendMessageByNumber } = require('./whatsapp-web/sendmessage');
const { fetchUser } = require('./db');
const { fillArray, popMessage, getCurrentMessagesArray } = require('./messages-queue');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const filePath = path.join(__dirname, '/sc.png');
var driver;

app.get('/initialize', async (req, res) => {
    try {
        await openWhatsappWeb().then(
            (outputObj) => {
                driverId = outputObj.driverId;
                driver = outputObj.driver;
                console.log(driverId);
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

        //fillArray({ contact: req.body.contact, text: req.body.text });
        while (1) {
            var check = false;
            await sendMessageByNumber(req.body.contact, req.body.text, id).then((output) => {
                if (output.check) {
                    res.send({ output: output });
                    check = output.check;
                    driver.navigate().refresh();
                }
            });
            if (check) {
                break;
            }
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ Error: "Can't send message!" });
    }
});


app.listen(PORT, () => {
    console.log(`server up and running on PORT: ${PORT}`);
});