import { ROOT, ADDITION, DELETION } from './constants'
import MapNode from './operators'

const RootMap = entries => new MapNode(ROOT, 0, entries)

const AdditionMap = (previous, key, value, debt) => new MapNode(ADDITION, debt, { previous, key, value })

const DeletionMap = (previous, key, debt) => new MapNode(DELETION, debt, { previous, key })

export {
	RootMap,
	AdditionMap,
	DeletionMap
}
