#!/usr/bin/env -S deno run --allow-read=input

import { loadInput } from './utils.ts'

type Command = 'cd' | 'ls'
type DirectoryListing = {
  name: string
  type: 'file' | 'dir'
  size: number | null
}
type CommandWithOutput = { command: 'cd', argument: string }
  | { command: 'ls', output: DirectoryListing[] }
type FileInfo = Omit<DirectoryListing, 'name'> & {
  path: string
}
type FileSystemNode = FileInfo & { childNodes: FileSystemNode[] }

const isCommand = (v: unknown): v is Command => typeof v === 'string'
  && (v === 'cd' || v === 'ls')

const input = await loadInput(7)

// Parse input
const commandsAndOutput: CommandWithOutput[] = input.trim()
  .split('$')
  .map(s => s.trim())
  .filter(s => s !== '')
  // First command is always cd /, ignore
  .slice(1)
  .map(s => s.split('\n'))
  .map(([commandWithArgument, ...output]) => {
    const [command, argument] = commandWithArgument.split(' ')
    if (!isCommand(command)) throw new Error(`Unrecognised command ${command}`)

    if (command === 'cd') return { command, argument }

    return {
      command,
      output: output.map((v) => {
        const [typeOrSize, name] = v.split(' ')
        const type = typeOrSize === 'dir' ? 'dir' : 'file'
        const size = typeOrSize === 'dir' ? null : +typeOrSize

        return { name, type, size }
      }),
    }
  })

// Build filesystem
const filesystem: FileSystemNode = {
  path: '/',
  type: 'dir',
  size: null,
  childNodes: [],
}

const navigationStack = [filesystem]
for (const commandWithOutput of commandsAndOutput) {
  const current = navigationStack[navigationStack.length - 1]

  if (commandWithOutput.command === 'ls') {
    for (const file of commandWithOutput.output) {
      current.childNodes.push({
        path: current.path === '/'
          ? `/${file.name}`
          : `${file.name}`,
        type: file.type,
        size: file.size,
        childNodes: [],
      })
    }
  } else {  // cd
    if (commandWithOutput.argument === '..') {
      navigationStack.pop()
    } else {
      const newPath = current.path === '/'
        ? `/${commandWithOutput.argument}`
        : `${commandWithOutput.argument}`
      const newCurrent = current.childNodes.find(n => n.path === newPath)
      if (!newCurrent) throw new Error(`Attempted to move into unknown directory: ${newPath}`)

      navigationStack.push(newCurrent)
    }
  }
}

const calculateDirectorySize = (node: FileSystemNode) => {
  if (node.size !== null) return

  for (const child of node.childNodes) {
    calculateDirectorySize(child)
  }

  node.size = node.childNodes.reduce((size, child) => {
    if (child.size === null) throw new Error(`Child node at ${child.path} does not have a calculated size yet`)
    return size + child.size
  }, 0)
}

calculateDirectorySize(filesystem)

// Calculate answer
const flattenFilesystem = ({ path, type, size, childNodes }: FileSystemNode): FileInfo[] => {
  const info: FileInfo = { path, type, size }
  return [info, ...childNodes.flatMap(flattenFilesystem)]
}
const flatFilesystem = flattenFilesystem(filesystem)

const answer = flatFilesystem.filter(({ type }) => type === 'dir')
  .map(({ size }) => {
    if (size === null) throw new Error('wut')
    return size
  })
  .filter(size => size <= 100_000)
  .reduce((a, b) => a + b)

console.log(answer)
