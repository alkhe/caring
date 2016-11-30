'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.toString = exports.compress = exports.values = exports.entries = exports.keys = exports.remove = exports.set = exports.get = exports.has = exports.set_max_debt = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _constants = require('./constants');

var _maps = require('./maps');

var MAX_DEBT = 128;

var set_max_debt = exports.set_max_debt = function set_max_debt(x) {
	return MAX_DEBT = x;
};

function has(k) {
	var node = this;

	for (;;) {
		switch (node.type) {
			case _constants.ROOT:
				return node.entries.has(k);
			case _constants.ADDITION:
				if (node.key === k) return true;
				break;
			case _constants.DELETION:
				if (node.key === k) return false;
				break;
		}

		node = node.previous;
	}
}

function get(k, d) {
	var node = this;

	for (;;) {
		switch (node.type) {
			case _constants.ROOT:
				{
					var _node = node,
					    _entries = _node.entries;

					return _entries.has(k) ? _entries.get(k) : d;
				}
			case _constants.ADDITION:
				if (node.key === k) return node.value;
				break;
			case _constants.DELETION:
				if (node.key === k) return d;
				break;
		}

		node = node.previous;
	}
}

function set(k, v) {
	if (this.type === _constants.ADDITION && this.key === k && this.value === v) return this;

	var debt = this.debt + 1;
	var next = (0, _maps.AdditionMap)(this, k, v, debt);

	return debt > MAX_DEBT ? compress.call(next) : next;
}

function remove(k) {
	if (this.type === _constants.DELETION && this.key === k) return this;

	var debt = this.debt + 1;
	var next = (0, _maps.DeletionMap)(this, k, debt);

	return debt > MAX_DEBT ? compress.call(next) : next;
}

function keys() {
	var node = this;
	var additions = new Set();
	var deletions = new Set();

	for (;;) {
		switch (node.type) {
			case _constants.ROOT:
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = node.entries.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var k = _step.value;

						if (!deletions.has(k)) additions.add(k);
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				return additions;
			case _constants.ADDITION:
				{
					var _k = node.key;
					if (!deletions.has(_k)) {
						additions.add(_k);
					}
					break;
				}
			case _constants.DELETION:
				deletions.add(node.key);
				break;
		}

		node = node.previous;
	}
}

function entries() {
	var node = this;
	var entries = new Map();
	var deletions = new Set();

	for (;;) {
		switch (node.type) {
			case _constants.ROOT:
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = node.entries[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var _step2$value = _slicedToArray(_step2.value, 2),
						    k = _step2$value[0],
						    v = _step2$value[1];

						if (!entries.has(k) && deletions.has(k)) entries.set(k, v);
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				return entries;
			case _constants.ADDITION:
				{
					var k = node.key;
					if (!entries.has(k) && !deletions.has(k)) {
						entries.set(k, node.value);
					}
					break;
				}
			case _constants.DELETION:
				deletions.add(node.key);
				break;
		}

		node = node.previous;
	}
}

function values() {
	var node = this;
	var values = [];
	var additions = new Set();
	var deletions = new Set();

	for (;;) {
		switch (node.type) {
			case _constants.ROOT:
				{
					var _iteratorNormalCompletion3 = true;
					var _didIteratorError3 = false;
					var _iteratorError3 = undefined;

					try {
						for (var _iterator3 = node.entries[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
							var _step3$value = _slicedToArray(_step3.value, 2),
							    k = _step3$value[0],
							    v = _step3$value[1];

							if (!additions.has(k) && deletions.has(k)) values.push(v);
						}
					} catch (err) {
						_didIteratorError3 = true;
						_iteratorError3 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion3 && _iterator3.return) {
								_iterator3.return();
							}
						} finally {
							if (_didIteratorError3) {
								throw _iteratorError3;
							}
						}
					}

					return values;
				}
			case _constants.ADDITION:
				{
					var k = node.key;
					if (!additions.has(k) && !deletions.has(k)) {
						additions.add(k);
						values.push(node.value);
					}
					break;
				}
			case _constants.DELETION:
				deletions.add(node.key);
				break;
		}

		node = node.previous;
	}
}

function compress() {
	return (0, _maps.RootMap)(entries.call(this));
}

function toString() {
	return 'SharedMap { ' + Array.from(entries.call(this)).map(function (_ref) {
		var _ref2 = _slicedToArray(_ref, 2),
		    k = _ref2[0],
		    v = _ref2[1];

		return k + ': ' + v;
	}).join(', ') + ' }';
}

exports.has = has;
exports.get = get;
exports.set = set;
exports.remove = remove;
exports.keys = keys;
exports.entries = entries;
exports.values = values;
exports.compress = compress;
exports.toString = toString;