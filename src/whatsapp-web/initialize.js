var webdriver = require("selenium-webdriver");

const fs = require("fs");

const { createNewUser } = require('../db');

const openWhatsappWeb = async () => {

    let myPromise = new Promise(async (myResolve, myReject) => {

        driver = new webdriver.Builder().forBrowser('chrome').build();

        const driverId = createNewUser(driver);

        await driver.get('https://web.whatsapp.com/');
        // await driver.executeScript("document.body.style.zoom=0.8").then(() => { console.log("zoomed out") });
        // var element = driver.findElement(webdriver.By.xpath('//*[@id="app"]/div[1]/div/div[2]/div[1]/div/a'));
        // driver.executeScript("arguments[0].scrollIntoView()", element);
        // driver.sleep(300);
        setTimeout(
            async () => {

                await driver.takeScreenshot().then(
                    (output) => {
                        const outputObj = {
                            output,
                            driverId: driverId,
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

