#!/usr/bin/env -S deno run --allow-read=input

import { loadInput } from "./utils.ts"

const input = await loadInput(1)

const totalCaloriesPerElf = input.trim()
  .split('\n\n')
  .map(v => v.split('\n').map(v => +v))
  .map(v => v.reduce((a, b) => a + b))
  .sort((a, b) => b - a)

console.log(totalCaloriesPerElf[0])
