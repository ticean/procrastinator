This folder contains the binaries to start the node servers.

####  server 
The queue server.

```
    # see available options
    ./server --help
```

#### debug-callback-target 
A simple server that logs all requests to console. Useful to ensure queue callbacks are working.  
Hardcoded to run at http://127.0.0.1:8008.

    ./debug-callback-target
