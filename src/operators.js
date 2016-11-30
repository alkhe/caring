import { ROOT, ADDITION, DELETION } from './constants'
import { RootMap, AdditionMap, DeletionMap } from './maps'

let MAX_DEBT = 128

export const set_max_debt = x => MAX_DEBT = x

function MapNode(type, debt, data) {
	this.type = type
	this.debt = debt
	this.data = data
}

MapNode.prototype.has = function(k) {
	let node = this

	for (;;) {
		const { data } = node

		switch (node.type) {
			case ROOT:
				return data.has(k)
			case ADDITION:
				if (data.key === k) return true
				break
			case DELETION:
				if (data.key === k) return false
				break
		}

		node = data.previous
	}
}

MapNode.prototype.get = function(k, d) {
	let node = this

	for (;;) {
		const { data } = node

		switch (node.type) {
			case ROOT: {
				return data.has(k) ? data.get(k) : d
			}
			case ADDITION:
				if (data.key === k) return data.value
				break
			case DELETION:
				if (data.key === k) return d
				break
		}

		node = data.previous
	}
}

MapNode.prototype.set = function(k, v) {
	const { data } = this

	if (this.type === ADDITION && data.key === k && data.value === v) return this

	const debt = this.debt + 1
	const next = AdditionMap(this, k, v, debt)

	return debt > MAX_DEBT ? next.compress() : next
}

MapNode.prototype.remove = function(k) {
	if (this.type === DELETION && this.data.key === k) return this
	
	const debt = this.debt + 1
	const next = DeletionMap(this, k, debt)

	return debt > MAX_DEBT ? next.compress() : next
}

function entries(node) {
	const entries = new Map
	const deletions = new Set

	for (;;) {
		const { data } = node

		switch (node.type) {
			case ROOT:
				for (const [k, v] of data) {
					if (!entries.has(k) && !deletions.has(k)) entries.set(k, v)
				}
				
				return entries
			case ADDITION: {
				const k = data.key
				if (!entries.has(k) && !deletions.has(k)) {
					entries.set(k, data.value)
				}
				break
			}
			case DELETION:
				deletions.add(data.key)
				break
		}

		node = data.previous
	}
}

MapNode.prototype.keys = function() {
	return this.entries().keys()
}

MapNode.prototype.values = function() {
	return this.entries().values()
}

MapNode.prototype.entries = function() {
	return this.compress().data
}

MapNode.prototype.compress = function() {
	if (this.type !== ROOT) {
		this.data = entries(this)
		this.type = ROOT
		this.debt = 0
	}

	return this
}

MapNode.prototype.toString = function() {
	let out = []

	for (const [k, v] of this.entries()) {
		out.push(`${ k }: ${ v }`)
	}

	return `SharedMap { ${ out.join(', ') } }`
}

export default MapNode
