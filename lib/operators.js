'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.set_max_debt = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _constants = require('./constants');

var _maps = require('./maps');

var MAX_DEBT = 128;

var set_max_debt = exports.set_max_debt = function set_max_debt(x) {
	return MAX_DEBT = x;
};

function MapNode(type, debt, data) {
	this.type = type;
	this.debt = debt;
	this.data = data;
}

MapNode.prototype.has = function (k) {
	var node = this;

	for (;;) {
		var _node = node,
		    data = _node.data;


		switch (node.type) {
			case _constants.ROOT:
				return data.has(k);
			case _constants.ADDITION:
				if (data.key === k) return true;
				break;
			case _constants.DELETION:
				if (data.key === k) return false;
				break;
		}

		node = data.previous;
	}
};

MapNode.prototype.get = function (k, d) {
	var node = this;

	for (;;) {
		var _node2 = node,
		    data = _node2.data;


		switch (node.type) {
			case _constants.ROOT:
				{
					return data.has(k) ? data.get(k) : d;
				}
			case _constants.ADDITION:
				if (data.key === k) return data.value;
				break;
			case _constants.DELETION:
				if (data.key === k) return d;
				break;
		}

		node = data.previous;
	}
};

MapNode.prototype.set = function (k, v) {
	var data = this.data;


	if (this.type === _constants.ADDITION && data.key === k && data.value === v) return this;

	var debt = this.debt + 1;
	var next = (0, _maps.AdditionMap)(this, k, v, debt);

	return debt > MAX_DEBT ? next.compress() : next;
};

MapNode.prototype.remove = function (k) {
	if (this.type === _constants.DELETION && this.data.key === k) return this;

	var debt = this.debt + 1;
	var next = (0, _maps.DeletionMap)(this, k, debt);

	return debt > MAX_DEBT ? next.compress() : next;
};

function entries(node) {
	var entries = new Map();
	var deletions = new Set();

	for (;;) {
		var _node3 = node,
		    data = _node3.data;


		switch (node.type) {
			case _constants.ROOT:
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var _step$value = _slicedToArray(_step.value, 2),
						    k = _step$value[0],
						    v = _step$value[1];

						if (!entries.has(k) && !deletions.has(k)) entries.set(k, v);
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

				return entries;
			case _constants.ADDITION:
				{
					var k = data.key;
					if (!entries.has(k) && !deletions.has(k)) {
						entries.set(k, data.value);
					}
					break;
				}
			case _constants.DELETION:
				deletions.add(data.key);
				break;
		}

		node = data.previous;
	}
}

MapNode.prototype.keys = function () {
	return this.entries().keys();
};

MapNode.prototype.values = function () {
	return this.entries().values();
};

MapNode.prototype.entries = function () {
	return this.compress().data;
};

MapNode.prototype.compress = function () {
	if (this.type !== _constants.ROOT) {
		this.data = entries(this);
		this.type = _constants.ROOT;
		this.debt = 0;
	}

	return this;
};

MapNode.prototype.toString = function () {
	var out = [];

	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = this.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var _step2$value = _slicedToArray(_step2.value, 2),
			    k = _step2$value[0],
			    v = _step2$value[1];

			out.push(k + ': ' + v);
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

	return 'SharedMap { ' + out.join(', ') + ' }';
};

exports.default = MapNode;