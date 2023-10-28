import fs from 'node:fs'
import path from 'node:path'
import { oneLine } from 'common-tags'
import getImageSize from 'image-size'

import { IGetImageParams } from './types'
import { convertToDataUrl } from './dataurl'

export const themes: Record<string, any> = {}

fs.readdirSync(
  path.resolve(__dirname, '..', '..', 'assets', 'theme'),
).filter(item => fs.statSync(path.resolve(__dirname, '..', '..', 'assets', 'theme', item)).isDirectory())
  .forEach(directory => {
    themes[directory.toLowerCase()] = {}

    fs.readdirSync(path.resolve(__dirname, '..', '..', 'assets', 'theme', directory))
      .forEach(item => {
        const imagePath = path.resolve(path.resolve(__dirname, '..', '..', 'assets', 'theme', directory, item))

        const { name } = path.parse(item)

        const { width, height } = getImageSize(imagePath)

        themes[directory][name] = {
          width,
          height,
          data: convertToDataUrl(imagePath),
        }
      })
  })

export const getImage = ({ count, theme, length }: IGetImageParams): string => {
  if (!(theme in themes)) theme = 'moebooru'

  let x = 0
  let y = 0

  const countString = count.toString().padStart(length ?? 7, '0').split('')

  const parts = countString.reduce((acc, next) => {
    const { width, height, data } = themes[theme][next]

    const image = `${acc}<image x="${x}" y="0" width="${width}" height="${height}" xlink:href="${data}" />`

    x += width

    if (height > y) {
      y = height
    }

    return image
  }, '')

  return oneLine`
    <?xml version="1.0" encoding="UTF-8"?>
    <svg width="${x}" height="${y}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="image-rendering: pixelated;">
      <title>Moe Count</title>
      <g>
        ${parts}
      </g>
    </svg>
  `
}
