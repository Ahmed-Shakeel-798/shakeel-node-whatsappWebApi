var webdriver = require("selenium-webdriver");

const fs = require("fs");

const { createNewUser, getAllUsers } = require('../db');

const openWhatsappWeb = async () => {

    let myPromise = new Promise(async (myResolve, myReject) => {

        driver = new webdriver.Builder().forBrowser('chrome').build();

        createNewUser(driver);
        //console.log(getAllUsers());

        //console.log(driver);
        await driver.get('https://web.whatsapp.com/');

        // var element = driver.findElement(webdriver.By.xpath('//*[@id="app"]/div[1]/div/div[2]/div[1]/div/a'));
        // driver.executeScript("arguments[0].scrollIntoView()", element);
        // driver.sleep(300);
        setTimeout(
            async () => {

                await driver.takeScreenshot().then(
                    (output) => {
                        const outputObj = {
                            output,
                            driver: driver
                        };

                        myResolve(outputObj);
                    }
                );
            }
            , 5000);

    });

    const obj = await myPromise;
    return obj;

};

module.exports = {
    openWhatsappWeb: openWhatsappWeb,
}

