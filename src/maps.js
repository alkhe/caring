import { ROOT, ADDITION, DELETION } from './constants'

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

export {
	RootMap,
	AdditionMap,
	DeletionMap
}
