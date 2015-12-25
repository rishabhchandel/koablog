"use strict";
const router = require("koa-router")();
const prefix = "/tags";
router.prefix(prefix);
const Tag = require("../models/Tag");
const views = require("co-views");

// path
const viewsPath = global.path.views;

// row
const tagsPerRow = 6; // 每行6个tag

// render
const render = views(viewsPath, {
	map: {
		html: "ejs"
	}
});

// import middlewares
const verifyToken = require("../middlewares/verifyToken");
const getIdentity = require("../middlewares/getIdentity");
const filter = require("../middlewares/permissionsFilter");
const checkTag = require("../middlewares/checkTag");

// return all tags
router.get("/", function* (next) {
	switch (this.accepts(["html", "json"])) {
		case "html": {
			let tags = yield Tag.findAll({
				order: ["id"]
			});

			this.body = yield render("/frontend/tags/tags", {
				tags: tags,
				title: "Tags",
				tagsPerRow: tagsPerRow
			});
			return ;
		}break;
		case "json": {
			let tags = yield Tag.findAll({
				order: ["id"]
			});

			this.body = tags;
			return ;
		}break;
		default: {
			this.throw(406, "json and html only");
			return ;
		}
	}
});

// return one of tags
router.get("/:id", checkTag, function* (next) {
	// get target tag from checkTag
	let tag = this.tag;

	switch (this.accepts(["html", "json"])) {
		case "html": {
			this.body = tag;
			return ;
		}break;
		case "json": {
			this.body = tag;
			return ;
		}break;
		default: {
			this.throw(406, "json and html only");
			return ;
		}
	}
});

router.post("/",
	verifyToken,
	getIdentity,
	filter({
		only: "create_tags"
	}),
	function* (next) {
		let body = yield parse.form(this);
		let tagName = body.tag;

		let transaction = sequelize.transaction();

		try {
			// create tag if no exist
			let tag = yield Tag.findOrCreate({
				where: {
					name: tagName
				}
			});

			tag = tag[0];

			let tagId = tag.id;

			transaction.commit();

			this.body = {
				statusCode: 200,
				reasonPhrase: "OK",
				description: "add tag succeed",
				tagId: tagId
			};
			return ;
		}
		catch (error) {
			transaction.rollback();

			this.status = 500;
			this.body = {
				statusCode: 500,
				reasonPhrase: "Internal Server Error",
				description: "add tag fialed",
				errorCode: 4000
			};
		}
	}
);

// update a tag's info
router.put("/:id",
	verifyToken,
	getIdentity,
	filter({
		only: "update_tags"
	}),
	checkTag,
	function* (next) {
		let body = yield parse.form(this);
		let name = body.name;

		// get target tag from checkTag
		let tag = this.tag;
	}
);

// delete a tag
router.delete("/:id",
	verifyToken,
	getIdentity,
	filter({
		only: "delete_tags"
	}),
	checkTag,
	function* (next) {

	}
);

module.exports = router.routes();
