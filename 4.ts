#!/usr/bin/env -S deno run --allow-read=input

import { loadInput } from './utils.ts'

const input = await loadInput(4)
const pairedRanges = input.trim()
  .split('\n')
  .map(
    p => p.split(',')
      .map(r => r.split('-').map(v => +v))
      .map(([min, max]) => ({ min, max }))
  )

const wholyContainedPairs = pairedRanges.filter(([
  { min: minA, max: maxA },
  { min: minB, max: maxB },
]) => (minA <= minB && maxB <= maxA) || (minB <= minA && maxA <= maxB))

const overlappingPairs = pairedRanges.filter(([
  { min: minA, max: maxA },
  { min: minB, max: maxB },
]) => (minA <= minB && minB <= maxA) || (minA <= maxB && maxB <= maxA) || (minB <= minA && minA <= maxB))

console.log(wholyContainedPairs.length)
console.log(overlappingPairs.length)
