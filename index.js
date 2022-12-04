const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// const routes = require("./routes/order.routes");
// app.use("/app", routes);
app.get("/health", (req, res) => {
  return res.json({ ok: true });
});
// app.get("/logo.jpg", (req, res) => {
//   res.sendFile(path.join(__dirname, "logo.jpg"));
// });

const server = async () => {
  try {
    const PORT = process.env.PORT || 3001;
    const MONGO_CONNECTION = process.env.MONGO_CONNECTION;
    await mongoose.connect(MONGO_CONNECTION, {
      useNewUrlParser: true,
    });
    console.log("DB connected");
    app.listen(PORT, () => {
      console.log("Listening on 3001");
    });
  } catch (error) {
    console.log("Error", error);
  }
};

server();
