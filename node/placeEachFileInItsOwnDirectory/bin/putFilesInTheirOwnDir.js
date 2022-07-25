import process from 'process';
import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';
import { grabFilesAndDirectories } from './grabFilesAndDirectories';
export async function putFilesInTheirOwnDir(userProvidedPath = '.') {
    console.log('\nNesting files in their own directories...\n');
    const dirEntries = await fs.readdir(userProvidedPath, { withFileTypes: true });
    const [originalFiles, originalDirs] = grabFilesAndDirectories(dirEntries);
    // create new dir and move the file into it
    for (const file of originalFiles) {
        const newDirName = path.parse(file).name; // I don't want the file extension
        const newDirPath = path.join(userProvidedPath, newDirName);
        const oldFilePath = path.join(userProvidedPath, file);
        const newFilePath = path.join(userProvidedPath, newDirName, file);
        await fs.mkdir(newDirPath);
        await fs.rename(oldFilePath, newFilePath);
    }
    console.log('Done!\n');
    if (process.env.NODE_ENV === 'test')
        return;
    const prompt = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    prompt.question('Do you want to undo this operation? [y] / [N] \t', async (answer) => {
        prompt.close();
        if (answer === 'N' || answer === 'n')
            return;
        const newDirEntries = await fs.readdir(userProvidedPath, {
            withFileTypes: true,
        });
        const [files, newDirs] = grabFilesAndDirectories(newDirEntries);
        console.assert(files.length === 0);
        const filteredDirs = filterOutTheNewlyCreatedDirsFromThePreviousDirs(newDirs, originalDirs);
        undo(userProvidedPath, filteredDirs);
    });
}
export const filterOutTheNewlyCreatedDirsFromThePreviousDirs = (newDirs, prevDirs) => newDirs.filter((dir) => !prevDirs.includes(dir));
// now the files are all in their own folder
export async function undo(givenPath, directoriesToUndo) {
    console.log('\nUndoing the previous operation... \n');
    for (const dir of directoriesToUndo) {
        const oldDirPath = path.join(givenPath, dir);
        const filename = await fs
            .readdir(oldDirPath)
            .then((dirEntry) => dirEntry[0]);
        const oldFilePath = path.join(givenPath, dir, filename);
        const newFilePath = path.join(givenPath, filename);
        await fs.rename(oldFilePath, newFilePath);
        await fs.rmdir(oldDirPath);
    }
    console.log('Done! \n');
}
