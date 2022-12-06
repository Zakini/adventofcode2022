#!/usr/bin/env -S deno run --allow-read=input

import { loadInput } from './utils.ts'

const input = await loadInput(5)
const [stacksInput, procedureInput] = input.trim().split('\n\n')

// Parse initial stack state
const parseStacks = (rawStack: string) => {
  const stackLines = rawStack.split('\n')
  const stackIdLine = stackLines.pop()
  if (!stackIdLine) throw new Error('Bad input: empty file')

  const stackCount = ((stackIdLine.length - 2) / 4) + 1
  const stacks: Record<string, string[]> = Array.from(Array(stackCount))
  .reduce((s, _, i) => ({ ...s, [i + 1 + '']: [] }), {})

  for (const line of stackLines) {
    for (let i = 0; i < stackCount; i++) {
      const maybeChar = line.charAt((i * 4) + 1)
      if (/[a-z]/i.test(maybeChar)) stacks[i + 1].unshift(maybeChar)
    }
  }

  return stacks
}

// Parse crane procedure
const procedureExtractor = /move (?<count>\d+) from (?<src>\d+) to (?<dest>\d+)/
const procedure = procedureInput.split('\n').map(l => {
  const matches = l.match(procedureExtractor)?.groups
  if (!matches) throw new Error('Bad input: line does not contain a procedure')
  const { count, src, dest } = matches
  return { src, dest, count: +count }
})

// Apply procedure - part one version
const partOneStacks = parseStacks(stacksInput)
for (const { src, dest, count } of procedure) {
  for (let i = 0; i < count; i++) {
    const item = partOneStacks[src].pop()
    if (!item) throw new Error('Popped from empty stack')
    partOneStacks[dest].push(item)
  }
}

// Apply procedure - part two version
const partTwoStacks = parseStacks(stacksInput)
for (const { src, dest, count } of procedure) {
  const items = partTwoStacks[src].slice(-count)
  if (items.length !== count) throw new Error('Attempted to move too many items')
  partTwoStacks[src] = partTwoStacks[src].slice(0, -count)
  partTwoStacks[dest] = partTwoStacks[dest].concat(items)
}

// Extract answer
console.log(Object.values(partOneStacks).map(s => s[s.length - 1]).join(''))
console.log(Object.values(partTwoStacks).map(s => s[s.length - 1]).join(''))
