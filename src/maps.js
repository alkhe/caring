import { ROOT, ADDITION, DELETION } from './constants'

const RootMap = entries => ({
	type: ROOT,
	debt: 0,
	entries
})

const AdditionMap = (previous, key, value, debt) => ({
	previous,
	debt,
	type: ADDITION,
	key,
	value
})

const DeletionMap = (previous, key, debt) => ({
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
