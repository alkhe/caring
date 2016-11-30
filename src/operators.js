import { ROOT, ADDITION, DELETION } from './constants'
import { RootMap, AdditionMap, DeletionMap } from './maps'

let MAX_DEBT = 128

export const set_max_debt = x => MAX_DEBT = x

function has(k) {
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

function get(k, d) {
	let node = this

	for (;;) {
		const { data } = node

		switch (node.type) {
			case ROOT:
				return data.has(k) ? data.get(k) : d
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

function set(k, v) {
	if (this.type === ADDITION && this.data.key === k && this.data.value === v) return this

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

function compute_entries(node) {
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

function keys() {
	return this::entries().keys()
}

function entries() {
	return this::compress().data
}

function values() {
	return this::entries().values()
}

function compress() {
	if (this.type !== ROOT) {
		this.data = compute_entries(this)
		this.type = ROOT
		this.debt = 0
	}

	return this
}

function toString() {
	return `SharedMap { ${ Array.from(this::entries()).map(([k, v]) => `${ k }: ${ v }`).join(', ') } }`
}

export {
	has, get, set, remove,
	keys, entries, values,
	compress, toString
}
