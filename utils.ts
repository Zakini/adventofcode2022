export const loadInput = (day: number, { useExample = false } = {}) => Deno.readTextFile(
  useExample ? `input/${day}-example.txt` : `input/${day}.txt`
)
