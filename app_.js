const express = require("express");
const https = require("node:https");
const app = express();
const PORT = 3000;

const API_KEY = "6cadb3f2f814bd78914c7f7b1726d826-us12";
const listID = "f4e002cdee";
const URL = `https://us12.api.mailchimp.com/3.0/lists/${listID}/members?`;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post("/", (req, res) => {
  const { email, fname, lname } = req.body;

  // Data according Mailchimp API doc
  const data = {
    email_address: email,
    status: "subscribed",
  };
  const jsonData = JSON.stringify(data);

  // Creating the option according to the HPPTS NodeJS module
  const options = {
    method: "POST",
    auth: `abel1:${API_KEY}`,
  };

  // Making the request and store it in a variable
  const request = https.request(URL, options, (response) => {
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  // Sending the data and ending the request
  request.write(jsonData);
  request.end();
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
