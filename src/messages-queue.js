const currentMessages = [];

const fillArray = (newMessage) => {
    currentMessages.push(newMessage);
}

const popMessage = (message) => {
    for (const i = 0; i < currentMessages.length; i++) {
        if (currentMessages[i].contact == message.contact && currentMessages[i].text == message.text) {
            const removed = currentMessages.splice(i, 1);
        }
    }
}

const getCurrentMessagesArray = () => {
    return currentMessages;
}

module.exports = {
    fillArray,
    popMessage,
    getCurrentMessagesArray
}