var webdriver = require("selenium-webdriver");

const fs = require("fs");

const { fetchUser, assignDriver } = require('../db');

const openWhatsappWeb = async (id) => {

    let myPromise = new Promise(async (myResolve, myReject) => {
        console.log(id);
        const user = fetchUser(parseInt(id));
        if (!user) {
            // console.log(user.id)
            console.log("caught -------------------------------");
            const output = {
                error: "user not found",
                check: false
            };
            return myReject(output);
        }
        const driver = new webdriver.Builder().forBrowser('chrome').build();
        assignDriver(user.id, driver);


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
                            driverId: user.id,
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

