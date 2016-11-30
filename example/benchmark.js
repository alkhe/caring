import { Benchmark } from 'benchmark'
import EmptyMap from '../src'
import { set, remove, multi_set, multi_remove, set_max_debt } from '../src/operators'

function onComplete() {
	const { name, stats } = this
	console.log(name)
	console.log((stats.mean * 1000).toFixed(4) + ' ms ~' + stats.rme.toFixed(2) + '%')
}

const bench = max_debt =>
	Benchmark(`MAX DEBT = ${ max_debt }`, {
		max_debt,
		map: EmptyMap,
		set_max_debt,
		setup() {
			this.set_max_debt(this.max_debt)
		},
		fn() {
			let { map } = this

			for (let i = 0; i < 100; i++) {
				for (let j = 0; j < 100; j++) {
					// map = map::set('a', 1)::set('b', 1)::remove('a')::remove('b')
					map = map::multi_set([['a', 1], ['b', 1]])::multi_remove(['a', 'b'])
				}
			}
		},
		onComplete
	})

bench(50).run()
bench(100).run()
bench(500).run()
bench(1000).run()

const bench_control = Benchmark('Spread', {
	fn() {
		var map = {}

		for (let i = 0; i < 100; i++) {
			for (let j = 0; j < 100; j++) {
				map = { ...map, a: 1, b: 2 }
				var { a, b, ...map } = map
			}
		}
	},
	onComplete
})

bench_control.run()
