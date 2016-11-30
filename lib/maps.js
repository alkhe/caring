'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DeletionMap = exports.AdditionMap = exports.RootMap = undefined;

var _constants = require('./constants');

var RootMap = function RootMap(entries) {
	return {
		type: _constants.ROOT,
		debt: 0,
		entries: entries
	};
};

var AdditionMap = function AdditionMap(previous, key, value, debt) {
	return {
		previous: previous,
		debt: debt,
		type: _constants.ADDITION,
		key: key,
		value: value
	};
};

var DeletionMap = function DeletionMap(previous, key, debt) {
	return {
		previous: previous,
		debt: debt,
		type: _constants.DELETION,
		key: key
	};
};

exports.RootMap = RootMap;
exports.AdditionMap = AdditionMap;
exports.DeletionMap = DeletionMap;