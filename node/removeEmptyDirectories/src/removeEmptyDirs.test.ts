import fs from 'fs/promises'
import url from 'url'
import path from 'path'
import { removeEmptyDirs } from './removeEmptyDirs'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TEST_FOLDER_PATH = path.join(__dirname + '/test')

describe('removeEmptyDirs', () => {
  it('should remove all empty directories in the current path', async () => {
    await fs.mkdir(path.join(TEST_FOLDER_PATH, 'foo'), { recursive: true })
    await fs.mkdir(path.join(TEST_FOLDER_PATH, 'bar'), { recursive: true })
    await fs.writeFile(path.join(TEST_FOLDER_PATH, 'bar', 'bar.txt'), '')

    await removeEmptyDirs()

    const contents = await fs.readdir(TEST_FOLDER_PATH)

    expect(contents[0]).toBe("bar")

    const barContents = await fs.readdir(path.join(TEST_FOLDER_PATH, "bar"))

    expect(barContents[0]).toBe("bar.txt")

    await fs.rm(TEST_FOLDER_PATH, { recursive: true, force: true })
  })
})
