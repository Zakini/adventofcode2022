#!/usr/bin/env -S deno run --allow-read=input

import { loadInput } from './utils.ts'

type Axis = 'x' | 'y'
type Change = 'increase' | 'decrease'
type Tree = {
  height: number
  visible: boolean
}

const input = await loadInput(8)

const trees: Tree[][] = input.trim()
  .split('\n')
  .map(l => l.split('').map(c => ({ height: +c, visible: false })))
const max = trees.length - 1

const look = (axis: Axis, change: Change) => {
  const initial = change === 'increase' ? 1 : max - 1
  const condition: (v: number) => boolean = change === 'increase'
    ? v => v <= max
    : v => v >= 0
  const afterthought: (v: number) => number = change === 'increase'
    ? v => v + 1
    : v => v - 1

  for (let i = 0; i <= max; i++) {
    const edgeTree = axis === 'x'
      ? trees[i][change === 'increase' ? 0 : max]
      : trees[change === 'increase' ? 0 : max][i]
    let maxHeight = edgeTree.height
    edgeTree.visible = true

    for (let j = initial; condition(j); j = afterthought(j)) {
      const currentTree = axis === 'x'
        ? trees[i][j]
        : trees[j][i]

      if (currentTree.height > maxHeight) {
        maxHeight = currentTree.height
        currentTree.visible = true
      }
    }
  }
}

look('x', 'increase')
look('x', 'decrease')
look('y', 'increase')
look('y', 'decrease')

console.log(trees.map(line => line.filter(({ visible }) => visible).length).reduce((a, b) => a + b))
