import {
  dropDirNumbersAndNest,
  grabDirsThatEndWithANumber,
  checkIfFileExists,
  grabBaseName,
  grabDirsFromPath,
  removeEmptyDirs,
} from './dropDirNumbersAndNest'
import fs from 'fs/promises'
import path from 'path'
import url from 'url'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TEST_FOLDER_PATH = path.join(__dirname, '/test')

describe('dropDirNumbersAndNest', () => {
  beforeEach(async () => {
    const a = fs.mkdir(TEST_FOLDER_PATH)
    const b = fs.mkdir(path.join(TEST_FOLDER_PATH, 'foo1'))
    const c = fs.mkdir(path.join(TEST_FOLDER_PATH, 'foo2'))
    const d = fs.mkdir(path.join(TEST_FOLDER_PATH, 'bar1'))
    await Promise.all([a, b, c, d])
  })

  afterEach(async () => {
    await fs.rm(TEST_FOLDER_PATH, { recursive: true, force: true })
  })

  it.only('should nest all duplicate folders inside one big folder', async () => {
    const a = fs.writeFile(path.join(TEST_FOLDER_PATH, 'foo1', 'foo1.txt'), '')
    const b = fs.writeFile(path.join(TEST_FOLDER_PATH, 'foo2', 'foo2.txt'), '')
    await Promise.all([a, b])

    await dropDirNumbersAndNest(TEST_FOLDER_PATH)
    const contents = await fs.readdir(TEST_FOLDER_PATH, { withFileTypes: true })

    const dirs = contents
      .filter((entry) => entry.isDirectory())
      .map((dirent) => dirent.name)

    expect(dirs.length).toEqual(2)

    const [dir1, dir2] = dirs

    const dir1LastChar = dir1[dir1.length - 1]
    const dir2LastChar = dir2[dir2.length - 1]

    expect(Number.isInteger(parseInt(dir1LastChar))).toBe(false)
    expect(Number.isInteger(parseInt(dir2LastChar))).toBe(false)

    const foo1IsNestedCorrectly = await checkIfFileExists(
      path.join(TEST_FOLDER_PATH, 'foo', 'foo1.txt')
    )
    const foo2IsNestedCorrectly = await checkIfFileExists(
      path.join(TEST_FOLDER_PATH, 'foo', 'foo2.txt')
    )

    expect(foo1IsNestedCorrectly).toBe(true)
    expect(foo2IsNestedCorrectly).toBe(true)
  })

  it('should not delete or overwrite conflicting content and instead skip over it', async () => {
    const a = fs.writeFile(path.join(TEST_FOLDER_PATH, 'foo1', 'foo.txt'), '')
    const b = fs.writeFile(path.join(TEST_FOLDER_PATH, 'foo2', 'foo.txt'), '')
    await Promise.all([a, b])

    await dropDirNumbersAndNest(TEST_FOLDER_PATH)

    const contents = await fs.readdir(TEST_FOLDER_PATH, { withFileTypes: true })

    const dirs = contents
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)

    expect(dirs.length).toEqual(3)

    expect(dirs.includes('foo')).toBe(true)
    expect(dirs.includes('foo2')).toBe(true)

    const foo1IsNestedCorrectly = await checkIfFileExists(
      path.join(TEST_FOLDER_PATH, 'foo', 'foo.txt')
    )
    const foo2IsNestedCorrectly = await checkIfFileExists(
      path.join(TEST_FOLDER_PATH, 'foo2', 'foo.txt')
    )

    expect(foo1IsNestedCorrectly).toBe(true)
    expect(foo2IsNestedCorrectly).toBe(true)
  })
})

describe('Other functions', () => {
  it('should grab dirs that end with a number', () => {
    const dirs = ['foo1', 'bar', 'baz0493']
    const dirsWithNums = grabDirsThatEndWithANumber(dirs)
    const includesFoo1 = dirsWithNums.includes('foo1')
    const includesBaz0493 = dirsWithNums.includes('baz0493')

    expect(includesFoo1).toBe(true)
    expect(includesBaz0493).toBe(true)
    expect(dirsWithNums.length).toBe(2)
  })

  it('should grab the basename correctly', () => {
    const a = 'foo1'
    const b = 'bar'
    const c = 'baz0493'

    expect(grabBaseName(a)).toEqual('foo')
    expect(grabBaseName(b)).toEqual('bar')
    expect(grabBaseName(c)).toEqual('baz')
  })

  it('should delete all empty directories', async () => {
    await fs.mkdir(path.join(TEST_FOLDER_PATH, 'foo1'), { recursive: true })
    await fs.mkdir(path.join(TEST_FOLDER_PATH, 'bar'), { recursive: true })
    await fs.writeFile(path.join(TEST_FOLDER_PATH, 'foo1', 'foo.txt'), '')

    const dirs = await grabDirsFromPath(TEST_FOLDER_PATH)
    await removeEmptyDirs(TEST_FOLDER_PATH, dirs)
    const newDirs = await grabDirsFromPath(TEST_FOLDER_PATH)
    expect(newDirs.length).toBe(1)
    await fs.rm(TEST_FOLDER_PATH, { recursive: true, force: true })
  })
})
