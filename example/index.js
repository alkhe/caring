import EmptyMap, { ops } from '../src'

const log = ::console.log

const dump = x => {
	log(x)
	log(x::ops.keys())
	log(x::ops.values())
	log(x::ops.toString())
}

let a = EmptyMap::ops.set('a', 1)::ops.set('b', 2)::ops.set('d', 4)::ops.remove('a')::ops.remove('b')::ops.remove('c')

dump(a)

for (let i = 0; i < 10000000; i++) {
	a = a::ops.set('a', 1)::ops.set('b', 2)
}

dump(a)
