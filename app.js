// Mailchimp, Github doc
// https://github.com/mailchimp/mailchimp-marketing-node

const client = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const app = express();

const PORT_NUMBER = 3000;
const API_KEY = "6cadb3f2f814bd78914c7f7b1726d826-us12";
const LIST_ID = "f4e002cdee";
const SERVER_PREFIX = "us12";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/signup.html`);
});

app.post("/", (req, res) => {
  const { email, fname, lname } = req.body;
  console.log(email, fname, lname);

  // Mailchimp config
  client.setConfig({
    apiKey: API_KEY,
    server: SERVER_PREFIX,
  });

  const run = async () => {
    try {
      const response = await client.lists.addListMember(
        LIST_ID,
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: fname,
            LNAME: lname,
            BIRTHDAY: "",
            ADDRESS: {
              addr1: "",
              city: "",
              state: "",
              zip: "",
            },
          },
        },
        {
          skipMergeValidation: false,
        }
      );
      console.log(response);
      if (response.status !== "subscribed" || response.status === 404)
        throw new Error(`Something went wrong (Error: ${response.status})`);
      res.sendFile(`${__dirname}/success.html`);
    } catch (error) {
      console.log(error.message);
      res.sendFile(`${__dirname}/failure.html`);
    }
  };
  run();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.post("/success", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || PORT_NUMBER, () => {
  console.log(`Server is running`);
  //   console.log(client);
});
