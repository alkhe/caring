import EmptyMap, { set, remove, keys, values, toString } from '../src'

const log = ::console.log

const dump = x => {
	log(x)
	log(x::keys())
	log(x::values())
	log(x::toString())
}

let a = EmptyMap::set('a', 1)::set('b', 2)::set('d', 4)::remove('a')::remove('b')::remove('c')

dump(a)

for (let i = 0; i < 10000000; i++) {
	a = a::set('a', 1)::set('b', 2)
}

dump(a)
