import fs from 'node:fs'
import mimeType from 'mime-types'

export const convertToDataUrl = (path: string): string => {
  const mime = mimeType.lookup(path)
  const base64 = fs.readFileSync(path).toString('base64')

  return `data:${mime};base64,${base64}`
}
