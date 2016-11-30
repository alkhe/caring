import { RootMap } from './maps'
import {
	has, get, set, remove,
	keys, entries, values,
	compress, toString,
	set_max_debt
} from './operators'

export default RootMap(new Map)
export {
	has, get, set, remove,
	keys, entries, values,
	compress, toString,
	set_max_debt
}
