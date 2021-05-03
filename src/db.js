class User {
    constructor(id, driver) {
        this.id = id;
        this.driver = driver;
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

let createNewUser = (driver) => {
    var x = Math.floor((Math.random() * 100) + 1);
    let newUser = new User(x, driver);
    users.push(newUser);
    return x;
}

let fetchUser = (id) => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].getId() == id) {
            return users[i];
        }
    }
}

let getAllUsers = () => {
    return users;
}

module.exports = {
    createNewUser: createNewUser,
    getAllUsers: getAllUsers,
    fetchUser: fetchUser,
}