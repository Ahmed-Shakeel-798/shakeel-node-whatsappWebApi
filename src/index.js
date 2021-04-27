const express = require("express");
var webdriver = require("selenium-webdriver");
const fs = require("fs");
const path = require("path")

const { openWhatsappWeb } = require('./whatsapp-web/initialize');
const { sendMessageByNumber } = require('./whatsapp-web/sendmessage');
const { fetchUser } = require('./db');
const { createNewMessage, getAllMessages, popFirst } = require('./components/messages-queue');

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

        createNewMessage(req.body.contact, req.body.text, driver);

        const output = {
            recieved: "yes",
            status: "pending"
        }

        res.send({ output: output })

        //console.log(`current messages queue length: ${getAllMessages().length}`);
        const myfunc = async () => {
            if (getAllMessages().length != 0) {
                const currentMessage = getAllMessages()[0];
                await sendMessageByNumber(currentMessage.contact, currentMessage.text, currentMessage.driver).then((output) => {
                    console.log(output.text);
                    popFirst();
                    //console.log(`now messages queue length: ${getAllMessages().length}`)
                    if (getAllMessages().length != 0) {
                        setTimeout(myfunc, 1000);
                    }
                });
            }
        }
        myfunc();
        // setTimeout(async () => {
        // if (getAllMessages().length != 0) {
        //     while (getAllMessages().length != 0) {
        //         const currentMessage = getAllMessages()[0];
        //         //console.log(currentMessage.text);
        //         //popFirst();
        //         await sendMessageByNumber(currentMessage.contact, currentMessage.text, currentMessage.driver).then((output) => {
        //             console.log(output.text);
        //             //driver.navigate().refresh();
        //             popFirst();
        //             console.log(`now messages queue length: ${getAllMessages().length}`)
        //         });
        //     }
        // }
        // }, 2000)





    } catch (error) {
        console.log(error);
        res.status(500).send({ Error: "Can't send message!" });
    }
});



const turnOnQueue = async () => {

}

app.listen(PORT, () => {
    console.log(`server up and running on PORT: ${PORT}`);
});