const express = require("express");
var webdriver = require("selenium-webdriver");
const fs = require("fs");
const path = require("path")

const { openWhatsappWeb } = require('./whatsapp-web/initialize');
const { sendMessage, sendMessageByNumber } = require('./whatsapp-web/sendmessage');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const filePath = path.join(__dirname, '/sc.png');
var driver;

app.get('/initialize', async (req, res) => {
    try {
        await openWhatsappWeb().then(
            (outputObj) => {
                driver = outputObj.driver;
                fs.writeFileSync('./src/sc.png', outputObj.output, 'base64');
                res.sendFile(filePath);
                setTimeout(async () => {
                    fs.unlink('./src/sc.png', (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("File is deleted.");
                    });
                }, 1000);
            }
        );
        //console.log("here");
        await driver.executeScript("document.body.style.zoom=1.0").then(() => { console.log("zoomed in") });


    } catch (e) {
        console.log(e);
        res.status(500).send({ Error: "Something went wrong!" });
    }
})

/* 
app.post('/sendMessage', async (req, res) => {
    try {
        await sendMessage(req.body.contact, req.body.text, driver).then((output) => {
            res.send(output);
        });

    } catch (error) {
        console.log(e);
        res.status(500).send({ Error: "Can't send message!" });
    }
});
*/

app.post('/sendMessageTextOnly', async (req, res) => {
    try {
        await sendMessageByNumber(req.body.contact, req.body.text, driver).then((output) => {
            res.send({ output: output });
            driver.navigate().refresh();


        });
    } catch (error) {
        console.log(e);
        res.status(500).send({ Error: "Can't send message!" });
    }
});


app.listen(PORT, () => {
    console.log(`server up and running on PORT: ${PORT}`);
});