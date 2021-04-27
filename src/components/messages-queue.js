class Message {
    constructor(contact, text, driver) {
        this.contact = contact;
        this.text = text;
        this.driver = driver;
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

let messages = [];

let createNewMessage = (contact, text, driver) => {
    let newMessage = new Message(contact, text, driver);
    messages.push(newMessage);
}

let getAllMessages = () => {
    return messages;
}

let popFirst = () => {
    messages.shift();
}

module.exports = {
    createNewMessage,
    getAllMessages,
    popFirst
}