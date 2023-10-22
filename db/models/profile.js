const mongoose = require('mongoose')
const Schema = mongoose.Schema

const profileDef = {
    "firstName": {
        "type": "String"
    },
    "lastName": {
        "type": "String"
    },
    "emailId": {
        "type": "String"
    },
    "age": {
        "type": "Number"
    },
    "gender": {
        "type": "String"
    },
}

let profileSchema = new Schema(profileDef, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
});

module.exports = mongoose.model('Profile', profileSchema)

