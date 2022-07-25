# What it does

It removes all directories that have a number at the end of their name, and then nests all their contents under a single directory with the same basename. 

## IO

```bash
# INPUT
/foo1
/foo2/eg.txt
/foo3/ez.txt

# OUTPUT
/foo # with eg.txt and ez.txt
```

## Limitations

1. If any of the contents are the same between folders (foo1/a.txt and foo2/a.txt), the algorithm skips it and doesn't overwrite anything.
2. It's not very efficient (in terms of big O).
