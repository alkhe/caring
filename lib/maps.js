'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DeletionMap = exports.AdditionMap = exports.RootMap = undefined;

var _constants = require('./constants');

var _operators = require('./operators');

var _operators2 = _interopRequireDefault(_operators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RootMap = function RootMap(entries) {
	return new _operators2.default(_constants.ROOT, 0, entries);
};

var AdditionMap = function AdditionMap(previous, key, value, debt) {
	return new _operators2.default(_constants.ADDITION, debt, { previous: previous, key: key, value: value });
};

var DeletionMap = function DeletionMap(previous, key, debt) {
	return new _operators2.default(_constants.DELETION, debt, { previous: previous, key: key });
};

exports.RootMap = RootMap;
exports.AdditionMap = AdditionMap;
exports.DeletionMap = DeletionMap;