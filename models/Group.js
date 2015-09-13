"use strict";
let Sequelize = require("sequelize");
let sequelize = global.sequelize;

let Group = sequelize.define("koablog_group", {
	id: {
		type: Sequelize.INTEGER(11),
		primaryKey: true,
		allowNull: false,
		unique: true,
		field: "id"
	},
	name: {
		type: Sequelize.STRING(40),
		allowNull: false,
		unique: true,
		field: "name"
	}
});

module.exports.Group = Group;
