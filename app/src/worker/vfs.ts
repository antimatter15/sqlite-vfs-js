import initializeSQL from '../../../build/os'

export const Module = initializeSQL({
    locateFile: path => require('url:../../../build/os.wasm'),
})

let _runtimeInitializationCallbacks
export const runtimeInitialization = new Promise((resolve, reject) => {
    _runtimeInitializationCallbacks = [resolve, reject]
})

export var temp

Module.onRuntimeInitialized = async function () {
    const [resolve, reject] = _runtimeInitializationCallbacks
    try {
        temp = Module.stackAlloc(4)
        await Module.sqlite3_initialize()
        resolve(true)
        postMessage({ event: 'RUNTIME_INIT' })
    } catch (err) {
        reject(err)
    }
}

var files = {}
let startTime = Date.now()

async function readDataBuffer(file, pos, result) {
    // if (amount === 0) return new Uint8Array(0)
    if (result.length === 0) return
    let amount = result.length

    if (pos > file.follow && pos < file.offset) file.follow = pos
    // for existing chunks
    for (let chunk of file.chunks) {
        if (chunk.start <= pos && pos < chunk.end) {
            chunk.touched = (Date.now() - startTime) / 1000
            // let result = new Uint8Array(amount)
            let available = Math.min(pos + amount, chunk.start + chunk.data.length)
            let remaining = pos + amount - available
            result.set(chunk.data.subarray(pos - chunk.start, available - chunk.start), 0)
            chunk.read += available - chunk.start

            if (remaining > 0) {
                // chunk.stale = true
                file.chunks.splice(file.chunks.indexOf(chunk), 1)

                await readDataBuffer(file, available, result.subarray(available - pos))
            }
            // console.log('lookup cached', pos, amount)
            return
        }
    }
    if (!file.reader || pos < file.offset || pos - file.offset > 10 * 1000) {
        // otherwise we need to cancel the existing reader
        // and start from a new position
        if (file.reader) file.reader.cancel()
        file.offset = pos
        file.follow = pos
        console.log('fetching', file.offset)
        const res = await fetch(file.url, {
            headers: {
                'content-type': 'application/octet-stream',
                range: 'bytes=' + file.offset + '-' + (file.size - 1),
            },
        })
        file.reader = res.body.getReader()
        const processChunk = ({ done, value }) => {
            if (done) {
                file.reader = null
                return
            }
            if (file.offset - file.follow > 10000) {
                console.log('we are too far ahead, cancelling...')
                file.reader.cancel()
            }
            console.log('got chunk', done, file.offset)
            file.chunks.push({
                start: file.offset,
                end: file.offset + value.length,
                data: value,
                read: 0,
            })
            file.offset += value.length
            file.reader.read().then(processChunk)
            let fn
            while ((fn = file.hooks.shift())) fn()
        }
        file.reader.read().then(processChunk)
    }
    // chunks are on the way so we wait until the next chunk and try again
    await new Promise(resolve => file.hooks.push(resolve))
    await readDataBuffer(file, pos, result)
}

Module.jsOpen = async function (pVfs, zName, pFile, flags, pOutFlags) {
    const fileName = Module.UTF8ToString(zName)
    console.log('open', pVfs, fileName, pFile, flags, pOutFlags)
    const baseFile = Module.getValue(pFile, 'i32')
    const deviceCharacteristicsPtr = pFile + 4
    const sectorSizePtr = pFile + 8
    Module.setValue(deviceCharacteristicsPtr, Module.SQLITE_IOCAP_IMMUTABLE, 'i32')
    Module.setValue(sectorSizePtr, 2048, 'i32')

    console.log('jsDeviceCharacteristics', Module.getValue(pFile + 4, 'i32'))
    console.log('jsSectorSize', Module.getValue(pFile + 8, 'i32'))

    files[pFile] = {
        url: fileName,
        chunks: [],
        reader: null,
        offset: 0,
        follow: 0,
        hooks: [],
    }

    return 0
}

Module.jsRead = async function (pFile, zBuf, iAmt, iOfst) {
    await readDataBuffer(files[pFile], iOfst, Module.HEAPU8.subarray(zBuf, zBuf + iAmt))
    return 0
}
Module.jsAccess = async function (pVfs, zPath, flags, pResOut) {
    console.log(
        'jsAccess',
        pVfs,
        Module.UTF8ToString(zPath),
        flags,
        Module.getValue(pResOut, 'i32')
    )
    Module.setValue(pResOut, 0, 'i32')
    return 0
}
Module.jsFileSize = async function (pFile, pSize) {
    console.log('jsFileSize', pFile, Module.getValue(pSize, 'i32'))
    const file = files[pFile]
    const res = await fetch(file.url, {
        method: 'HEAD',
    })
    if (res.status !== 200) return 1
    const size = parseInt(res.headers.get('content-length'))
    file.size = size
    Module.setValue(pSize, size, 'i64')
    // console.log('File Size', url, size)
    return 0
}
Module.jsClose = async function (pFile) {
    console.log('jsClose', pFile)
    // delete files[pFile]
    return 0
}
