#!/usr/bin/env -S deno run --allow-read=input

import { loadInput } from './utils.ts'

type StartEnd = 'S' | 'E'
type Position = {
  x: number
  y: number
}
type StartEndPosition = {
  value: StartEnd
  position: Position
}

const input = await loadInput(12)

const isStartEnd = (v: unknown): v is StartEnd => v === 'S' || v === 'E'
const parseHeight = (c: string) => c.charCodeAt(0) - 'a'.charCodeAt(0)

const worldRaw: (number | StartEnd)[][] = input.trim()
  .split('\n')
  .map(
    l => l.split('')
      .map(c => c === 'S' || c === 'E' ? c : parseHeight(c))
  )
const {
  S: startPosition,
  E: targetPosition,
} = worldRaw.flatMap((r, y) => r.map((n, x) => ({ value: n, position: { x, y } })))
  .filter((v): v is StartEndPosition => v.value === 'S' || v.value === 'E')
  .reduce(
    (acc, { value, position }) => ({ ...acc, [value]: position }),
    {} as Record<StartEnd, Position>,
  )

const startEndHeightMap = { S: parseHeight('a'), E: parseHeight('z') }
const world = worldRaw.map(r => r.map(v => isStartEnd(v) ? startEndHeightMap[v] : v))

const dijkstra = (world: number[][], start: Position, target: Position): Position[] => {
  const nodeToKey = (node: Position) => `${node.x},${node.y}`
  const keyToNode = (key: string): Position => {
    const [x, y] = key.split(',')
    return { x: +x, y: +y }
  }

  let current = { ...start }
  let currentKey = nodeToKey(start)
  const targetKey = nodeToKey(target)
  const state = world.flatMap((r, y) => r.map((_, x) => nodeToKey({ x, y })))
    .reduce(
      (s, key) => ({ ...s, [key]: { visited: false, path: null } }),
      {} as { [k: string]: { visited: boolean, path: Position[] | null } }
    )
  state[currentKey].path = [{ ...current }]

  while (state[targetKey].path === null) {
    const maxNeighbourHeight = world[current.y][current.x] + 1

    const neighbours: Position[] = []
    if (current.x > 0 && world[current.y][current.x - 1] <= maxNeighbourHeight) {
      neighbours.push({ x: current.x - 1, y: current.y })
    }
    if (current.x < world[current.y].length - 1 && world[current.y][current.x + 1] <= maxNeighbourHeight) {
      neighbours.push({ x: current.x + 1, y: current.y })
    }
    if (current.y > 0 && world[current.y - 1][current.x] <= maxNeighbourHeight) {
      neighbours.push({ x: current.x, y: current.y - 1 })
    }
    if (current.y < world.length - 1 && world[current.y + 1][current.x] <= maxNeighbourHeight) {
      neighbours.push({ x: current.x, y: current.y + 1 })
    }

    const { path: currentPath } = state[currentKey]
    if (!currentPath) {
      console.log(currentPath)
      throw new Error('wut')
    }

    for (const neighbour of neighbours) {
      const neighbourKey = nodeToKey(neighbour)
      const { path: neighbourPath } = state[neighbourKey]
      const newPath = [...currentPath, { ...neighbour }]

      if (neighbourPath === null || newPath.length < neighbourPath.length) {
        state[neighbourKey].path = newPath
      }
    }

    state[currentKey].visited = true

    currentKey = Object.entries(state)
      .filter(([_, { visited }]) => !visited)
      .sort(([_, { path: a }], [__, { path: b }]) => (a?.length ?? Infinity) - (b?.length ?? Infinity))
      .map(([k]) => k)[0]
    current = keyToNode(currentKey)
  }

  // Come on Typescript, that _has_ to be Position[] here
  return state[targetKey].path as Position[]
}

console.log(dijkstra(world, startPosition, targetPosition).length - 1)
