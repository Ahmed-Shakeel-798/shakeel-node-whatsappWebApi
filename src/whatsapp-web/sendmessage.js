var webdriver = require("selenium-webdriver");
const fs = require("fs");

const { fetchUser } = require('../db');
const sendMessageByNumber = async (contact, text, id) => {
    const user = fetchUser(id);
    let driver = user.driver;
    const By = webdriver.By;
    return new Promise(async (myResolve, myResponse) => {
        try {
            const searchContact = await driver.findElement(By.xpath('//*[@id="side"]/div[1]/div/label/div/div[2]'));
            await searchContact.sendKeys(`${contact}\n`).then(
                async () => {
                    const message_box = (await driver).findElement(By.xpath('//*[@id="main"]/footer/div[1]/div[2]/div/div[2]'));
                    await message_box.sendKeys(`${text}`).then(
                        async () => {
                            const sendButton = (await driver).findElement(By.xpath('//*[@id="main"]/footer/div[1]/div[3]/button'));

                            (await sendButton).click().then(
                                async () => {
                                    console.log("here");
                                    setTimeout(async () => {
                                        const myMessage = await driver.findElement(By.xpath('//*[@class="GDTQm message-out focusable-list-item"]/div/div/div/div[2]/div/div/span'));
                                        const dataIcon = await myMessage.getAttribute("data-icon");
                                        const ariaLabel = await myMessage.getAttribute("aria-label");
                                        var status;
                                        if (dataIcon == "msg-check") {
                                            status = "Sent"
                                        } else if (dataIcon == "msg-dblcheck") {
                                            status = "Delivered"
                                        }
                                        const output = {
                                            message: text,
                                            status,
                                            dataIcon,
                                            ariaLabel,
                                        }
                                        myResolve(output);
                                    }, 1000);
                                }
                            );
                        }
                    )
                    //myResolve(10);
                }
            );
        } catch (error) {
            const output = {
                error: error,
            };
            myResolve(output);
        }

    })
}



module.exports = {
    //sendMessage: sendMessage,
    sendMessageByNumber: sendMessageByNumber
}