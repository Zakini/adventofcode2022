#!/usr/bin/env -S deno run --allow-read=input

import { loadInput } from './utils.ts'

const input = await loadInput(5)
const [stacksInput, procedureInput] = input.trim().split('\n\n')

// Parse initial stack state
const stackLines = stacksInput.split('\n')
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

// Parse crane procedure
const procedureExtractor = /move (?<count>\d+) from (?<src>\d+) to (?<dest>\d+)/
const procedure = procedureInput.split('\n').map(l => {
  const matches = l.match(procedureExtractor)?.groups
  if (!matches) throw new Error('Bad input: line does not contain a procedure')
  const { count, src, dest } = matches
  return { src, dest, count: +count }
})

// Apply procedure
for (const { src, dest, count } of procedure) {
  for (let i = 0; i < count; i++) {
    const item = stacks[src].pop()
    if (!item) throw new Error('Popped from empty stack')
    stacks[dest].push(item)
  }
}

// Extract answer
console.log(Object.values(stacks).map(s => s[s.length - 1]).join(''))
