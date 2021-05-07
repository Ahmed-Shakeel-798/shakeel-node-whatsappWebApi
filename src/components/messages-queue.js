const { sendMessageByNumber } = require('../whatsapp-web/sendmessage');

class Message {
    constructor(contact, text, driver) {
        this.contact = contact;
        this.text = text;
        this.driver = driver;
        this.status = "pending";
    }

    getContact() {
        return this.contact;
    }
    getText() {
        return this.text;
    }
    getDriver() {
        return this.driver;
    }
}

class MessagesList {
    constructor(user_id) {
        this.user_id = user_id;
        this.messages = [];
    }

    getUserId() {
        return this.user_id;
    }

    createNewMessage(contact, text, driver) {
        //console.log(`creating new message for user with id : ${this.getUserId()}`);
        let newMessage = new Message(contact, text, driver);
        this.messages.push(newMessage);
        console.log(`pushed a new message in the array with length ${this.getAllMessages().length} for user id ${this.getUserId()}`);
    }

    getAllMessages() {
        return this.messages;
    }

    popFirst() {
        this.messages.shift();
        console.log(`popped a message out of array now length ${this.getAllMessages().length}`);
    }

}


let messagesListObjectArray = [];

let createNewMessagesListObject = (user_id) => {
    let newListObject = new MessagesList(user_id);
    messagesListObjectArray.push(newListObject);
}

let fetchMessagesListObject = (user_id) => {
    for (let i = 0; i < messagesListObjectArray.length; i++) {
        if (messagesListObjectArray[i].getUserId() == user_id) {
            return messagesListObjectArray[i];
        }
    }
}


module.exports = {
    createNewMessagesListObject,
    fetchMessagesListObject,
    MessagesList,
    Message,
}