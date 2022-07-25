import fs from 'fs/promises'
import url from 'url'
import path from 'path'
import { spawnSync } from 'child_process'
import {
  IGitReposObject,
  addRepoToObj,
  grabAllGitRepos,
  checkIfFileExists,
  getRepoUrlFromGitRepo,
  getRepoNameFromRepoUrl,
  createResultsFile,
} from './grabAllGitRepos'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TEST_FOLDER_PATH = path.join(__dirname, 'test')
const PS_SCRIPT = path.join(__dirname, 'setup.ps1')
const SH_SCRIPT = path.join(__dirname, 'setup.sh')

beforeAll(() => {
  process.platform === 'win32'
    ? spawnSync('powershell.exe', [PS_SCRIPT])
    : spawnSync('sh', [SH_SCRIPT])
})

afterAll(async () => {
  await fs.rm(TEST_FOLDER_PATH, { recursive: true, force: true })
})

it('finds all repositories and produces the correct output', async () => {
  const gitRepos = await grabAllGitRepos(TEST_FOLDER_PATH)

  expect('foo' in gitRepos).toBe(true)
  expect('bar' in gitRepos).toBe(true)
  expect('qux' in gitRepos).toBe(false)
  expect(Object.keys(gitRepos).length).toBe(2)

  const fooProp = gitRepos.foo as IGitReposObject
  expect(fooProp['node-scripts']).toBe(
    'git@github.com:Chris56974/node-scripts.git'
  )

  const barProp = gitRepos.bar as IGitReposObject
  const bazProp = barProp.baz as IGitReposObject
  expect(bazProp['node-scripts']).toBe(
    'git@github.com:Chris56974/node-scripts.git'
  )
})

it('getRemoteUrlFromGitRepo', async () => {
  const urlToMatch = 'git@github.com:Chris56974/node-scripts.git'
  const gitRepoPath = path.join(TEST_FOLDER_PATH, 'foo', '.git')
  const remoteUrl = await getRepoUrlFromGitRepo(gitRepoPath)
  expect(remoteUrl).toEqual(urlToMatch)
})

it('getRepoNameFromRemoteUrl', async () => {
  const exampleUrl = 'git@github.com:Chris56974/node-scripts.git'
  const repoName = getRepoNameFromRepoUrl(exampleUrl)
  expect(repoName).toBe('node-scripts')
})

it('checkIfFileExists', async () => {
  const filePath = path.join(__dirname, 'setup.sh')
  const fileExists = await checkIfFileExists(filePath)
  expect(fileExists).toBe(true)
})

it('createResultsFile', async () => {
  const exampleData = { a: '1', b: { c: '2' } }

  await createResultsFile(exampleData, TEST_FOLDER_PATH, 'myFile.json')

  const fileExists = await checkIfFileExists(
    path.join(TEST_FOLDER_PATH, 'myFile.json')
  )

  expect(fileExists).toEqual(true)

  const filePath = path.join(TEST_FOLDER_PATH, 'myFile.json')
  const fileContentsStringified = await fs.readFile(filePath, 'utf-8')
  const fileContents = JSON.parse(fileContentsStringified)

  expect('a' in fileContents).toBe(true)
  expect('b' in fileContents).toBe(true)
  expect('c' in fileContents).toBe(false)
  expect(Object.keys(fileContents).length).toBe(2)
  expect(fileContents.a).toBe('1')
  expect(fileContents.b.c).toBe('2')
})

it('addRepoToObj', async () => {
  const repoName = 'name'
  const repoUrl = 'url'
  const folderNameArr = ['a', 'b', 'c']
  const obj: IGitReposObject = {}

  addRepoToObj(repoName, repoUrl, folderNameArr, obj)

  expect(Object.keys(obj).length).toBe(1)
  expect('a' in obj).toBe(true)
  expect('c' in obj).toBe(false)

  // I'm not sure how to handle this typescript issue properly
  const propertyA = obj.a as IGitReposObject
  const propertyB = propertyA.b as IGitReposObject
  const propertyC = propertyB.c as IGitReposObject
  expect(propertyC[repoName] === repoUrl).toBe(true)
})
