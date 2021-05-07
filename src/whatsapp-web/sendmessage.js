var webdriver = require("selenium-webdriver");
const fs = require("fs");

const { fetchUser } = require('../db');

const sendMessageByNumber = async (contact, text, driver) => {
    console.log(`sendMessageByNumber initialized`);
    text = text.replace(/\s/g, '%20');
    const By = webdriver.By;
    return new Promise(async (myResolve, myReject) => {
        try {
            await driver.get(`https://web.whatsapp.com/send?phone=${contact}&text=${text}&app_absent=0`);
            await driver.sleep(2000);
            const sendButton = await driver.findElement(By.xpath(`//*[@id="main"]/footer/div[1]/div[3]/button`));
            await sendButton.click();
            const output = {
                text: text,
                check: true
            };
            //console.log(i);
            console.log(`message sent successfully -------------------------------------`);
            myResolve(output);

        } catch (error) {
            console.log(`message sending failed -----------------------------------`);
            const output = {
                error: error,
                check: false
            };
            myResolve(output);
        }
    });
}



module.exports = {
    sendMessageByNumber: sendMessageByNumber
}