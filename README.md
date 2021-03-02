# sqlite-vfs-js

How to try this out:

    git clone https://github.com/antimatter15/sqlite-vfs-js
    cd sqlite-vfs-js
    # Build using Emscripten (via Docker)
    make build/os.js
    # Now that it has built, run a local webserver
    python3 -m http.server 8005

Visit http://localhost:8005/prototype/read.html and open the browser console to see the demo running.
