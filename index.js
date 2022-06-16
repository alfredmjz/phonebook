const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const peopleRouter = require("./controllers/person.js");
const infoRouter = require("./controllers/info.js");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const morgan = require("morgan");
const mongoose = require("mongoose");

logger.info("connecting to", config.MONGODB_URI);

mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		logger.info("connected to MongoDB");
	})
	.catch((error) => {
		logger.error("error connecting to MongoDB:", error.message);
	});

app.use(cors());
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/info", infoRouter);
app.use("/api/persons", peopleRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
app.listen(config.PORT, () => {
	console.log(`Server running on port ${config.PORT}`);
});
module.exports = app;
