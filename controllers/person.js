const peopleRouter = require("express").Router();
const People = require("../models/people");
const { errorHandler } = require("../utils/middleware");

peopleRouter.get("/", (req, res, next) => {
	People.find({})
		.then((person) => {
			res.json(person);
		})
		.catch((err) => next(err));
});

peopleRouter.get("/:id", (req, res, next) => {
	const id = req.params.id;
	People.findById(id)
		.then((person) => {
			if (!person) res.status(404).end(`ID ${id} does not exist`);
			else res.json(person);
		})
		.catch((err) => next(err));
});

peopleRouter.post("/", (req, res, next) => {
	const name = req.body.name;
	const number = req.body.number;
	if (!name) {
		return res.status(400).json({
			error: "name missing",
		});
	}
	if (name.toLowerCase() === name.toUpperCase()) {
		return res.status(400).json({
			error: "name must not contain numbers",
		});
	}
	if (!number) {
		return res.status(400).json({
			error: "number missing",
		});
	}

	People.findOne({ name: name }).then((result) => {
		if (result) {
			return res.status(400).json({ error: "name must be unique" });
		} else {
			const newPerson = new People({
				name: name,
				number: number,
			});

			newPerson
				.save()
				.then((saved) => {
					res.json(saved);
				})
				.catch((err) => {
					next(err);
				});
		}
	});
});

peopleRouter.put("/:id", (req, res, next) => {
	const targetName = req.body.name;
	const newNumber = req.body.number;
	People.findOneAndUpdate(
		{ name: targetName },
		{ number: newNumber },
		{ new: true, runValidators: true, context: "query" }
	)
		.then((update) => {
			res.json(update);
		})
		.catch((err) => next(err));
});

peopleRouter.delete("/:id", (req, res, next) => {
	const id = req.params.id;
	People.findByIdAndDelete(id)
		.then((result) => {
			if (!result) res.status(404).end(`ID ${id} does not exist`);
			else res.status(204).send("successfully deleted");
		})
		.catch((err) => next(err));
});

peopleRouter.use(errorHandler);

module.exports = peopleRouter;
