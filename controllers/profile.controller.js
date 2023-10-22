const fs = require("fs");
const csv = require("csv-parser");
const profileCollection = require("../db/models/profile");
const taskCollection = require("../db/models/task");
const {
  sendResponse,
  sendErrorResponse,
} = require("../helper/response.helper");
const path = require("path");
const batchSize = 200;
const folderName = "../failedValidations";

const {
  isValidName,
  isValidEmail,
  isValidAge,
  isValidGender,
} = require("../helper/validations.helper");

const Profile = {
  hello: (req, res) => {
    sendResponse(res, { message: "hello from server" });
  },

  status: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await taskCollection.findById(id);
      if (task && task.status === "completed") {
        const taskId = task._id.toString();
        const fileName = `${taskId}.json`;
        const filePath = path.join(__dirname, folderName, fileName);
        if (fs.existsSync(filePath)) {
          fs.readFile(filePath, (err, data) => {
            if (err) {
              throw {data: {message: "Internal Server Error"}};
            } else {
              try {
                const failedData = JSON.parse(data);
                sendResponse(res, {task: task._doc,failedData})
                fs.unlinkSync(filePath);
              } catch (error) {
                throw {data: {message: "Internal Server Error"}};
              }
            }
          });
        } else {
          sendResponse(res, {task: task._doc});
        }
      }
    } catch (error) {
      sendErrorResponse(res, error);
    }
  },

  upload: async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        throw {
          data: { message: "Please upload a CSV file" },
          statusCode: 400,
        };
      }

      const records = [];
      const failedRecords = [];

      const task = new taskCollection({
        status: "incomplete",
      });

      const createdTask = await task.save();
      const taskId = createdTask._id.toString();

      fs.createReadStream(file.path)
        .pipe(csv())
        .on("data", async (row) => {
          await validateRow(row, records, failedRecords);
          if (records.length % batchSize === 0) {
            await profileCollection.insertMany(records);
            records.length = 0;
          }
        })
        .on("end", async () => {
          if (records.length > 0) {
            await profileCollection.insertMany(records);
          }
          fs.unlinkSync(file.path);

          const updateTask = {
            status: "completed",
            failedCount: failedRecords.length || 0,
          };
          await taskCollection.findByIdAndUpdate(taskId, updateTask);
          const errorFileName = `${taskId}.json`;
          const folderPath = path.join(__dirname, folderName);
          const filePath = path.join(folderPath, errorFileName);
          if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
          }
          fs.writeFileSync(filePath, JSON.stringify(failedRecords));
        });
      sendResponse(res, { message: "File upload started", taskId });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  },

  find: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit);
      const skip = parseInt(req.query.skip);
      const records = await profileCollection.find({}).skip(skip).limit(limit);
      sendResponse(res, { records });
    } catch (error) {
      sendErrorResponse(res, error);
    }
  },
};

const validateRow = async (row, records, failedRecords) => {
  try {
    const { firstName, lastName, emailId, age, gender } = row;
    let errorMsg = "";
    if (!isValidName(firstName) && !isValidName(lastName)) {
      errorMsg +=
        "firstName and lastName should contain only alphabet characters and should have a maximum length of 15. ";
    }
    if (!isValidEmail(emailId)) {
      errorMsg += "Email format not correct. ";
    }
    if (!isValidAge(age)) {
      errorMsg += "Age should be a number and in between 1 to 120. ";
    }
    if (!isValidGender(gender)) {
      errorMsg += "gender can only be male or female. ";
    }

    if (errorMsg !== "") {
      failedRecords.push({ firstName, lastName, emailId, age, gender, errorMsg });
    } else {
      records.push({ firstName, lastName, emailId, age, gender });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = Profile;
