import { app } from "./app.js";
import mongoose from "mongoose";
import "dotenv/config";
const PORT = process.env.PORT || 3000;
const uriDb = process.env.URI_DB;

const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) =>
    console.log(`Server not running. Error message: ${err.message}`)
  );
