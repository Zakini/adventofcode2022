#!/usr/bin/env -S deno run --allow-read=input

import { loadInput } from './utils.ts'

type Inspect = (item: number) => number
type TargetMap = Record<'true' | 'false', number>
type OldNumber = number | 'old'
type OpCode = '+' | '*'
type Operation = (old: number, a: OldNumber, b: OldNumber) => number

const isOldNumber = (v: unknown): v is OldNumber => v === 'old' || typeof v === 'number'

class Monkey {
  #items: number[] = []
  #inspect: Inspect
  #decideDivisor: number
  #targets: TargetMap

  constructor(items: number[], inspect: Inspect, decideDivisor: number, targets: TargetMap) {
    this.#items = items
    this.#inspect = inspect
    this.#decideDivisor = decideDivisor
    this.#targets = targets
  }

  *doMonkeyBusiness() {
    while (this.#items.length > 0) {
      const item = this.#items.shift() as number
      const newItem = Math.floor(this.#inspect(item) / 3)
      const targetKey = newItem % this.#decideDivisor === 0 ? 'true' : 'false'
      yield { target: this.#targets[targetKey], item: newItem }
    }
  }

  throwTo(item: number) {
    this.#items.push(item)
  }
}

const input = await loadInput(11)

const resolveOld = (old: number, v: OldNumber) => v === 'old' ? old : v
const operationMap: Record<OpCode, Operation> = {
  '+': (old: number, a: OldNumber, b: OldNumber) => resolveOld(old, a) + resolveOld(old, b),
  '*': (old: number, a: OldNumber, b: OldNumber) => resolveOld(old, a) * resolveOld(old, b),
}

const monkeys = input.trim()
  .split('Monkey')
  .filter(m => m !== '')
  .map(
    m => m.split('\n')
      .map(l => l.trim())
      .filter(l => l !== '')
  )
  .map(([idLine, itemsLine, inspectLine, decideLine, trueTargetLine, falseTargetLine], i) => {
    const id = +idLine.split(':')[0]

    if (id !== i) throw new Error(`Got monkey ${id} out of order`)

    const items = itemsLine.split('Starting items: ')[1]
      .split(', ')
      .map(v => +v)
    const [inspectArg1, inspectOp, inspectArg2] = inspectLine.split('new = ')[1]
      .split(' ')
      .map(t => isNaN(+t) ? t : +t)

    if (!isOldNumber(inspectArg1)) {
      throw new Error(`Unexpected first argument in monkey ${id}'s inspect function: ${inspectArg1}`)
    }
    if (!isOldNumber(inspectArg2)) {
      throw new Error(`Unexpected second argument in monkey ${id}'s inspect function: ${inspectArg2}`)
    }
    if (!(inspectOp in operationMap)) {
      throw new Error(`Unrecognised operation in monkey ${id}'s inspect function: ${inspectOp}`)
    }

    // why tf is 'as' necessary here typescript 🙃
    const inspect: Inspect = item => operationMap[inspectOp as OpCode](item, inspectArg1, inspectArg2)

    const decideDivisor = +decideLine.split('divisible by ')[1]
    const targets: TargetMap = {
      'true': +trueTargetLine.split('monkey ')[1],
      'false': +falseTargetLine.split('monkey ')[1],
    }

    return new Monkey(items, inspect, decideDivisor, targets)
  })

const activityPerMonkey = Object.fromEntries(Array.from(Array(monkeys.length)).map((_, i) => [i, 0]))
for (let round = 0; round < 20; round++) {
  for (let id = 0; id < monkeys.length; id++) {
    for (const { target, item } of monkeys[id].doMonkeyBusiness()) {
      monkeys[target].throwTo(item)
      activityPerMonkey[id]++
    }
  }
}

const [highestActivity, secondHighestActivity] = Object.values(activityPerMonkey).sort((a, b) => b - a)

console.log(highestActivity * secondHighestActivity)
