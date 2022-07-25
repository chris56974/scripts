import fs from 'fs/promises'
import path from 'path'

export async function removeEmptyDirs(givenPath = '.') {
  const dirEntries = await fs.readdir(givenPath, { withFileTypes: true })
  const dirs = dirEntries.filter((dirent) => dirent.isDirectory())

  for (const dir of dirs) {
    if (await isDirEmpty(dir.name)) await fs.rmdir(path.join(givenPath, dir.name))
  }
}

export async function isDirEmpty(dirname: string) {
  return await fs.readdir(dirname).then((files) => {
    return files.length === 0
  })
}
