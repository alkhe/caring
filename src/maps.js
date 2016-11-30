import { ROOT, ADDITION, DELETION } from './constants'

const RootMap = entries => ({
	type: ROOT,
	debt: 0,
	data: entries
})

const AdditionMap = (previous, key, value, debt) => ({
	type: ADDITION,
	debt,
	data: {
		previous,
		key,
		value
	}
})

const DeletionMap = (previous, key, debt) => ({
	type: DELETION,
	debt,
	data: {
		previous,
		key
	}
})

export {
	RootMap,
	AdditionMap,
	DeletionMap
}
