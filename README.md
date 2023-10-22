# NoApp

This is a Node.js application that validates and stores user-uploaded data in MongoDB.

## Getting Started

To begin working with the project, follow these steps:

1. Clone the repository.
2. Run `npm ci` to install the required dependencies.
3. Create a `.env` file and specify the following environment variables:

   - `PORT`: The server port number.
   - `DB_URL`: The MongoDB connection string.
   - `SECRET_KEY`: A secret key used for generating JSON Web Tokens (JWT).
   - `EXPIRY_SECONDS`: The expiration time for the authentication token in hours.

After setting the environment variables, start the server using the command `node index.js`.

## API Endpoints

The following APIs are utilized within this application.

### User

1. **/register** : Used to create a new user.
    ```bash
    curl --request POST \
      --url http://127.0.0.1:5011/register \
      --header 'Content-Type: application/json' \
      --data '{
        "username": "",
        "password": "",
        "role": "admin"
      }'
    ```

2. **/login** : This API will provide the authentication token.
    ```bash
    curl --request POST \
      --url http://127.0.0.1:5011/login \
      --header 'Content-Type: application/json' \
      --data '{
        "username": "",
        "password": ""
      }'
    ```

### Profile

1. **/upload** : Uploads a CSV and saves only validated rows.
    ```bash
    curl --request POST \
      --url 'http://127.0.0.1:5011/upload?=' \
      --header 'Authorization: ' \
      --header 'Content-Type: multipart/form-data' \
      --form file=path
    ```

2. **/status/:id** : Fetches the status of a particular file upload using a task ID.
    ```bash
    curl --request GET \
      --url http://127.0.0.1:5011/status/:id \
      --header 'Authorization: '
    ```

3. **/** : Fetches profile data from the database. Pagination is supported in this API.
    ```bash
    curl --request GET \
      --url 'http://127.0.0.1:5011/?limit=10&skip=0' \
      --header 'Authorization: '
    ```

## Sample File
Sample file for upload can be found [here](https://drive.google.com/file/d/1DLfrNQMExspSxHBbTKT5SuP__g-u2iZl/view?usp=share_link)

## Working of the App

Users can upload a CSV file using the /upload API. Valid rows from the CSV will be stored in the database, and a task ID will be provided as a response. Users can check the upload status using the /status API by providing the task ID. If the upload is complete, the status will be marked as "complete," and any failed data will be provided as a response to the user.
