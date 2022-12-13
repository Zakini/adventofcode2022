#!/usr/bin/env -S deno run --allow-read=input

import { loadInput } from './utils.ts'

type Item = number | Item[]

const input = await loadInput(13)

const parse = (input: string) => {
  const tokens = Array.from(input.matchAll(/\d+|\[|\]/g)).map(([v]) => v)
    // Assume the input is always an array
    .slice(1, -1)

  const output: Item[] = []
  const trace = [output]
  for (const token of tokens) {
    if (token === '[') {
      const next: Item[] = []
      trace[trace.length - 1].push(next)
      trace.push(next)
    } else if (token === ']') {
      trace.pop()
    } else {
      trace[trace.length - 1].push(+token)
    }
  }

  return output
}

const pairs = input.trim()
  .split('\n\n')
  .map(p => p.split('\n').map(parse))

const areInOrder = (a: Item, b: Item): boolean | null => {
  if (typeof a === 'number' && typeof b === 'number') {
    if (a === b) return null

    const inOrder = a < b
    return inOrder
  }

  if (typeof a === 'number') a = [a]
  if (typeof b === 'number') b = [b]

  for (let i = 0; i < a.length; i++) {
    // b ran out of items
    if (i >= b.length) return false

    const inOrder = areInOrder(a[i], b[i])
    if (inOrder !== null) return inOrder
  }

  // a is same length as be, or a ran out of items
  return a.length === b.length ? null : true
}

const inOrderPairIndices = pairs.map(([a, b], i) => areInOrder(a, b) ? i + 1 : null)
  .filter((v): v is number => v !== null)

console.log(inOrderPairIndices.reduce((a, b) => a + b))
