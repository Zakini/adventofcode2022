#!/usr/bin/env -S deno run --allow-read=input

import { loadInput } from './utils.ts'
import { distinct } from 'std/collections/distinct.ts'

type Axis = 'x' | 'y'
type Change = 'increase' | 'decrease'
type Move = {
  axis: Axis
  change: Change
  distance: number
}
type Position = {
  x: number
  y: number
}

const input = await loadInput(9)

// Parse input
const directionMap: Record<string, { axis: Axis, change: Change }> = {
  U: { axis: 'y', change: 'decrease' },
  D: { axis: 'y', change: 'increase' },
  L: { axis: 'x', change: 'increase' },
  R: { axis: 'x', change: 'decrease' },
}
const moves: Move[] = input.trim()
  .split('\n')
  .map(l => l.split(' '))
  .map(([d, v]) => ({ ...directionMap[d], distance: +v }))

// Move!
const adjacent = (a: Position, b: Position) => Math.abs(a.x - b.x) <=1 && Math.abs(a.y - b.y) <= 1

const head: Position = { x: 0, y: 0 }
const tail: Position = { x: 0, y: 0 }
const tailHistory: Position[] = []

for (const move of moves) {
  for (let i = 0; i < move.distance; i++) {
    head[move.axis] += move.change === 'increase' ? 1 : -1

    if (adjacent(head, tail)) continue

    // Move tail to follow head
    if (head.y !== tail.y) tail.y += head.y > tail.y ? 1 : -1
    if (head.x !== tail.x) tail.x += head.x > tail.x ? 1 : -1

    tailHistory.push({ ...tail })
  }
}

const uniqueTailHistory = distinct(tailHistory.map(t => JSON.stringify(t)))
  .map(s => JSON.parse(s))

console.log(uniqueTailHistory.length)
