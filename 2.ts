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

  let resultScore

  if (opponent === you) {
    // draw
    resultScore = 3
  } else {
    if (
      (opponent === 'rock' && you ==='scissors')
        || (opponent === 'paper' && you === 'rock')
        || (opponent === 'scissors' && you === 'paper')
    ) {
      // lose
      resultScore = 0
    } else {
      // win
      resultScore = 6
    }
  }

  return resultScore + moveScoreMap[you]
}

console.log(parsedInput.map(([o, y]) => score(o, y)).reduce((a, b) => a + b))
