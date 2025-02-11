require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
var morgan = require('morgan')

const app = express();
app.use(express.json());
app.use(morgan('dev'))

connectDB();

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/files", require("./routes/fileRoutes"));

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
