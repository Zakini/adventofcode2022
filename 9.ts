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

const simulateRope = (length: number) => {
  const rope = Array(length).fill(null).map(() => ({ x: 0, y: 0 }))
  const tailHistory: Position[] = []

  for (const move of moves) {
    for (let i = 0; i < move.distance; i++) {
      rope[0][move.axis] += move.change === 'increase' ? 1 : -1

      for (let j = 1; j < rope.length; j++) {
        if (adjacent(rope[j - 1], rope[j])) continue

        // Move tail to follow head
        if (rope[j - 1].y !== rope[j].y) rope[j].y += rope[j - 1].y > rope[j].y ? 1 : -1
        if (rope[j - 1].x !== rope[j].x) rope[j].x += rope[j - 1].x > rope[j].x ? 1 : -1
      }

      tailHistory.push({ ...rope[rope.length - 1] })
    }
  }

  const uniqueTailHistory = distinct(tailHistory.map(t => JSON.stringify(t)))
    .map(s => JSON.parse(s))

  console.log(uniqueTailHistory.length)
}

simulateRope(2)
simulateRope(10)
