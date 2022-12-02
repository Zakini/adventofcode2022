#!/usr/bin/env -S deno run --allow-read=input

import { loadInput } from "./utils.ts"

type RpsMove = 'rock' | 'paper' | 'scissors'
type RpsResult = 'lose' | 'draw' | 'win'

const moveMap: Record<string, RpsMove> = {
  A: 'rock',
  B: 'paper',
  C: 'scissors',
}

const resultMap: Record<string, RpsResult> = {
  X: 'lose',
  Y: 'draw',
  Z: 'win',
}

const input = await loadInput(2)
const parsedInput = input.trim()
  .split('\n')
  .map(l => l.split(' '))
  .map(([m, r]): [RpsMove, RpsResult] => [moveMap[m], resultMap[r]])

const score = (opponent: RpsMove, result: RpsResult) => {
  const moveScoreMap = { rock: 1, paper: 2, scissors: 3 }
  const winningResponseMap: Record<RpsMove, RpsMove> = { rock: 'paper', paper: 'scissors', scissors: 'rock' }
  const losingResponseMap: Record<RpsMove, RpsMove> = { rock: 'scissors', paper: 'rock', scissors: 'paper' }
  const resultScoreMap = { lose: 0, draw: 3, win: 6 }

  let you: RpsMove

  if (result === 'draw') {
    you = opponent
  } else if (result === 'win') {
    you = winningResponseMap[opponent]
  } else {
    you = losingResponseMap[opponent]
  }

  return moveScoreMap[you] + resultScoreMap[result]
}

console.log(parsedInput.map(([o, r]) => score(o, r)).reduce((a, b) => a + b))
