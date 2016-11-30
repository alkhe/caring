import { ROOT, ADDITION, DELETION } from './constants'

const RootMap = entries => ({
	type: ROOT,
	debt: 0,
	entries
})

const AdditionMap = (previous, key, value, debt) => ({
	type: ADDITION,
	debt,
	previous,
	key,
	value
})

const DeletionMap = (previous, key, debt) => ({
	type: DELETION,
	debt,
	previous,
	key
})

export {
	RootMap,
	AdditionMap,
	DeletionMap
}
