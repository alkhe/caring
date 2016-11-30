import { ROOT, ADDITION, DELETION } from './constants'
import MapNode from './operators'

const RootMap = entries => {
	const node = new MapNode(ROOT, 0)
	
	node.entries = entries

	return node
}

const AdditionMap = (previous, key, value, debt) => {
	const node = new MapNode(ADDITION, debt)

	node.previous = previous
	node.key = key
	node.value = value

	return node
}

const DeletionMap = (previous, key, debt) => {
	const node = new MapNode(DELETION, debt)

	node.previous = previous
	node.key = key

	return node
}

export {
	RootMap,
	AdditionMap,
	DeletionMap
}
