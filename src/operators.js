import { ROOT, ADDITION, DELETION } from './constants'
import { RootMap, AdditionMap, DeletionMap } from './maps'

let MAX_DEBT = 128

export const set_max_debt = x => MAX_DEBT = x

function MapNode(type, debt) {
	this.type = type
	this.debt = debt
}

MapNode.prototype.has = function(k) {
	let node = this

	for (;;) {
		switch (node.type) {
			case ROOT:
				return node.entries.has(k)
			case ADDITION:
				if (node.key === k) return true
				break
			case DELETION:
				if (node.key === k) return false
				break
		}

		node = node.previous
	}
}

MapNode.prototype.get = function(k, d) {
	let node = this

	for (;;) {
		switch (node.type) {
			case ROOT: {
				const { entries } = node
				return entries.has(k) ? entries.get(k) : d
			}
			case ADDITION:
				if (node.key === k) return node.value
				break
			case DELETION:
				if (node.key === k) return d
				break
		}

		node = node.previous
	}
}

MapNode.prototype.set = function(k, v) {
	if (this.type === ADDITION && this.key === k && this.value === v) return this

	const debt = this.debt + 1
	const next = AdditionMap(this, k, v, debt)

	return debt > MAX_DEBT ? next.compress() : next
}

MapNode.prototype.remove = function(k) {
	if (this.type === DELETION && this.key === k) return this
	
	const debt = this.debt + 1
	const next = DeletionMap(this, k, debt)

	return debt > MAX_DEBT ? next.compress() : next
}

MapNode.prototype.keys = function() {
	let node = this
	const additions = new Set
	const deletions = new Set

	for (;;) {
		switch (node.type) {
			case ROOT:
				for (const k of node.entries.keys()) {
					if (!deletions.has(k)) additions.add(k)
				}

				return additions
			case ADDITION: {
				const k = node.key
				if (!deletions.has(k)) {
					additions.add(k)
				}
				break
			}
			case DELETION:
				deletions.add(node.key)
				break
		}

		node = node.previous
	}
}

MapNode.prototype.entries = function() {
	let node = this
	const entries = new Map
	const deletions = new Set

	for (;;) {
		switch (node.type) {
			case ROOT:
				for (const [k, v] of node.entries) {
					if (!entries.has(k) && deletions.has(k)) entries.set(k, v)
				}
				return entries
			case ADDITION: {
				const k = node.key
				if (!entries.has(k) && !deletions.has(k)) {
					entries.set(k, node.value)
				}
				break
			}
			case DELETION:
				deletions.add(node.key)
				break
		}

		node = node.previous
	}
}

MapNode.prototype.values = function() {
	let node = this
	const values = []
	const additions = new Set
	const deletions = new Set

	for (;;) {
		switch (node.type) {
			case ROOT: {
				for (const [k, v] of node.entries) {
					if (!additions.has(k) && deletions.has(k)) values.push(v)
				}
				return values
			}
			case ADDITION: {
				const k = node.key
				if (!additions.has(k) && !deletions.has(k)) {
					additions.add(k)
					values.push(node.value)
				}
				break
			}
			case DELETION:
				deletions.add(node.key)
				break
		}

		node = node.previous
	}
}

MapNode.prototype.compress = function() {
	return RootMap(this.entries())
}

MapNode.prototype.toString = function() {
	return `SharedMap { ${ Array.from(this.entries()).map(([k, v]) => `${ k }: ${ v }`).join(', ') } }`
}

export default MapNode
