#!/usr/bin/env node --experimental-specifier-resolution=node

import { createResultsFile, grabAllGitRepos } from "./grabAllGitRepos";

const gitRepos = await grabAllGitRepos();

await createResultsFile(gitRepos);

console.log('hell');
