const mongoose = require('mongoose');
const env = require("../constants")

module.exports.connect = () => mongoose.connect(env.DB_URL);
module.exports.disconnect = () => mongoose.disconnect();