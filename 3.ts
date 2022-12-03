#!/usr/bin/env -S deno run --allow-read=input

import { distinct } from 'std/collections/distinct.ts'
import { loadInput } from './utils.ts'

const input = await loadInput(3)
const rucksacks = input.trim()
  .split('\n')
  .map(r => [r.substring(0, r.length / 2), r.substring(r.length / 2)])

const commonItemTypes = rucksacks.map(r => r.map(c => distinct(c.split('')).sort()))
  .map(([a, b]) => {
    for (const i of a) {
      if (b.includes(i)) return i
    }
    throw new Error(`Failed to find common item between ${a.join('')} and ${b.join('')}`)
  })

const prioritise = (itemType: string) => {
  const upper = itemType === itemType.toUpperCase()
  return itemType.toUpperCase().charCodeAt(0) - 64 + (upper ? 26 : 0)
}

console.log(commonItemTypes.map(prioritise).reduce((a, b) => a + b))
