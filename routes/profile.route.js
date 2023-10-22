const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");
const multer = require("multer");

const upload = multer({
  dest: "./uploads/",
});

router.post("/upload", upload.single("file"), profileController.upload);
router.get("/hello", profileController.hello);
router.get("/status/:id", profileController.status);
router.get("/", profileController.find)


module.exports = router;
