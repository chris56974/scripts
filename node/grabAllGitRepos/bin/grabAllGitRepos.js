import fs from 'fs/promises';
import path from 'path';
export async function grabAllGitRepos(givenPath = '.', folderNameArr = [], gitRepos = {}) {
    const dirEntries = await fs.readdir(givenPath, { withFileTypes: true });
    const dirs = dirEntries.filter((dirent) => dirent.isDirectory());
    for (const dir of dirs) {
        const dirFilePath = path.join(givenPath, dir.name);
        if (dir.name === '.git') {
            const remoteUrl = await getRepoUrlFromGitRepo(dirFilePath);
            if (remoteUrl === undefined)
                continue;
            const repoName = getRepoNameFromRepoUrl(remoteUrl);
            await addRepoToObj(repoName, remoteUrl, folderNameArr, gitRepos);
        }
        if (dir.name === 'node_modules')
            continue;
        await grabAllGitRepos(dirFilePath, [...folderNameArr, dir.name], gitRepos);
    }
    return gitRepos;
}
export async function getRepoUrlFromGitRepo(repoFilePath) {
    const configFilePath = path.join(repoFilePath, 'config');
    const file = await fs.readFile(configFilePath, 'utf-8');
    const fileArray = file.split('\n');
    const remoteOriginIndex = fileArray.indexOf('[remote "origin"]');
    const repoUrlIndex = fileArray[remoteOriginIndex + 1];
    const repoUrl = repoUrlIndex.split(' ').pop();
    return repoUrl;
}
// Not used but I'm keeping it in case I change my mind
export function getRepoNameFromRepoUrl(repoUrl) {
    const repoUrlArray = repoUrl.trim().split('');
    repoUrlArray.pop(); // t
    repoUrlArray.pop(); // i
    repoUrlArray.pop(); // g
    repoUrlArray.pop(); // .
    const repoNameStartIndex = repoUrlArray.lastIndexOf('/') + 1;
    return repoUrlArray.slice(repoNameStartIndex).join('');
}
export async function checkIfFileExists(filePath) {
    return await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);
}
export async function createResultsFile(gitRepos, givenPath = '.', fileName = 'repositories.json') {
    const filePath = path.resolve(givenPath, fileName);
    const stringifiedGitRepos = JSON.stringify(gitRepos);
    await fs.writeFile(filePath, stringifiedGitRepos, { encoding: 'utf-8' });
}
export async function addRepoToObj(repoName, repoUrl, folderNameArr, gitRepos) {
    // So I can remove the project folder that held the git repo
    // JS/foo/git -> JS/git
    const temp = [...folderNameArr];
    // If I want to drop a directory from all of them I can do this
    // temp.pop()
    // So I can avoid using unshift
    const folderNameArrReversed = temp.slice().reverse();
    let objectPointer = gitRepos;
    while (folderNameArrReversed.length > 0) {
        const folder = folderNameArrReversed.pop();
        if (!objectPointer[folder])
            objectPointer[folder] = {};
        objectPointer = objectPointer[folder];
    }
    objectPointer[repoName] = repoUrl;
}
