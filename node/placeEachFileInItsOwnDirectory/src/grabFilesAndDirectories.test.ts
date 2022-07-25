import { grabFilesAndDirectories } from './grabFilesAndDirectories'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TEST_FOLDER_PATH = path.join(__dirname, '/helper')

beforeAll(async () => {
  await fs.mkdir(path.join(TEST_FOLDER_PATH, 'foo'), { recursive: true })
  await fs.writeFile(path.join(TEST_FOLDER_PATH, 'foo', 'bar.js'), '')
  await fs.writeFile(path.join(TEST_FOLDER_PATH, 'baz.txt'), '')
})

afterAll(async () => {
  await fs.rm(TEST_FOLDER_PATH, { recursive: true, force: true })
})

describe('grabFilesAndDirectories', () => {
  it('returns the top level files and directories for a given path', async () => {
    const dirEntries = await fs.readdir(TEST_FOLDER_PATH, {
      withFileTypes: true,
    })

    const [files, dirs] = grabFilesAndDirectories(dirEntries)
    expect(files.length).toBe(1)
    expect(dirs.length).toBe(1)
  })
})
