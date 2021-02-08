#include "../sqlite/sqlite3.h"
#include <assert.h>
#include <string.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/file.h>
#include <sys/param.h>
#include <unistd.h>
#include <time.h>
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <emscripten.h>


SQLITE_API int sqlite3_os_init(void);

#define MAXPATHNAME 1024

typedef struct JSFile JSFile;
struct JSFile {
    sqlite3_file base;              /* Base class. Must be first. */
    int deviceCharacteristics;
    int sectorSize;
};


EM_JS(int, jsClose, (sqlite3_file *pFile), {
    return Asyncify.handleSleep((wakeUp) => {
        if(Module.jsClose){
            Module.jsClose(pFile).then(wakeUp);
        }else{
            wakeUp(0);
        }
    });
})

EM_JS(int, jsRead, (
    sqlite3_file *pFile, 
    void *zBuf, 
    int iAmt, 
    sqlite_int64 iOfst
), {
    return Asyncify.handleSleep((wakeUp) => {
        Module.jsRead(pFile, zBuf, iAmt, iOfst).then(wakeUp);
    });
})

EM_JS(int, jsWrite, (
    sqlite3_file *pFile, 
    const void *zBuf, 
    int iAmt, 
    sqlite_int64 iOfst
), {
    return Asyncify.handleSleep((wakeUp) => {
        if(Module.jsWrite){
            Module.jsWrite(pFile, zBuf, iAmt, iOfst).then(wakeUp);
        }else{
            wakeUp(0);
        }
    });
})

EM_JS(int, jsTruncate, (sqlite3_file *pFile, sqlite_int64 size), {
    return Asyncify.handleSleep((wakeUp) => {
        if(Module.jsTruncate){
            Module.jsTruncate(pFile, size).then(wakeUp);    
        }else{
            wakeUp(0);
        }
    });
})

EM_JS(int, jsSync, (sqlite3_file *pFile, int flags), {
    return Asyncify.handleSleep((wakeUp) => {
        if(Module.jsSync){
            Module.jsSync(pFile, flags).then(wakeUp);
        }else{
            wakeUp(0);
        }
    });
})

EM_JS(int, jsFileSize, (sqlite3_file *pFile, sqlite_int64 *pSize), {
    return Asyncify.handleSleep((wakeUp) => {
        Module.jsFileSize(pFile, pSize).then(wakeUp);
    });
})

EM_JS(int, jsLock, (sqlite3_file *pFile, int eLock), {
    return Asyncify.handleSleep((wakeUp) => {
        if(Module.jsLock){
            Module.jsLock(pFile, eLock).then(wakeUp);    
        }else{
            wakeUp(0);
        }
    });
})

EM_JS(int, jsUnlock, (sqlite3_file *pFile, int eLock), {
    return Asyncify.handleSleep((wakeUp) => {
        if(Module.jsUnlock){
            Module.jsUnlock(pFile, eLock).then(wakeUp);    
        }else{
            wakeUp(0);
        }
    });
})

EM_JS(int, jsCheckReservedLock, (sqlite3_file *pFile, int *pResOut), {
    return Asyncify.handleSleep((wakeUp) => {
        if(Module.jsCheckReservedLock){
            Module.jsCheckReservedLock(pFile, pResOut).then(wakeUp);    
        }else{
            wakeUp(0);
        }
    });
})

EM_JS(int, jsFileControl, (sqlite3_file *pFile, int op, void *pArg), {
    return Asyncify.handleSleep((wakeUp) => {
        if(Module.jsFileControl){
            Module.jsFileControl(pFile, op, pArg).then(wakeUp);    
        }else{
            const SQLITE_FCNTL_PRAGMA = 14;
            const SQLITE_NOTFOUND = 12;
            if(op === SQLITE_FCNTL_PRAGMA){
                wakeUp(SQLITE_NOTFOUND);
            }else{
                wakeUp(0);
            }
        }
    });
})

// EM_JS(int, jsSectorSize, (sqlite3_file *pFile), {
//     return Asyncify.handleSleep((wakeUp) => {
//         Module.jsSectorSize(pFile).then(wakeUp);
//     });
// })


static int jsSectorSize(sqlite3_file *pFile){
    JSFile *p = (JSFile*)pFile;
    return p->sectorSize;
}

// EM_JS(int, jsDeviceCharacteristics, (sqlite3_file *pFile), {
//     return Asyncify.handleSleep((wakeUp) => {
//         Module.jsDeviceCharacteristics(pFile).then(wakeUp);
//     });
// })

static int jsDeviceCharacteristics(sqlite3_file *pFile){
    JSFile *p = (JSFile*)pFile;
    return p->deviceCharacteristics;
}


static const sqlite3_io_methods jsio = {
    1,                            /* iVersion */
    jsClose,                    /* xClose */
    jsRead,                     /* xRead */
    jsWrite,                    /* xWrite */
    jsTruncate,                 /* xTruncate */
    jsSync,                     /* xSync */
    jsFileSize,                 /* xFileSize */
    jsLock,                     /* xLock */
    jsUnlock,                   /* xUnlock */
    jsCheckReservedLock,        /* xCheckReservedLock */
    jsFileControl,              /* xFileControl */
    jsSectorSize,               /* xSectorSize */
    jsDeviceCharacteristics     /* xDeviceCharacteristics */
};


EM_JS(int, jsOpen, (
    sqlite3_vfs *pVfs,              /* VFS */
    const char *zName,              /* File to open, or 0 for a temp file */
    sqlite3_file *pFile,            /* Pointer to JSFile struct to populate */
    int flags,                      /* Input SQLITE_OPEN_XXX flags */
    int *pOutFlags                  /* Output SQLITE_OPEN_XXX flags (or NULL) */
), {
    return Asyncify.handleSleep((wakeUp) => {
        Module.jsOpen(pVfs, zName, pFile, flags, pOutFlags).then(wakeUp);
    });
})

static int jsOpenWrapper(
    sqlite3_vfs *pVfs,              /* VFS */
    const char *zName,              /* File to open, or 0 for a temp file */
    sqlite3_file *pFile,            /* Pointer to JSFile struct to populate */
    int flags,                      /* Input SQLITE_OPEN_XXX flags */
    int *pOutFlags                  /* Output SQLITE_OPEN_XXX flags (or NULL) */
){
    JSFile *p = (JSFile*)pFile; /* Populate this structure */
    p->base.pMethods = &jsio;
    // p->deviceCharacteristics = 420;
    // p->sectorSize = 69;
    return jsOpen(pVfs, zName, pFile, flags, pOutFlags);
}


EM_JS(int, jsDelete, (sqlite3_vfs *pVfs, const char *zPath, int dirSync), {
    return Asyncify.handleSleep((wakeUp) => {
        if(Module.jsDelete){
            Module.jsDelete(pVfs, zPath, dirSync).then(wakeUp);    
        }else{
            wakeUp(0);
        }
    });
})

EM_JS(int, jsAccess, (sqlite3_vfs *pVfs, const char *zPath, int flags, int *pResOut), {
    return Asyncify.handleSleep((wakeUp) => {
        if(Module.jsAccess){
            Module.jsAccess(pVfs, zPath, flags, pResOut).then(wakeUp);    
        }else{
            wakeUp(0);
        }
    });
})

EM_JS(int, jsFullPathname, (sqlite3_vfs *pVfs, const char *zPath, int nPathOut, char *zPathOut), {
    return Asyncify.handleSleep((wakeUp) => {
        if(Module.jsFullPathname){
            Module.jsFullPathname(pVfs, zPath, nPathOut, zPathOut).then(wakeUp);    
        }else{
            Module.stringToUTF8(Module.UTF8ToString(zPath), zPathOut, nPathOut);
            wakeUp(0);
        }
    });
})

static void *jsDlOpen(sqlite3_vfs *pVfs, const char *zPath){
    return 0;
}

static void jsDlError(sqlite3_vfs *pVfs, int nByte, char *zErrMsg){
    sqlite3_snprintf(nByte, zErrMsg, "Loadable extensions are not supported");
    zErrMsg[nByte-1] = '\0';
}

static void (*jsDlSym(sqlite3_vfs *pVfs, void *pH, const char *z))(void){
    return 0;
}

static void jsDlClose(sqlite3_vfs *pVfs, void *pHandle){
    return;
}

EM_JS(int, jsRandomness, (sqlite3_vfs *pVfs, int nByte, char *zByte), {
    return Asyncify.handleSleep((wakeUp) => {
        if(Module.jsRandomness){
            Module.jsRandomness(pVfs, nByte, zByte).then(wakeUp);
        }else if(typeof process === "object" && 
            typeof process.versions === "object" && 
            typeof process.versions.node === "string"
        ){
            const nodeCrypto = require('crypto');
            Module.HEAPU8.set(nodeCrypto.randomBytes(nByte), zByte);
            wakeUp(0);
        }else if(typeof crypto === "object" && 
            typeof crypto.getRandomValues === "function"
        ){
            crypto.getRandomValues(Module.HEAPU8.subarray(zByte, zByte + nByte));
            wakeUp(0);
        }else{
            wakeUp(0);
        }
    });
})


static int jsSleep(sqlite3_vfs *pVfs, int nMicro){
    sleep(nMicro / 1000000);
    usleep(nMicro % 1000000);
    return nMicro;
}

static int jsCurrentTime(sqlite3_vfs *pVfs, double *pTime){
    *pTime = (emscripten_get_now() / 86.4) + 2440587500.0;
    return SQLITE_OK;
}

static sqlite3_vfs jsvfs = {
    1,                          /* iVersion */
    sizeof(JSFile),             /* szOsFile */
    MAXPATHNAME,                /* mxPathname */
    0,                          /* pNext */
    "jsvfs",                    /* zName */
    0,                          /* pAppData */
    jsOpenWrapper,              /* xOpen */
    jsDelete,                   /* xDelete */
    jsAccess,                   /* xAccess */
    jsFullPathname,             /* xFullPathname */
    jsDlOpen,                   /* xDlOpen */
    jsDlError,                  /* xDlError */
    jsDlSym,                    /* xDlSym */
    jsDlClose,                  /* xDlClose */
    jsRandomness,               /* xRandomness */
    jsSleep,                    /* xSleep */
    jsCurrentTime,              /* xCurrentTime */
};

sqlite3_vfs *sqlite3_jsvfs(void){
    return &jsvfs;
}

SQLITE_API int sqlite3_os_init(void){
    sqlite3_vfs_register(sqlite3_jsvfs(), 1);
    return SQLITE_OK;
}

