import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "christopher2003333";
const yourPassword = "christopher1234";
const yourAPIKey = "";
const yourBearerToken = "";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", (req, res) => {
  //TODO 2: Use axios to hit up the /random endpoint
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
  let result = axios.get("https://secrets-api.appbrewery.com/random");
  let resToSend = JSON.stringify(result.data);
  res.render("index.ejs", {content: resToSend});
});

app.get("/basicAuth", async (req, res) => {
  //TODO 3: Write your code here to hit up the /all endpoint
  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908
  /*
   axios.get(URL, {
      auth: {
        username: "abc",
        password: "123",
      },
    });
  */
  let userData = {username: yourUsername,
                  password: yourPassword};
  await axios.post('https://your-api-url.com/register', userData);

  result = axios.get("https://secrets-api.appbrewery.com/all?page=2", {auth: {
    username: yourUsername,
    password: yourPassword,
  }});
  resultToSend = JSON.stringify(result);
  res.render(index.ejs, {content: resultToSend});
});

app.get("/apiKey", (req, res) => {
  //TODO 4: Write your code here to hit up the /filter endpoint
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
  let apiKey = axios.get("https://secrets-api.appbrewery.com/generate-api-key");
  let key = apiKey.apiKey;
  let ress = axios.get(`https://secrets-api.appbrewery.com/filter?score=5&apiKey=${key}`);
  res.render(index.ejs, {content: ress});
});

app.get("/bearerToken", (req, res) => {
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */

  let authToken = axios.post("https://secrets-api.appbrewery.com/get-auth-token", {"username": yourUsername, "password": yourPassword});
  let auth = authToken.data;
  let result = axios.get("https://secrets-api.appbrewery.com/secrets/1", authToken.data);
  res.render("index.ejs", JSON.stringify(result));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
