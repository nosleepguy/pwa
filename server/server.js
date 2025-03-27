import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import webPush from "web-push";

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

// DO NOT USE IN PROD
const publicKey =
  "BMaZoBwZ9hKINlyxR3pMvgkykXoMAfaoLEiGHa2GXpcWS5Q2Ib0dBtMUzcevNB8lAa2LpqJS7N5Esl0aSN_bXnQ";
const privateKey = "tcGAzSB53MNE5zEcU5zcNAUKKBBEFuxBD271e8-2LNo";
webPush.setVapidDetails("mailto:example@yourdomain.org", publicKey, privateKey);

// Хранилище для подписок
const subscriptions = {};

app.post("/subscribe", (req, res) => {
  const { subscription, id } = req.body;
  subscriptions[id] = subscription;
  return res.status(201).json({ data: { success: true } });
});

app.post("/send", (req, res) => {
  const { message, title, id } = req.body;
  const subscription = subscriptions[id];
  const payload = JSON.stringify({ title, message });
  webPush
    .sendNotification(subscription, payload)
    .then((value) => {
      return res.status(201).json({ data: { success: true } });
    })
    .catch((error) => {
      return res.status(400).json({ data: { success: false } });
    });
});

app.get("/info", (req, res) => {
  return res.status(200).json({ data: JSON.stringify(subscriptions) });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
