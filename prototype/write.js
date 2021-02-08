// const vfs = require('./mini')
var vfs = Module

var SQLITE_OK = 0

var SQLITE_NOTFOUND = 12

var SQLITE_ROW = 100
var SQLITE_DONE = 101
var SQLITE_INTEGER = 1
var SQLITE_FLOAT = 2
var SQLITE_TEXT = 3
var SQLITE_BLOB = 4

var SQLITE_IOCAP_ATOMIC = 0x00000001
var SQLITE_IOCAP_ATOMIC512 = 0x00000002
var SQLITE_IOCAP_ATOMIC1K = 0x00000004
var SQLITE_IOCAP_ATOMIC2K = 0x00000008
var SQLITE_IOCAP_ATOMIC4K = 0x00000010
var SQLITE_IOCAP_ATOMIC8K = 0x00000020
var SQLITE_IOCAP_ATOMIC16K = 0x00000040
var SQLITE_IOCAP_ATOMIC32K = 0x00000080
var SQLITE_IOCAP_ATOMIC64K = 0x00000100
var SQLITE_IOCAP_SAFE_APPEND = 0x00000200
var SQLITE_IOCAP_SEQUENTIAL = 0x00000400
var SQLITE_IOCAP_UNDELETABLE_WHEN_OPEN = 0x00000800
var SQLITE_IOCAP_POWERSAFE_OVERWRITE = 0x00001000
var SQLITE_IOCAP_IMMUTABLE = 0x00002000
var SQLITE_IOCAP_BATCH_ATOMIC = 0x00004000

var SQLITE_FCNTL_LOCKSTATE = 1
var SQLITE_FCNTL_GET_LOCKPROXYFILE = 2
var SQLITE_FCNTL_SET_LOCKPROXYFILE = 3
var SQLITE_FCNTL_LAST_ERRNO = 4
var SQLITE_FCNTL_SIZE_HINT = 5
var SQLITE_FCNTL_CHUNK_SIZE = 6
var SQLITE_FCNTL_FILE_POINTER = 7
var SQLITE_FCNTL_SYNC_OMITTED = 8
var SQLITE_FCNTL_WIN32_AV_RETRY = 9
var SQLITE_FCNTL_PERSIST_WAL = 10
var SQLITE_FCNTL_OVERWRITE = 11
var SQLITE_FCNTL_VFSNAME = 12
var SQLITE_FCNTL_POWERSAFE_OVERWRITE = 13
var SQLITE_FCNTL_PRAGMA = 14
var SQLITE_FCNTL_BUSYHANDLER = 15
var SQLITE_FCNTL_TEMPFILENAME = 16
var SQLITE_FCNTL_MMAP_SIZE = 18
var SQLITE_FCNTL_TRACE = 19
var SQLITE_FCNTL_HAS_MOVED = 20
var SQLITE_FCNTL_SYNC = 21
var SQLITE_FCNTL_COMMIT_PHASETWO = 22
var SQLITE_FCNTL_WIN32_SET_HANDLE = 23
var SQLITE_FCNTL_WAL_BLOCK = 24
var SQLITE_FCNTL_ZIPVFS = 25
var SQLITE_FCNTL_RBU = 26
var SQLITE_FCNTL_VFS_POINTER = 27
var SQLITE_FCNTL_JOURNAL_POINTER = 28
var SQLITE_FCNTL_WIN32_GET_HANDLE = 29
var SQLITE_FCNTL_PDB = 30
var SQLITE_FCNTL_BEGIN_ATOMIC_WRITE = 31
var SQLITE_FCNTL_COMMIT_ATOMIC_WRITE = 32
var SQLITE_FCNTL_ROLLBACK_ATOMIC_WRITE = 33
var SQLITE_FCNTL_LOCK_TIMEOUT = 34
var SQLITE_FCNTL_DATA_VERSION = 35
var SQLITE_FCNTL_SIZE_LIMIT = 36
var SQLITE_FCNTL_CKPT_DONE = 37
var SQLITE_FCNTL_RESERVE_BYTES = 38
var SQLITE_FCNTL_CKPT_START = 39

var SQLITE_OPEN_READONLY = 0x00000001 /* Ok for sqlite3_open_v2() */
var SQLITE_OPEN_READWRITE = 0x00000002 /* Ok for sqlite3_open_v2() */
var SQLITE_OPEN_CREATE = 0x00000004 /* Ok for sqlite3_open_v2() */
var SQLITE_OPEN_DELETEONCLOSE = 0x00000008 /* VFS only */
var SQLITE_OPEN_EXCLUSIVE = 0x00000010 /* VFS only */
var SQLITE_OPEN_AUTOPROXY = 0x00000020 /* VFS only */
var SQLITE_OPEN_URI = 0x00000040 /* Ok for sqlite3_open_v2() */
var SQLITE_OPEN_MEMORY = 0x00000080 /* Ok for sqlite3_open_v2() */
var SQLITE_OPEN_MAIN_DB = 0x00000100 /* VFS only */
var SQLITE_OPEN_TEMP_DB = 0x00000200 /* VFS only */
var SQLITE_OPEN_TRANSIENT_DB = 0x00000400 /* VFS only */
var SQLITE_OPEN_MAIN_JOURNAL = 0x00000800 /* VFS only */
var SQLITE_OPEN_TEMP_JOURNAL = 0x00001000 /* VFS only */
var SQLITE_OPEN_SUBJOURNAL = 0x00002000 /* VFS only */
var SQLITE_OPEN_SUPER_JOURNAL = 0x00004000 /* VFS only */
var SQLITE_OPEN_NOMUTEX = 0x00008000 /* Ok for sqlite3_open_v2() */
var SQLITE_OPEN_FULLMUTEX = 0x00010000 /* Ok for sqlite3_open_v2() */
var SQLITE_OPEN_SHAREDCACHE = 0x00020000 /* Ok for sqlite3_open_v2() */
var SQLITE_OPEN_PRIVATECACHE = 0x00040000 /* Ok for sqlite3_open_v2() */
var SQLITE_OPEN_WAL = 0x00080000 /* VFS only */
var SQLITE_OPEN_NOFOLLOW = 0x01000000 /* Ok for sqlite3_open_v2() */

var sqlite3_initialize = vfs.cwrap('sqlite3_initialize', 'number', [])
var sqlite3_open = vfs.cwrap('sqlite3_open', 'number', ['string', 'number'], { async: true })
var sqlite3_close_v2 = vfs.cwrap('sqlite3_close_v2', 'number', ['number'], { async: true })
var sqlite3_exec = vfs.cwrap('sqlite3_exec', 'number', [
    'number',
    'string',
    'number',
    'number',
    'number',
])
var sqlite3_finalize = vfs.cwrap('sqlite3_finalize', 'number', ['number'], { async: true })
var sqlite3_prepare_v2 = vfs.cwrap(
    'sqlite3_prepare_v2',
    'number',
    ['number', 'string', 'number', 'number', 'number'],
    { async: true }
)
var sqlite3_errmsg = vfs.cwrap('sqlite3_errmsg', 'string', ['number'])
var sqlite3_step = vfs.cwrap('sqlite3_step', 'number', ['number'], { async: true })

var sqlite3_column_count = vfs.cwrap('sqlite3_column_count', 'number', ['number'], { async: true })
var sqlite3_data_count = vfs.cwrap('sqlite3_data_count', 'number', ['number'], { async: true })
var sqlite3_column_double = vfs.cwrap('sqlite3_column_double', 'number', ['number', 'number'], {
    async: true,
})
var sqlite3_column_text = vfs.cwrap('sqlite3_column_text', 'string', ['number', 'number'], {
    async: true,
})
var sqlite3_column_blob = vfs.cwrap('sqlite3_column_blob', 'number', ['number', 'number'], {
    async: true,
})
var sqlite3_column_bytes = vfs.cwrap('sqlite3_column_bytes', 'number', ['number', 'number'], {
    async: true,
})
var sqlite3_column_type = vfs.cwrap('sqlite3_column_type', 'number', ['number', 'number'], {
    async: true,
})
var sqlite3_column_name = vfs.cwrap('sqlite3_column_name', 'string', ['number', 'number'], {
    async: true,
})
// console.log(vfs)

var files = {}
var tx_batch = null
var tx_time = null
let PAGE_SIZE = 4096

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

vfs.demoFullPathname = async function (pVfs, zPath, nPathOut, zPathOut) {
    console.log('fullPathname', pVfs, vfs.UTF8ToString(zPath), nPathOut, zPathOut)
    vfs.stringToUTF8(vfs.UTF8ToString(zPath), zPathOut, nPathOut)
    return SQLITE_OK
}
vfs.demoOpen = async function (pVfs, zName, pFile, flags, pOutFlags) {
    console.log('open', pVfs, vfs.UTF8ToString(zName), pFile, flags, pOutFlags)

    files[pFile] = {
        name: vfs.UTF8ToString(zName) || '[temp]',
        temp: (SQLITE_OPEN_TEMP_DB | SQLITE_OPEN_TRANSIENT_DB | SQLITE_OPEN_TEMP_JOURNAL) & flags,
    }

    const baseFile = vfs.getValue(pFile, 'i32')
    const deviceCharacteristicsPtr = pFile + 4
    const sectorSizePtr = pFile + 8
    // vfs.setValue(
    //     deviceCharacteristicsPtr,
    //     SQLITE_IOCAP_ATOMIC | SQLITE_IOCAP_ATOMIC4K | SQLITE_IOCAP_BATCH_ATOMIC,
    //     'i32'
    // )
    vfs.setValue(deviceCharacteristicsPtr, 0, 'i32')
    // vfs.setValue(deviceCharacteristicsPtr, SQLITE_IOCAP_ATOMIC4K | SQLITE_IOCAP_BATCH_ATOMIC, 'i32')
    vfs.setValue(sectorSizePtr, 4096, 'i32')

    console.log('demoDeviceCharacteristics', vfs.getValue(pFile + 4, 'i32'))
    console.log('demoSectorSize', vfs.getValue(pFile + 8, 'i32'))
    return 0
}
vfs.demoRead = async function (pFile, zBuf, iAmt, iOfst) {
    let fileName = files[pFile].name

    const store = idb.transaction(['blocks'], 'readonly').objectStore('blocks')

    console.log('demoRead', fileName, iOfst, iAmt)

    if (iAmt + (iOfst % PAGE_SIZE) > PAGE_SIZE) {
        console.warn('READ BEYOND PAGE')
    }
    // const res = new Uint8Array(iAmt)
    // let buf = res
    // while (iAmt > 0) {
    //     const page = Math.floor(iOfst / PAGE_SIZE)
    //     const nextOffset = PAGE_SIZE * (page + 1)
    //     // read this page
    //     const req = store.openCursor(
    //         IDBKeyRange.bound([fileName, page, 0], [fileName, page, Infinity])
    //     )
    //     await new Promise((resolve, reject) => {
    //         req.onerror = reject
    //         req.onsuccess = resolve
    //     })

    //     if (req.result) {
    //         buf.set(
    //             req.result.value.data.subarray(
    //                 iOfst % PAGE_SIZE,
    //                 Math.min(PAGE_SIZE - (iOfst % PAGE_SIZE), (iOfst % PAGE_SIZE) + iAmt)
    //             )
    //         )
    //     }
    //     buf = res.subarray(nextOffset - iOfst)
    //     iAmt -= nextOffset - iOfst
    //     iOfst = nextOffset
    // }

    // Module.HEAPU8.set(res, zBuf)

    // read page floor(iOfst / PAGE_SIZE)
    // slice according to (iOfst % PAGE_SIZE)
    // read up to PAGE_SIZE - (iOfst % PAGE_SIZE)

    // let amountRead = 0;
    // while(amountRead < iAmt){
    //     const page = Math.floor((iOfst + amountRead) / PAGE_SIZE)
    //     const req = store.openCursor(
    //         IDBKeyRange.bound([fileName, page, 0], [fileName, page, Infinity])
    //     )
    //     await new Promise((resolve, reject) => {
    //         req.onerror = reject
    //         req.onsuccess = resolve
    //     })
    //     if(req.result){

    //     }
    //     amountRead
    // }

    // while (iAmt > 0) {
    //     const page = Math.floor(iOfst / PAGE_SIZE)
    //     const req = store.openCursor(
    //         IDBKeyRange.bound([fileName, page, 0], [fileName, page, Infinity])
    //     )
    //     await new Promise((resolve, reject) => {
    //         req.onerror = reject
    //         req.onsuccess = resolve
    //     })

    //     if (req.result) {
    //     }
    // }

    const page = Math.floor(iOfst / PAGE_SIZE)
    const req = store.openCursor(IDBKeyRange.bound([fileName, page, 0], [fileName, page, Infinity]))
    await new Promise((resolve, reject) => {
        req.onerror = reject
        req.onsuccess = resolve
    })

    if (req.result) {
        var res = req.result.value.data.subarray(
            iOfst - PAGE_SIZE * page,
            iOfst - PAGE_SIZE * page + iAmt
        )
    } else {
        var res = new Uint8Array(iAmt)
    }
    // console.log(res)
    Module.HEAPU8.set(res, zBuf)

    return 0
}
vfs.demoFileControl = async function (pFile, op, pArg) {
    if (op === SQLITE_FCNTL_BUSYHANDLER) {
        console.log('SQLITE_FCNTL_BUSYHANDLER')
    } else if (op === SQLITE_FCNTL_PDB) {
        console.log('SQLITE_FCNTL_PDB')
    } else if (op === SQLITE_FCNTL_BEGIN_ATOMIC_WRITE) {
        console.log('SQLITE_FCNTL_BEGIN_ATOMIC_WRITE')
        tx_batch = []
        tx_time = Date.now()
    } else if (op === SQLITE_FCNTL_COMMIT_ATOMIC_WRITE) {
        console.log('SQLITE_FCNTL_COMMIT_ATOMIC_WRITE')
        console.log(tx_batch)
        var tx = idb.transaction(['blocks'], 'readwrite')
        var store = tx.objectStore('blocks')
        for (let key of tx_batch) {
            var req = store.delete(
                IDBKeyRange.bound([key[0], key[1], 0], [key[0], key[1], key[2]], false, true)
            )
            await new Promise(resolve => (req.onsuccess = resolve))
            var req = store.delete(
                IDBKeyRange.bound([key[0], key[1], key[2]], [key[0], key[1], Infinity], true, false)
            )
            await new Promise(resolve => (req.onsuccess = resolve))
        }
        tx_batch = null
    } else if (op === SQLITE_FCNTL_ROLLBACK_ATOMIC_WRITE) {
        console.log('SQLITE_FCNTL_ROLLBACK_ATOMIC_WRITE')
        // tx_batch = []
    } else if (op === SQLITE_FCNTL_SIZE_HINT) {
        console.log('SQLITE_FCNTL_SIZE_HINT')
    } else if (op === SQLITE_FCNTL_SYNC) {
        console.log('SQLITE_FCNTL_SYNC')
    } else if (op === SQLITE_FCNTL_COMMIT_PHASETWO) {
        console.log('SQLITE_FCNTL_COMMIT_PHASETWO')
    } else if (op === SQLITE_FCNTL_PRAGMA) {
        console.log('SQLITE_FCNTL_PRAGMA', vfs.getValue(pArg, '*'))
        return SQLITE_NOTFOUND
    } else if (op === SQLITE_FCNTL_MMAP_SIZE) {
        console.log('SQLITE_FCNTL_MMAP_SIZE')
    } else {
        console.log('demoFileControl', pFile, op, pArg)
    }

    return 0
}
vfs.demoLock = async function (pFile, eLock) {
    console.log('demoLock', pFile, eLock)
    return 0
}
vfs.demoUnlock = async function (pFile, eLock) {
    console.log('demoUnlock', pFile, eLock)
    return 0
}
vfs.demoAccess = async function (pVfs, zPath, flags, pResOut) {
    var store = idb.transaction(['blocks'], 'readonly').objectStore('blocks')
    var fileName = vfs.UTF8ToString(zPath)
    var req = store.openCursor(IDBKeyRange.bound([fileName, -Infinity], [fileName, []]), 'prev')
    await new Promise(resolve => (req.onsuccess = resolve))

    vfs.setValue(pResOut, req.result ? 1 : 0, 'i32')

    console.log('demoAccess', pVfs, vfs.UTF8ToString(zPath), flags, vfs.getValue(pResOut, 'i32'))

    return 0
}
vfs.demoCheckReservedLock = async function (pFile, pResOut) {
    console.log('demoCheckReservedLock', pFile, vfs.getValue(pResOut, 'i32'))
    return 0
}
vfs.demoRandomness = async function (pVfs, nByte, zByte) {
    console.log('demoRandomness', pVfs, nByte, zByte)
    if (typeof process === 'object') {
        const crypto = require('crypto')
        vfs.HEAPU8.set(crypto.randomBytes(nByte), zByte)
    } else {
        crypto.getRandomValues(vfs.HEAPU8.subarray(zByte, zByte + nByte))
    }
    return 0
}
vfs.demoFileSize = async function (pFile, pSize) {
    var store = idb.transaction(['blocks'], 'readonly').objectStore('blocks')
    var fileName = files[pFile].name
    var req = store.openCursor(IDBKeyRange.bound([fileName, -Infinity], [fileName, []]), 'prev')

    await new Promise(resolve => (req.onsuccess = resolve))

    if (req.result) {
        var size = PAGE_SIZE * req.result.key[1] + req.result.value.data.length
    } else {
        var size = 0
    }
    console.log('demoFileSize', fileName, size)
    vfs.setValue(pSize, size, 'i64')
    return 0
}
vfs.demoDelete = async function (pVfs, zPath, dirSync) {
    const fileName = vfs.UTF8ToString(zPath)
    console.log('demoDelete', pVfs, fileName, dirSync)

    // await vfs.demoTruncate(pFile, 0)
    var tx = idb.transaction(['blocks'], 'readwrite')
    var store = tx.objectStore('blocks')
    var req = store.delete(IDBKeyRange.bound([fileName, -Infinity], [fileName, []]))
    await new Promise((resolve, reject) => {
        req.onerror = reject
        req.onsuccess = resolve
    })
    return 0
}

async function writeFile(store, data, fileName, iOfst) {
    // If we're replacing a single page entirely, we can just replace the page with "put"
    // If we are too short, we need to read the block first
    // If we don't start at the page beginning, we need to read the block first
    // If we are too long we need to write multiple blocks

    let page = Math.floor(iOfst / PAGE_SIZE)
    var buffer = new Uint8Array(PAGE_SIZE)
    // buffer.set(Module.HEAPU8.subarray(zBuf, zBuf + iAmt))

    if (iOfst % PAGE_SIZE != 0 || data.length < PAGE_SIZE) {
        // if (iOfst % PAGE_SIZE != 0) console.warn('UNALIGNED WRITE', iOfst)
        // if (data.length < PAGE_SIZE) console.warn('PARTIAL WRITE')

        // read existing page if exists
        const req = store.openCursor(
            IDBKeyRange.bound([fileName, page, 0], [fileName, page, Infinity])
        )
        await new Promise((resolve, reject) => {
            req.onerror = reject
            req.onsuccess = resolve
        })
        if (req.result) {
            buffer.set(req.result.value.data)
            // console.warn('EXISTING PAGE READ')
        } else {
            // console.warn('EXISTING PAGE BLANK')
        }
    }

    buffer.set(
        data.subarray(0, Math.min(PAGE_SIZE - (iOfst % PAGE_SIZE), data.length)),
        iOfst % PAGE_SIZE
    )

    // write out first PAGE_SIZE
    const req = store.put({
        file: fileName,
        page: page,
        time: tx_time || 0,
        data: buffer,
    })
    if (tx_batch) {
        tx_batch.push([fileName, page, tx_time])
    }

    await new Promise((resolve, reject) => {
        req.onerror = reject
        req.onsuccess = resolve
    })

    // write out remaining pages if needed
    if (PAGE_SIZE - (iOfst % PAGE_SIZE) < data.length) {
        console.warn(
            'INCOMPLETE WRITE',
            data.length - (PAGE_SIZE - (iOfst % PAGE_SIZE)),
            'REMAINING'
        )
        await writeFile(
            store,
            data.subarray(Math.min(PAGE_SIZE - (iOfst % PAGE_SIZE), data.length)),
            fileName,
            iOfst + Math.min(PAGE_SIZE - (iOfst % PAGE_SIZE), data.length)
        )
    }
}

// vfs.demoWrite = async function (pFile, zBuf, iAmt, iOfst) {
//     let fileName = files[pFile].name
//     console.log('demoWrite', fileName, iOfst, iAmt)
//     var tx = idb.transaction(['blocks'], 'readwrite', { durability: 'relaxed' })
//     var store = tx.objectStore('blocks')

//     let PAGE_SIZE = 4096
//     let page = Math.floor(iOfst / PAGE_SIZE)
//     let pageStart = page * PAGE_SIZE

//     let data = Module.HEAPU8.subarray(zBuf, zBuf + iAmt)

//     if (iOfst % PAGE_SIZE !== 0 || iOfst + iAmt < pageStart + PAGE_SIZE !== 0) {
//         var buffer = new Uint8Array(PAGE_SIZE)
//         buffer.set(data)
//     }
// }

vfs.demoWrite = async function (pFile, zBuf, iAmt, iOfst) {
    let fileName = files[pFile].name
    console.log('demoWrite', fileName, iOfst, iAmt)
    var tx = idb.transaction(['blocks'], 'readwrite', { durability: 'relaxed' })
    var store = tx.objectStore('blocks')

    var data = Module.HEAPU8.subarray(zBuf, zBuf + iAmt)

    // console.log('writing', data)
    await writeFile(store, data, fileName, iOfst)

    await delay(100)

    // let page = (Math.floor(iOfst / 4096) * 4096) / 512
    // if (iOfst % 4096 === 0) {
    //     var buffer = new Uint8Array(iAmt)
    //     buffer.set(Module.HEAPU8.subarray(zBuf, zBuf + iAmt))
    // } else {
    //     console.warn('doin the funky unaligned write')
    //     const req = store.openCursor(
    //         IDBKeyRange.bound([fileName, page, 0], [fileName, page, Infinity])
    //     )
    //     await new Promise((resolve, reject) => {
    //         req.onerror = reject
    //         req.onsuccess = resolve
    //     })

    //     var buffer = new Uint8Array(4096)
    //     if (req.result) {
    //         buffer.set(req.result.value.data)
    //     }
    //     buffer.set(Module.HEAPU8.subarray(zBuf, Math.min(iOfst + 4096, zBuf + iAmt)), iOfst % 4096)

    //     if (zBuf + iAmt > iOfst + 4096) {
    //         // do stuff...
    //     }
    // }

    // // let time = Date.now()
    // const req = store.put({
    //     file: fileName,
    //     page: page,
    //     time: tx_time || 0,
    //     data: buffer,
    // })
    // if (tx_batch) {
    //     tx_batch.push([fileName, page, tx_time])
    // }

    // await new Promise((resolve, reject) => {
    //     req.onerror = reject
    //     req.onsuccess = resolve
    // })

    // if (iOfst % 4096 !== 0) {
    //     // read-and-write
    //     // alert('RED FLAG HERE WREJOWIFJSDJ')
    //     // debugger
    //     console.error('demoWrite UNKNOWN WEIRD THING', iOfst % 512)
    // }
    // if (iAmt !== 4096) {
    //     console.warn('demoWrite UNKNOWN WEIRD THING', iOfst % 512)
    // }

    // await vfs.demoWrite(pFile, z)
    // var req = store.put({ i: iOfst, d: Module.HEAPU8.subarray(zBuf, zBuf + iAmt) })  ;

    return 0
}
vfs.demoTruncate = async function (pFile, size) {
    console.log('demoTruncate', pFile, size)
    let page = Math.ceil(size / PAGE_SIZE)
    var tx = idb.transaction(['blocks'], 'readwrite')
    var store = tx.objectStore('blocks')
    var fileName = files[pFile].name
    var req = store.delete(IDBKeyRange.bound([fileName, page], [fileName, []]))
    await new Promise((resolve, reject) => {
        req.onerror = reject
        req.onsuccess = resolve
    })
    if (size % PAGE_SIZE !== 0) {
        console.warn('truncate to non-page aligned amount')
    }
    return 1
}
vfs.demoSync = async function (pFile, flags) {
    console.log('demoSync', pFile, flags)
    return 0
}
vfs.demoClose = async function (pFile) {
    console.log('demoClose', pFile)
    if (files[pFile].temp) {
        console.log('Deleting temporary file...')
        // await vfs.demoTruncate(pFile, 0)
        var tx = idb.transaction(['blocks'], 'readwrite')
        var store = tx.objectStore('blocks')
        var fileName = files[pFile].name
        var req = store.delete(IDBKeyRange.bound([fileName, -Infinity], [fileName, []]))
        await new Promise((resolve, reject) => {
            req.onerror = reject
            req.onsuccess = resolve
        })
    }
    delete files[pFile]

    return 0
}

vfs.onRuntimeInitialized = function () {
    var request = indexedDB.open('sqlite', 1)
    request.onupgradeneeded = function (event) {
        var db = event.target.result
        // if (event.oldVersion < 1) {
        //     var objStore = db.createObjectStore('data', { keyPath: 'i' })
        // }
        if (event.oldVersion < 1) {
            var objStore = db.createObjectStore('blocks', { keyPath: ['file', 'page', 'time'] })
        }
    }
    request.onsuccess = function (event) {
        var db = event.target.result
        console.log('IDB Initialized', db)
        window.idb = db
        main()
    }
}

async function main() {
    var temp = vfs.stackAlloc(4)
    var db

    sqlite3_initialize()
    var open_result = await sqlite3_open('yolo', temp)
    var db = vfs.getValue(temp, 'i32')
    if (open_result !== SQLITE_OK) console.error(sqlite3_errmsg(db))
    console.log('db', db)

    function handle_error(result) {
        if (result !== SQLITE_OK) {
            console.error(sqlite3_errmsg(db))
        }
    }

    async function exec(sql) {
        handle_error(await sqlite3_prepare_v2(db, sql, -1, temp, 0))
        let res = vfs.getValue(temp, 'i32')
        while (true) {
            // console.time('step')
            let step = await sqlite3_step(res)
            // console.timeEnd('step')

            if (step === SQLITE_ROW) {
                // console.time('row')
                console.log(
                    'row1',
                    await sqlite3_column_text(res, 0),
                    await sqlite3_column_text(res, 1),
                    await sqlite3_column_text(res, 2),
                    await sqlite3_column_text(res, 3),
                    await sqlite3_column_text(res, 4),
                    await sqlite3_column_text(res, 5),
                    await sqlite3_column_text(res, 6)
                )
                // console.timeEnd('row')
            } else if (step === SQLITE_DONE) {
                console.log('done', step)
                break
            } else {
                console.log('step', step)
                handle_error(step)
                break
            }
        }

        handle_error(await sqlite3_finalize(res))
    }

    // var tx = idb.transaction(['blocks'], 'readwrite', { durability: 'relaxed' })
    // var store = tx.objectStore('blocks')

    // let data = new Uint8Array(5000)
    // for (let i = 0; i < data.length; i++) {
    //     data[i] = 9 //i % 256
    // }
    // await writeFile(store, data, 'demo', 20)

    // await exec(`PRAGMA page_size=4096`)
    // // handle_error(await sqlite3_prepare_v2(db, `SELECT sqlite_version();`, -1, temp, 0))
    // // handle_error(await sqlite3_prepare_v2(db, `CREATE TABLE wumbo(id integer);`, -1, temp, 0))
    // // handle_error(await sqlite3_prepare_v2(db, `INSERT INTO wumbo(id) VALUES (234);`, -1, temp, 0))
    // // handle_error(await sqlite3_prepare_v2(db, `SELECT * FROM wumbo;`, -1, temp, 0))
    await exec(`CREATE TABLE IF NOT EXISTS yolo(id integer);`)
    await exec(`CREATE TABLE IF NOT EXISTS wumbo(id integer);`)
    // await exec(`INSERT INTO wumbo(id) VALUES (random());`)
    // await exec(`PRAGMA temp_store = 2`)
    await exec(`pragma page_size;`)
    await exec(`DROP INDEX hello_thing ;`)
    await exec(`CREATE INDEX IF NOT EXISTS hello_thing ON wumbo (id);`)
    await exec(`BEGIN TRANSACTION;`)
    for (let i = 0; i < 15; i++) {
        await exec(
            `INSERT INTO wumbo (id) SELECT random() FROM (SELECT * FROM ( (SELECT 0 UNION ALL SELECT 1) t2, (SELECT 0 UNION ALL SELECT 1) t4, (SELECT 0 UNION ALL SELECT 1) t8, (SELECT 0 UNION ALL SELECT 1) t16, (SELECT 0 UNION ALL SELECT 1) t32, (SELECT 0 UNION ALL SELECT 1) t64, (SELECT 0 UNION ALL SELECT 1) t128, (SELECT 0 UNION ALL SELECT 1) t256, (SELECT 0 UNION ALL SELECT 1) t512  ));`
        )

        // await new Promise(resolve => setTimeout(resolve, 200))
    }
    await exec(`COMMIT;`)

    // await exec(`SELECT * FROM wumbo ORDER BY id LIMIT 10 `)
    // console.log('done')
    console.log('finalized')
}
