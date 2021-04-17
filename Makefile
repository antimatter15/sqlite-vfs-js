SQLITE_AMALGAMATION = sqlite-amalgamation-3350400
SQLITE_AMALGAMATION_ZIP_URL = https://sqlite.org/2021/sqlite-amalgamation-3350400.zip


## cache

cache/$(SQLITE_AMALGAMATION).zip:
	mkdir -p cache
	curl -LsSf '$(SQLITE_AMALGAMATION_ZIP_URL)' -o $@

sqlite: cache/$(SQLITE_AMALGAMATION).zip
	rm -rf $@
	unzip -u 'cache/$(SQLITE_AMALGAMATION).zip' -d .
	mv $(SQLITE_AMALGAMATION) $@
	touch $@

.PHONY: sqlite-src

sqlite-src: sqlite-src/$(SQLITE_AMALGAMATION)

# EMCC = emcc
EMCC = docker run --rm -it -v$(shell pwd):/src emscripten/emsdk emcc

EMFLAGS = \
	--memory-init-file 0 \
	-s RESERVED_FUNCTION_POINTERS=64 \
	-s ALLOW_TABLE_GROWTH=1 \
	-s EXPORTED_FUNCTIONS=@src/exported-functions.json \
	-s EXTRA_EXPORTED_RUNTIME_METHODS=@src/exported-runtime.json \
	-s SINGLE_FILE=0 \
	-s NODEJS_CATCH_EXIT=0 \
	-s NODEJS_CATCH_REJECTION=0 \
	-s WASM=1 \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s ASYNCIFY \
	-s ASYNCIFY_STACK_SIZE=16000 \
	-s ASYNCIFY_IMPORTS=@src/asyncify-imports.json \
	--post-js src/post.js \
	--pre-js src/pre.js \
	-s ENVIRONMENT=web \
	--minify 0 


SQLITE_RECOMMENDED_FLAGS = \
	-DSQLITE_DQS=0 \
	-DSQLITE_THREADSAFE=0 \
	-DSQLITE_DEFAULT_MEMSTATUS=0 \
	-DSQLITE_SQLITE_DEFAULT_WAL_SYNCHRONOUS=1 \
	-DSQLITE_LIKE_DOESNT_MATCH_BLOBS \
	-DSQLITE_MAX_EXPR_DEPTH=0 \
	-DSQLITE_OMIT_DECLTYPE \
	-DSQLITE_OMIT_DEPRECATED \
	-DSQLITE_OMIT_PROGRESS_CALLBACK \
	-DSQLITE_OMIT_SHARED_CACHE \
	-DSQLITE_USE_ALLOCA \
	-DSQLITE_OMIT_AUTOINIT 

SQLITE_FLAGS = \
	$(SQLITE_RECOMMENDED_FLAGS) \
	-DSQLITE_OS_OTHER \
	-DSQLITE_ENABLE_BATCH_ATOMIC_WRITE \
	-DSQLITE_ENABLE_ATOMIC_WRITE \
	-DSQLITE_DISABLE_LFS \
	-DSQLITE_OMIT_AUTHORIZATION \
	-DSQLITE_UNTESTABLE \
	-DSQLITE_OMIT_LOAD_EXTENSION \
	-DSQLITE_OMIT_WAL \
	-DSQLITE_HAVE_ISNAN \
	-DSQLITE_HAVE_STRCHRNUL \
	-DSQLITE_HAVE_MALLOC_USABLE_SIZE \
	-DSQLITE_OMIT_TCL_VARIABLE \
	-DSQLITE_OMIT_TRACE \
	-DSQLITE_OMIT_GET_TABLE \
	-DSQLITE_OMIT_UTF16 \
	-DSQLITE_DEFAULT_PAGE_SIZE=4096 \
	-DSQLITE_DEFAULT_CACHE_SIZE=-1000000 \
	-DSQLITE_ENABLE_DBSTAT_VTAB \
	-DSQLITE_ENABLE_JSON1 \
	-DSQLITE_ENABLE_STAT4 \
	-DSQLITE_ENABLE_FTS4 \
	-DSQLITE_ENABLE_FTS5 \
	-DSQLITE_ENABLE_MATH_FUNCTIONS

DEPS = \
	build \
	sqlite \
	src/main.c \
	src/exported-functions.json \
	src/exported-runtime.json \
	src/asyncify-imports.json \
	src/post.js \
	Makefile

build:
	mkdir -p build

build/o3.js: $(DEPS)
	$(EMCC) sqlite/sqlite3.c src/main.c -O3 -o $@ $(EMFLAGS) $(SQLITE_FLAGS)

build/os.js: $(DEPS)
	$(EMCC) sqlite/sqlite3.c src/main.c -Os -o $@ $(EMFLAGS) $(SQLITE_FLAGS)

build/o2.js: $(DEPS)
	$(EMCC) sqlite/sqlite3.c src/main.c -O2 -o $@ $(EMFLAGS) $(SQLITE_FLAGS)

build/o0.js: $(DEPS)
	$(EMCC) sqlite/sqlite3.c src/main.c -O2 -o $@ $(EMFLAGS) $(SQLITE_FLAGS)

build/oz.js: $(DEPS)
	$(EMCC) sqlite/sqlite3.c src/main.c -Oz -o $@ $(EMFLAGS) $(SQLITE_FLAGS)
