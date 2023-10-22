require("dotenv").config();

module.exports = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    SECRET_KEY: process.env.SECRET_KEY,
    EXPIRY_SECONDS: process.env.EXPIRY_SECONDS
}