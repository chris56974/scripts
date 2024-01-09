# To add the script to your path...

```bash
cd TO_THE_SCRIPT_YOU_WANT
npm install -g . 
script_name  
```

You can then run the command declared in the package.json file (the "bin" part).

An alternative for smaller scripts is adding this to the top

```bash
#!/usr/bin/env node
```

And then running it with shell. I only discovered this later.