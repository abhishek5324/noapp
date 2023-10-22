const express = require("express")
const env = require("./constants")
const {initRouter} = require("./routes/index")
const {connect} = require("./helper/db.helper")
const {PORT} = env
const app = express();
app.use(express.json({ limit: '100mb' }));

initRouter(app)

connect().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening server on ${PORT}`);
    });
}).catch(err => {
    console.log(err);
    process.exit(1);
});