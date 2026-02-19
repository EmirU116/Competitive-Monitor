import { diffLines, Change } from 'diff'

export interface DiffResult {
  added: string[]
  removed: string[]
  changePercent: number
  rawDiff: string
  hasSignificantChange: boolean
}

export function computeDiff(oldContent: string, newContent: string): DiffResult {
  const changes: Change[] = diffLines(oldContent, newContent)

  const added: string[] = []
  const removed: string[] = []
  let addedChars = 0
  let removedChars = 0

  const rawParts: string[] = []

  for (const change of changes) {
    if (change.added) {
      added.push(change.value.trim())
      addedChars += change.value.length
      rawParts.push(`+ ${change.value.trim()}`)
    } else if (change.removed) {
      removed.push(change.value.trim())
      removedChars += change.value.length
      rawParts.push(`- ${change.value.trim()}`)
    }
  }

  const totalChars = Math.max(oldContent.length, 1)
  const changePercent = ((addedChars + removedChars) / (totalChars * 2)) * 100

  return {
    added: added.filter(Boolean),
    removed: removed.filter(Boolean),
    changePercent: Math.round(changePercent * 10) / 10,
    rawDiff: rawParts.join('\n'),
    // Threshold: > 2% content change is considered significant
    hasSignificantChange: changePercent > 2,
  }
}
