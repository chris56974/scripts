#!/usr/bin/env node --experimental-specifier-resolution=node
import { grabAllGitRepos, createResultsFile } from "./grabAllGitRepos";
const gitRepos = await grabAllGitRepos();
await createResultsFile(gitRepos);
