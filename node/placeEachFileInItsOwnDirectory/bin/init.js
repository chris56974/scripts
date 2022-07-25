#!/usr/bin/env node --experimental-specifier-resolution=node
import process from 'process';
import { putFilesInTheirOwnDir } from './putFilesInTheirOwnDir';
putFilesInTheirOwnDir(process.argv[2]);
