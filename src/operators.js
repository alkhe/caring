import { ROOT, ADDITION, DELETION, MULTIADD, MULTIDEL } from './constants'
import { RootMap, AdditionMap, DeletionMap, MultiAddMap, MultiDelMap } from './maps'

let MAX_DEBT = 128

export const set_max_debt = x => MAX_DEBT = x

function has(k) {
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
			case MULTIADD:
				if (node.entries.has(k)) return true
				break
			case MULTIDEL:
				if (node.keys.has(k)) return false
				break
			default:
				break
		}

		node = node.previous
	}
}

function get(k, d) {
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
			case MULTIADD: {
				const { entries } = node
				if (entries.has(k)) return entries.get(k)
				break
			}
			case MULTIDEL:
				if (node.keys.has(k)) return false
				break
			default:
				break
		}

		node = node.previous
	}
}

function set(k, v) {
	if (this.type === ADDITION && this.key === k && this.value === v) return this

	const debt = this.debt + 1
	const next = AdditionMap(this, k, v, debt)

	return debt > MAX_DEBT ? next::compress() : next
}

function remove(k) {
	if (this.type === DELETION && this.key === k) return this
	
	const debt = this.debt + 1
	const next = DeletionMap(this, k, debt)

	return debt > MAX_DEBT ? next::compress() : next
}

function multi_set(entries) {
	const debt = this.debt + 1
	const next = MultiAddMap(this, entries, debt)

	return debt > MAX_DEBT ? next::compress() : next
}

function multi_remove(keys) {
	const debt = this.debt + 1
	const next = MultiDelMap(this, keys, debt)

	return debt > MAX_DEBT ? next::compress() : next
}

function keys() {
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
			case MULTIADD:
				for (const k of node.entries.keys()) {
					if (!deletions.has(k)) additions.add(k)
				}
				break
			case MULTIDEL:
				for (const k of node.keys) {
					deletions.add(k)
				}
				break
			default:
				break
		}

		node = node.previous
	}
}

function entries() {
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
			case MULTIADD:
				for (const [k, v] of node.entries) {
					if (!entries.has(k) && !deletions.has(k)) {
						entries.set(k, v)
					}
				}
				break
			case MULTIDEL:
				for (const k of node.keys) {
					deletions.add(k)
				}
				break
			default:
				break
		}

		node = node.previous
	}
}

function values() {
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
			case MULTIADD: {
				for (const [k, v] of node.entries) {
					if (!additions.has(k) && !deletions.has(k)) {
						additions.add(k)
						values.push(v)
					}
				}
				break
			}
			case MULTIDEL: {
				for (const k of node.keys) {
					deletions.add(k)
				}
				break
			}
		}

		node = node.previous
	}
}

function compress() {
	return RootMap(this::entries())
}

function toString() {
	return `SharedMap { ${ Array.from(this::entries()).map(([k, v]) => `${ k }: ${ v }`).join(', ') } }`
}

export {
	has, get, set, remove,
	multi_set, multi_remove,
	keys, entries, values,
	compress, toString
}
