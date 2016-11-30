import { ROOT, ADDITION, DELETION, MULTIADD, MULTIDEL } from './constants'

const RootMap = entries => ({
	type: ROOT,
	debt: 0,
	entries
})

const AdditionMap = (previous = IdentityMap, key, value, debt = 1) => ({
	previous,
	debt,
	type: ADDITION,
	key,
	value
})

const DeletionMap = (previous = IdentityMap, key, debt = 1) => ({
	previous,
	debt,
	type: DELETION,
	key
})

const MultiAddMap = (previous = IdentityMap, entries, debt = 1) => ({
	previous,
	debt,
	type: MULTIADD,
	entries: new Map(entries)
})

const MultiDelMap = (previous = IdentityMap, keys, debt = 1) => ({
	previous,
	debt,
	type: MULTIDEL,
	keys: new Set(keys)
})

export {
	RootMap,
	AdditionMap,
	DeletionMap,
	MultiAddMap,
	MultiDelMap
}
