#!/usr/bin/env -S deno run --allow-read=input

import { distinct } from 'std/collections/distinct.ts'
import { loadInput } from './utils.ts'

const input = await loadInput(6)
const transmission = input.trim()

let n
for (n = 4; n <= transmission.length; n++) {
  if (distinct(transmission.slice(n - 4, n).split('')).length === 4) break
}

console.log(n)
