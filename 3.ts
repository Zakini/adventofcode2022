#!/usr/bin/env -S deno run --allow-read=input

import { distinct } from 'std/collections/distinct.ts'
import { intersect } from 'std/collections/intersect.ts'
import { chunk } from 'std/collections/chunk.ts'
import { loadInput } from './utils.ts'

const normaliseRucksack = (r: string) => distinct(r.split('')).sort()
const prioritise = (itemType: string) => {
  const upper = itemType === itemType.toUpperCase()
  return itemType.toUpperCase().charCodeAt(0) - 64 + (upper ? 26 : 0)
}

const input = await loadInput(3)
const rucksacks = input.trim()
  .split('\n')

const compartments = rucksacks.map(r => [r.substring(0, r.length / 2), r.substring(r.length / 2)])
const commonItemTypePerRucksack = compartments.map(r => r.map(normaliseRucksack))
  .map(([a, b]) => intersect(a, b))
  .map(([a]) => a)

const groupedRucksacks = chunk(rucksacks.map(normaliseRucksack), 3)
const badgePerGroup = groupedRucksacks.map(([a, b, c]) => intersect(a, b, c))
  .map(([a]) => a)

console.log(commonItemTypePerRucksack.map(prioritise).reduce((a, b) => a + b))
console.log(badgePerGroup.map(prioritise).reduce((a, b) => a + b))
