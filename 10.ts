#!/usr/bin/env -S deno run --allow-read=input

import { loadInput } from './utils.ts'
import { chunk } from 'std/collections/chunk.ts'

type Instruction = { name: 'noop', cycles: 1 }
  | { name: 'addx', argument: number, cycles: 2 }

const input = await loadInput(10)

const program: Instruction[] = input.trim()
  .split('\n')
  .map(l => l.split(' '))
  .map(([name, argument]) => {
    if (name === 'noop') return { name, cycles: 1 }
    if (name === 'addx') return { name, argument: +argument, cycles: 2 }
    throw new Error(`Unknown instruction ${name}`)
  })

class CPU {
  #cycle = 0
  #X = 1
  #program: Instruction[] = []

  loadProgram(program: Instruction[]) {
    this.#program = program
  }

  get cycle() {
    return this.#cycle
  }

  *execute() {
    for (const instruction of this.#program) {
      yield* instruction.name === 'noop'
        ? this.#noop()
        : this.#addx(instruction.argument)
    }
  }

  *#noop() {
    this.#cycle++
    yield this.#X
  }

  *#addx(argument: number) {
    this.#cycle++
    yield this.#X

    this.#cycle++
    const duringCycleX = this.#X
    this.#X += argument
    yield duringCycleX
  }
}

const cpu = new CPU()
cpu.loadProgram(program)

const signalStrengths: number[] = []
const renderBuffer: boolean[] = []

for (const x of cpu.execute()) {
  if ((cpu.cycle - 20) % 40 === 0) {
    signalStrengths.push(cpu.cycle * x)
  }

  const spriteCentre = (cpu.cycle - 1) % 40
  const spriteMin = spriteCentre - 1
  const spriteMax = spriteCentre + 1

  renderBuffer.push(spriteMin <= x && x <= spriteMax)
}

console.log(signalStrengths.reduce((a, b) => a + b))

console.log(
  chunk(renderBuffer, 40)
    .map(l => l.map(v => v ? '#' : '.').join(''))
    .join('\n')
)
