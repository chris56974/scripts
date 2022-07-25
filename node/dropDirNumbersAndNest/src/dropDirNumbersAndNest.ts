import fs from 'fs/promises'
import path from 'path'

export async function dropDirNumbersAndNest(givenPath: string = '.') {
  const dirs = await grabDirsFromPath(givenPath)
  const dirsThatEndWithANumber = grabDirsThatEndWithANumber(dirs)
  const sortedDirsThatEndWithANumber = sortDirs(dirsThatEndWithANumber)

  let currentDirName: string = ''

  for (const dir of sortedDirsThatEndWithANumber) {
    const baseName = grabBaseName(dir) // with no numerical suffix
    const currentDirPath = path.join(givenPath, dir)

    if (baseName !== currentDirName) {
      currentDirName = baseName
      const newDirPath = path.join(givenPath, currentDirName)
      await fs.mkdir(newDirPath)
    }

    const newDirPath = path.join(givenPath, currentDirName)
    await moveAllContentsToFile(currentDirPath, newDirPath)
  }

  await removeEmptyDirs(givenPath, sortedDirsThatEndWithANumber)
}

export async function grabDirsFromPath(givenPath: string) {
  const dirEntries = await fs.readdir(givenPath, { withFileTypes: true })
  return dirEntries
    .filter((entry) => entry.isDirectory())
    .map((dirEntry) => dirEntry.name)
}

export function grabDirsThatEndWithANumber(dirs: string[]) {
  return dirs.filter((dir) => Number.isInteger(parseInt(dir[dir.length - 1])))
}

export function sortDirs(dirs: string[]) {
  const placeHolderForDirs = dirs
  return placeHolderForDirs.sort()
}

export function grabBaseName(dir: string) {
  let pointer = dir.length - 1
  while (pointer !== undefined && Number.isInteger(parseInt(dir[pointer]))) {
    pointer = pointer - 1
  }
  return dir.slice(0, pointer + 1)
}

export async function moveAllContentsToFile(oldPath: string, newPath: string) {
  const oldPathContents = await fs.readdir(oldPath, { withFileTypes: true })

  for (const dirent of oldPathContents) {
    const direntPath = path.join(oldPath, dirent.name)

    dirent.isDirectory()
      ? await moveAllContentsToFile(direntPath, newPath)
      : await moveFileIfNonExistant(dirent.name, oldPath, newPath)
  }
}

export function checkIfFileExists(givenPath: string) {
  return fs
    .access(givenPath)
    .then(() => true)
    .catch(() => false)
}

export async function moveFileIfNonExistant(
  folder: string,
  source: string,
  target: string
) {
  const sourcePath = path.join(source, folder)
  const targetPath = path.join(target, folder)

  const fileExists = await checkIfFileExists(targetPath)
  if (fileExists) return

  await fs.rename(sourcePath, targetPath)
}

export async function removeEmptyDirs(
  givenPath: string,
  dirsToRemove: string[]
) {
  for (const dir of dirsToRemove) {
    const dirPath = path.join(givenPath, dir)
    const contents = await fs.readdir(dirPath)
    if (contents.length === 0) {
      await fs.rmdir(dirPath)
    }
  }
}
