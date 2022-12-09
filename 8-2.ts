#!/usr/bin/env -S deno run --allow-read=input

import { loadInput } from './utils.ts'

const input = await loadInput(8)

const treeHeights = input.trim()
  .split('\n')
  .map(l => l.split('').map(c => +c))
const max = treeHeights.length - 1

let maxScenicScore = 0

for (let y = 0; y < treeHeights.length; y++) {
  for (let x = 0; x < treeHeights[y].length; x++) {
    const currentHeight = treeHeights[y][x]

    const visible = { left: 0, right: 0, up: 0, down: 0 }
    for (let l = x - 1; l >= 0; l--) {
      visible.left += 1
      if (treeHeights[y][l] >= currentHeight) break
    }

    for (let r = x + 1; r <= max; r++) {
      visible.right += 1
      if (treeHeights[y][r] >= currentHeight) break
    }

    for (let u = y - 1; u >= 0; u--) {
      visible.up += 1
      if (treeHeights[u][x] >= currentHeight) break
    }

    for (let d = y + 1; d <= max; d++) {
      visible.down += 1
      if (treeHeights[d][x] >= currentHeight) break
    }

    const scenicScore = Object.values(visible).reduce((a, b) => a * b)
    maxScenicScore = Math.max(maxScenicScore, scenicScore)
  }
}

console.log(maxScenicScore)
