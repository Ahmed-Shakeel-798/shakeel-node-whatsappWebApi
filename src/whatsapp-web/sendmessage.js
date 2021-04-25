var webdriver = require("selenium-webdriver");
const fs = require("fs");

const { fetchUser } = require('../db');

const sendMessageByNumber = async (contact, text, driver) => {
    const By = webdriver.By;
    return new Promise(async (myResolve, myReject) => {
        try {
            await driver.get(`https://web.whatsapp.com/send?phone=${contact}&text=${text}&app_absent=0`);
            while (1) {
                try {
                    const sendButton = await driver.findElement(By.xpath(`//*[@id="main"]/footer/div[1]/div[3]/button`));
                    await sendButton.click();
                    const output = {
                        text: text,
                        check: true
                    };
                    myResolve(output);
                    break;
                } catch (error) {
                    //console.log("caught exception");
                }
            }




        } catch (error) {
            console.log(error);
            const output = {
                error: error,
                check: false
            };
            myResolve(output);
        }
    });
}

// const sendMessageByNumber = async (contact, text, id) => {
//     const user = fetchUser(id);
//     let driver = user.driver;
//     const By = webdriver.By;
//     return new Promise(async (myResolve, myResponse) => {
//         try {
//             //TODO: make changes here
//             //await driver.get('https://wa.me/923333031794/?text=..%20..');
//             const searchContact = await driver.findElement(By.xpath('//*[@id="side"]/div[1]/div/label/div/div[2]'));
//             await searchContact.sendKeys(`${contact}\n`).then(
//                 async () => {
//                     const message_box = (await driver).findElement(By.xpath('//*[@id="main"]/footer/div[1]/div[2]/div/div[2]'));
//                     await message_box.sendKeys(`${text}`).then(
//                         async () => {
//                             const sendButton = (await driver).findElement(By.xpath('//*[@id="main"]/footer/div[1]/div[3]/button'));

//                             (await sendButton).click().then(
//                                 async () => {
//                                     //console.log("here");
//                                     setTimeout(async () => {
//                                         const myMessage = await driver.findElement(By.xpath('//*[@class="GDTQm message-out focusable-list-item"]/div/div/div/div[2]/div/div/span'));
//                                         const dataIcon = await myMessage.getAttribute("data-icon");
//                                         const ariaLabel = await myMessage.getAttribute("aria-label");
//                                         var status;
//                                         if (dataIcon == "msg-check") {
//                                             status = "Sent"
//                                         } else if (dataIcon == "msg-dblcheck") {
//                                             status = "Delivered"
//                                         }
//                                         const output = {
//                                             message: text,
//                                             status,
//                                             //dataIcon,
//                                             //ariaLabel,
//                                             check: true,
//                                         }
//                                         myResolve(output);
//                                     }, 1000);
//                                 }
//                             );
//                         }
//                     )
//                     //myResolve(10);
//                 }
//             );
//         } catch (error) {
//             //console.log(error);
//             const output = {
//                 error: error,
//                 check: false
//             };
//             myResolve(output);
//         }

//     })
// }



module.exports = {
    sendMessageByNumber: sendMessageByNumber
}