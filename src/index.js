const express = require("express");
var webdriver = require("selenium-webdriver");
const fs = require("fs");
const path = require("path")

const { openWhatsappWeb } = require('./whatsapp-web/initialize');
const { sendMessageByNumber } = require('./whatsapp-web/sendmessage');
const { fetchUser } = require('./db');
const messagesQueue = require('./components/messages-queue');


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

                messagesQueue.createNewMessagesListObject(driverId);
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
        console.log(`user with id ${user.getId()} was found`);
        let messageListObject = messagesQueue.fetchMessagesListObject(user.getId());
        messageListObject.createNewMessage(req.body.contact, req.body.text, user.getDriver());


        const output = {
            recieved: "yes",
            status: "pending"
        }

        res.send({ output: output })


        const myfunc = async (messageListObject) => {
            if (messageListObject.getAllMessages().length != 0) {
                const currentMessage = messageListObject.getAllMessages()[0];
                await sendMessageByNumber(currentMessage.contact, currentMessage.text, currentMessage.driver).then((output) => {
                    if (output.check) {
                        messageListObject.popFirst();
                        if (messageListObject.getAllMessages().length != 0) {
                            console.log("-------------------------------   calling setTimeout  ---------------------------");
                            setTimeout(() => { myfunc(messageListObject) }, 1000);
                        }
                    }
                    if (!output.check) {
                        if (messageListObject.getAllMessages().length != 0) {
                            console.log("-------------------------------   calling setTimeout  ---------------------------");
                            setTimeout(() => { myfunc(messageListObject) }, 1000);
                        }

                    }
                });
            }
        }
        if (messageListObject.getAllMessages().length <= 1) {
            myfunc(messageListObject);
        }


    } catch (error) {
        console.log(error);
        res.status(500).send({ Error: "Can't send message!" });
    }
});



app.listen(PORT, () => {
    console.log(`server up and running on PORT: ${PORT}`);
});