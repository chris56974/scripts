# What it does

It gives each file its own directory (of the same name) and then nests the file inside of it


## TS, ESM, Stuff

```bash
node --experimental-specifier-resolution=node # lets you leave off the file extensions
```

## Limitations

It does not recurse (the files in each subfolder are immune)

It runs in the current directory or any path you give it.