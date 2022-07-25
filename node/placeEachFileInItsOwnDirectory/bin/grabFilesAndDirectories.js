export function grabFilesAndDirectories(directoryEntries) {
    const files = directoryEntries
        .filter((entry) => entry.isFile())
        .map((fileEntry) => fileEntry.name);
    const directories = directoryEntries
        .filter((entry) => entry.isDirectory())
        .map((dirEntry) => dirEntry.name);
    return [files, directories];
}
