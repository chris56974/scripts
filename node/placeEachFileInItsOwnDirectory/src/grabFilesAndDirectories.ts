import { Dirent } from 'fs'

export function grabFilesAndDirectories(directoryEntries: Dirent[]) {
  const files = directoryEntries
    .filter((entry) => entry.isFile())
    .map((fileEntry) => fileEntry.name)

  const directories = directoryEntries
    .filter((entry) => entry.isDirectory())
    .map((dirEntry) => dirEntry.name)

  return [files, directories]
}