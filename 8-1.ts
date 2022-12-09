#!/usr/bin/env -S deno run --allow-read=input

import { loadInput } from './utils.ts'

type Tree = {
  height: number
  visible: boolean
}

const input = await loadInput(8)

const trees: Tree[][] = input.trim()
  .split('\n')
  .map(l => l.split('').map(c => ({ height: +c, visible: false })))
const max = trees.length - 1

// Look right
for (let y = 0; y <= max; y++) {
  const edgeTree = trees[y][0]
  let maxHeight = edgeTree.height
  edgeTree.visible = true

  for (let x = 1; x <= max; x++) {
    const currentTree = trees[y][x]

    if (currentTree.height > maxHeight) {
      maxHeight = currentTree.height
      currentTree.visible = true
    }
  }
}

// Look left
for (let y = 0; y <= max; y++) {
  const edgeTree = trees[y][max]
  let maxHeight = edgeTree.height
  edgeTree.visible = true

  for (let x = max - 1; x >= 0; x--) {
    const currentTree = trees[y][x]

    if (currentTree.height > maxHeight) {
      maxHeight = currentTree.height
      currentTree.visible = true
    }
  }
}

// Look down
for (let x = 0; x <= max; x++) {
  const edgeTree = trees[0][x]
  let maxHeight = edgeTree.height
  edgeTree.visible = true

  for (let y = 1; y <= max; y++) {
    const currentTree = trees[y][x]

    if (currentTree.height > maxHeight) {
      maxHeight = currentTree.height
      currentTree.visible = true
    }
  }
}

// Look up
for (let x = 0; x <= max; x++) {
  const edgeTree = trees[max][x]
  let maxHeight = edgeTree.height
  edgeTree.visible = true

  for (let y = max - 1; y >= 0; y--) {
    const currentTree = trees[y][x]

    if (currentTree.height > maxHeight) {
      maxHeight = currentTree.height
      currentTree.visible = true
    }
  }
}

console.log(trees.map(line => line.filter(({ visible }) => visible).length).reduce((a, b) => a + b))
