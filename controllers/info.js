const infoRouter = require("express").Router();
const People = require("../models/people");
const { errorHandler } = require("../utils/middleware");

infoRouter.get("/", (req, res, next) => {
	const date = new Date();
	People.find({})
		.then((person) => {
			const message = `Phonebook has info for ${person.length} people` + "<br/>" + date;
			res.send(message);
		})
		.catch((err) => next(err));
});

infoRouter.use(errorHandler);

module.exports = infoRouter;
