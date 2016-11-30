'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.set_max_debt = exports.toString = exports.compress = exports.values = exports.entries = exports.keys = exports.remove = exports.set = exports.get = exports.has = undefined;

var _maps = require('./maps');

var _operators = require('./operators');

exports.default = (0, _maps.RootMap)(new Map());
exports.has = _operators.has;
exports.get = _operators.get;
exports.set = _operators.set;
exports.remove = _operators.remove;
exports.keys = _operators.keys;
exports.entries = _operators.entries;
exports.values = _operators.values;
exports.compress = _operators.compress;
exports.toString = _operators.toString;
exports.set_max_debt = _operators.set_max_debt;