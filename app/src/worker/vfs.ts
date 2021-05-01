import { RootAPI } from 'ipfs-core-types'
import initializeSQL from '../../../build/os'

importScripts('https://unpkg.com/ipfs@0.54.4/dist/index.min.js')

const MAX_JUMP_BYTES = 64 * 1000
const MAX_READ_AHEAD = 64 * 1000

export const Module = initializeSQL({
    locateFile: path => require('url:../../../build/os.wasm'),
})

let _runtimeInitializationCallbacks
export const runtimeInitialization = new Promise((resolve, reject) => {
    _runtimeInitializationCallbacks = [resolve, reject]
})

export var temp

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

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

var files: { [key: string]: FileHandle } = {}
let startTime = Date.now()

async function readDataBuffer(file: FileHandle, pos: number, result: Uint8Array) {
    if (file.url.startsWith('/ipfs/')) {
        return readDataBufferIPFS(file, pos, result)
    } else {
        return readDataBufferHTTP(file, pos, result)
    }
}

var ipfsNodePromise: ReturnType<typeof Ipfs.create>

type FileHandle = {
    url: string
    size: number
}

type HTTPFileHandle = FileHandle & {
    chunks?: any[]
    reader?: any
    offset?: number
    follow?: number
    hooks?: Function[]
}

async function readDataBufferIPFS(file: FileHandle, pos: number, result: Uint8Array) {
    if (!ipfsNodePromise)
        ipfsNodePromise = Ipfs.create({
            config: {
                Bootstrap: [
                    '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
                    '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
                    '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
                    '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
                    '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
                    '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
                    // '/dns4/node0.preload.ipfs.io/tcp/443/wss/p2p/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
                    // '/dns4/node1.preload.ipfs.io/tcp/443/wss/p2p/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
                    // '/dns4/node2.preload.ipfs.io/tcp/443/wss/p2p/QmV7gnbW5VTcJ3oyM2Xk1rdFBJ3kTkvxc87UFGsun29STS',
                    // '/dns4/node3.preload.ipfs.io/tcp/443/wss/p2p/QmY7JB6MQXhxHvq7dBDh4HpbH29v4yE9JRadAVpndvzySN',
                ],
            },
        })
    const node = await ipfsNodePromise

    const stream = node.cat(file.url, {
        offset: pos,
        length: result.length,
    })

    let index = 0
    for await (const chunk of stream) {
        result.set(chunk, index)
        index += chunk.length
    }
}

async function readDataBufferHTTP(file: HTTPFileHandle, pos: number, result: Uint8Array) {
    // if (amount === 0) return new Uint8Array(0)
    if (result.length === 0) return

    let amount = result.length

    if (!file.chunks) {
        file.chunks = []
        file.reader = null
        file.offset = 0
        file.follow = 0
        file.hooks = []
    }

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
    if (!file.reader || pos < file.offset || pos - file.offset > MAX_JUMP_BYTES) {
        // otherwise we need to cancel the existing reader
        // and start from a new position
        if (file.reader) file.reader.cancel()
        file.offset = pos
        file.follow = pos
        console.log('fetching', file.offset)
        let res

        for (let i = 0; i < 10; i++) {
            res = await fetch(file.url, {
                headers: {
                    // 'content-type': 'application/octet-stream',
                    range: 'bytes=' + file.offset + '-' + (file.size - 1),
                },
            })
            if (res.status === 200 || res.status === 206) break
            console.log(res)
            await delay(2000 + 1000 * Math.pow(2, Math.random() + i))
        }

        file.reader = res.body.getReader()
        const processChunk = ({ done, value }) => {
            if (done) {
                file.reader = null
                return
            }
            if (file.offset - file.follow > MAX_READ_AHEAD) {
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

async function getFileSize(file: FileHandle): Promise<number> {
    if (file.url.startsWith('/ipfs/')) {
        if (!ipfsNodePromise) ipfsNodePromise = Ipfs.create()
        const node = await ipfsNodePromise
        console.log(node)
        const statObj = await node.files.stat(file.url, { size: true })
        return statObj.size
    } else {
        const res = await fetch(file.url, {
            method: 'HEAD',
        })
        if (res.status !== 200) return NaN
        const size = parseInt(res.headers.get('content-length'))
        return size
    }
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
        size: null,
    }

    return 0
}

Module.jsRead = async function (pFile, zBuf, iAmt, iOfst) {
    try {
        await readDataBuffer(files[pFile], iOfst, Module.HEAPU8.subarray(zBuf, zBuf + iAmt))
        return 0
    } catch (err) {
        console.warn(err)
        return Module.SQLITE_IOERR
    }
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
    const size = await getFileSize(file)

    if (isNaN(size)) return Module.SQLITE_CANTOPEN
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
