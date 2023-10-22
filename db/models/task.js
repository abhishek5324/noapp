const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskDef = {
    "status":{
        "type": "String"
    },
    "failedCount":{
        "type": "Number",
        "default": 0
    },
    "failedData":{
        "type": "String"
    }

}

let taskSchema = new Schema(taskDef, {
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
});

module.exports = mongoose.model('Task', taskSchema)

