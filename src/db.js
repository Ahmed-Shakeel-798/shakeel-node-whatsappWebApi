class User {
    constructor(id) {
        this.id = id;
    }

    assignDriver(driver) {
        this.driver = driver;
    };

    deleteDriver() {
        this.driver = null;
    }

    isUser(id) {
        if (id == this.id) {
            return true;
        } else {
            return false;
        }
    }

    getId() {
        return this.id;
    }

    getDriver() {
        return this.driver;
    }

}

let users = [];

let createNewUser = () => {
    if (users.length >= 100) {
        return 404;
    }
    while (1) {
        var x = Math.floor((Math.random() * 100) + 1);
        let alreadyEXISTS = false;
        for (let i = 0; i < users.length; i++) {
            if (users[i].getId() == x) {
                alreadyEXISTS = true;
            }
        }
        if (!alreadyEXISTS) {
            let newUser = new User(x);
            users.push(newUser);
            return newUser.id;
        }
    }
}

let fetchUser = (id) => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].getId() == id) {
            console.log("found ----------------------");
            return users[i];
        }
    }
}

let assignDriver = (id, driver) => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].getId() == id) {
            users[i].assignDriver(driver);
        }
    }
}

let deleteDriver = (id) => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].getId() == id) {
            users[i].deleteDriver();
        }
    }
}

let getAllUsers = () => {
    return users;
}

module.exports = {
    createNewUser,
    getAllUsers,
    fetchUser,
    assignDriver,
    deleteDriver
}
