const express = require("express");
const connectDB = require("./config/db");
const dishRoutes = require("./routes/dishRoutes");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const helmet = require("helmet");
var morgan = require('morgan')
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

connectDB();

app.use("/api/dishes", dishRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
