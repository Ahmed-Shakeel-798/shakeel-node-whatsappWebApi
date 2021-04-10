var webdriver = require("selenium-webdriver");
//var service = require("selenium-webdriver-chrome");



const fs = require("fs");

// var operadriver = require('operadriver');
// var binPath = operadriver.path;


const openWhatsappWeb = async () => {
    // webdriver_service = service.Service('operadriver_linux64/operadriver');
    // webdriver_service.start();
    // capabilities = { 'operaOptions': { 'debuggerAddress': "localhost:1212" } };


    let myPromise = new Promise(async (myResolve, myReject) => {
        //console.log(binPath);
        driver = new webdriver.Builder().forBrowser('chrome').build();

        //console.log(binPath);
        //const driver = await webdriver.Remote(webdriver_service.service_url, capabilities);
        console.log(driver);
        await driver.get('https://web.whatsapp.com/');
        //const webElementHtml = driver.findElement(driver.By.tagName("html"));
        //await driver.executeScript("document.body.style.zoom=0.5").then(() => { console.log("zoomed in") });
        var element = driver.findElement(webdriver.By.xpath('//*[@id="app"]/div[1]/div/div[2]/div[1]/div/a'));
        driver.executeScript("arguments[0].scrollIntoView()", element);
        driver.sleep(300);
        setTimeout(
            async () => {

                await driver.takeScreenshot().then(
                    (output) => {
                        const outputObj = {
                            output,
                            driver: driver
                        };

                        //console.log(outputObj.output)
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

