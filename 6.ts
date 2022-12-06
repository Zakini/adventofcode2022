#!/usr/bin/env -S deno run --allow-read=input

import { distinct } from 'std/collections/distinct.ts'
import { loadInput } from './utils.ts'

const input = await loadInput(6)
const transmission = input.trim()


const findFirstRunOfUniqueChars = (length: number) => {
  for (let n = length; n <= transmission.length; n++) {
    if (distinct(transmission.slice(n - length, n).split('')).length === length) return n
  }

  throw new Error(`Could not find ${length} long run of unique chars`)
}

console.log(findFirstRunOfUniqueChars(4))
console.log(findFirstRunOfUniqueChars(14))
