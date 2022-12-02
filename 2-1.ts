#!/usr/bin/env -S deno run --allow-read=input

import { loadInput } from "./utils.ts"

type RpsMove = 'rock' | 'paper' | 'scissors'

const moveMap: Record<string, RpsMove> = {
  A: 'rock',
  B: 'paper',
  C: 'scissors',
  X: 'rock',
  Y: 'paper',
  Z: 'scissors',
}

const input = await loadInput(2)
const parsedInput = input.trim()
  .split('\n')
  .map(l => l.split(' ').map(v => moveMap[v]))

const score = (opponent: RpsMove, you: RpsMove) => {
  const moveScoreMap = { rock: 1, paper: 2, scissors: 3 }
  const winningResponseMap: Record<RpsMove, RpsMove> = { rock: 'paper', paper: 'scissors', scissors: 'rock' }

  let resultScore

  if (opponent === you) {
    resultScore = 3
  } else {
    if (winningResponseMap[opponent] === you) resultScore = 6
    else resultScore = 0
  }

  return resultScore + moveScoreMap[you]
}

console.log(parsedInput.map(([o, y]) => score(o, y)).reduce((a, b) => a + b))
