var vfs = Module

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
        function processChunk({ done, value }) {
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
            while ((fn = file.hooks.shift())) fn()
        }
        file.reader.read().then(processChunk)
    }
    // chunks are on the way so we wait until the next chunk and try again
    await new Promise(resolve => file.hooks.push(resolve))
    await readDataBuffer(file, pos, result)
}

vfs.jsOpen = async function (pVfs, zName, pFile, flags, pOutFlags) {
    const fileName = vfs.UTF8ToString(zName)
    console.log('open', pVfs, fileName, pFile, flags, pOutFlags)
    const baseFile = vfs.getValue(pFile, 'i32')
    const deviceCharacteristicsPtr = pFile + 4
    const sectorSizePtr = pFile + 8
    vfs.setValue(deviceCharacteristicsPtr, vfs.SQLITE_IOCAP_IMMUTABLE, 'i32')
    vfs.setValue(sectorSizePtr, 2048, 'i32')

    console.log('jsDeviceCharacteristics', vfs.getValue(pFile + 4, 'i32'))
    console.log('jsSectorSize', vfs.getValue(pFile + 8, 'i32'))

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

vfs.jsRead = async function (pFile, zBuf, iAmt, iOfst) {
    await readDataBuffer(files[pFile], iOfst, vfs.HEAPU8.subarray(zBuf, zBuf + iAmt))
    return 0
}
vfs.jsAccess = async function (pVfs, zPath, flags, pResOut) {
    console.log('jsAccess', pVfs, vfs.UTF8ToString(zPath), flags, vfs.getValue(pResOut, 'i32'))
    vfs.setValue(pResOut, 0, 'i32')
    return 0
}
vfs.jsFileSize = async function (pFile, pSize) {
    console.log('jsFileSize', pFile, vfs.getValue(pSize, 'i32'))
    const file = files[pFile]
    const res = await fetch(file.url, {
        method: 'HEAD',
    })
    const size = parseInt(res.headers.get('content-length'))
    file.size = size
    vfs.setValue(pSize, size, 'i64')
    // console.log('File Size', url, size)

    return 0
}
vfs.jsClose = async function (pFile) {
    console.log('jsClose', pFile)
    // delete files[pFile]
    return 0
}

var temp
var db

function handle_error(result) {
    if (result !== vfs.SQLITE_OK) {
        console.error(vfs.sqlite3_errmsg(db))
    }
}

async function exec(sql) {
    handle_error(await vfs.sqlite3_prepare_v2(db, sql, -1, temp, 0))
    let res = vfs.getValue(temp, 'i32')
    let col_count = await vfs.sqlite3_column_count(res)
    let col_names = []
    let rows = []
    for (let i = 0; i < col_count; i++) {
        col_names.push(await vfs.sqlite3_column_name(res, i))
    }
    // console.log(col_names)
    while (true) {
        // console.time('step')
        let step = await vfs.sqlite3_step(res)
        // console.timeEnd('step')

        if (step === vfs.SQLITE_ROW) {
            // console.time('row')
            let row = {}
            for (let i = 0; i < col_count; i++) {
                row[col_names[i]] = await vfs.sqlite3_column_text(res, i)
            }
            rows.push(row)

            // if (rows.length > 10) {
            //     vfs.sqlite3_interrupt(db)
            // }
            // console.timeEnd('row')
        } else if (step === vfs.SQLITE_DONE) {
            console.log('done')
            break
        } else {
            console.log('step', step)
            handle_error(step)
            break
        }
    }

    console.table(rows)

    handle_error(await vfs.sqlite3_finalize(res))
}
vfs.onRuntimeInitialized = async function () {
    temp = vfs.stackAlloc(4)

    console.time('start')
    await vfs.sqlite3_initialize()
    var open_result = await vfs.sqlite3_open(':memory:', temp)
    if (open_result !== vfs.SQLITE_OK) console.error(vfs.sqlite3_errmsg(db))
    db = vfs.getValue(temp, 'i32')

    console.log('db', db)

    // await exec(` ATTACH DATABASE 'covid.db' AS covid ;`)
    await exec(
        ` ATTACH DATABASE 'https://datasette.s3.us-west-001.backblazeb2.com/covid.db' AS covid ;`
    )

    await exec(`PRAGMA database_list;`)
    // await exec(
    //     ` SELECT * FROM covid.latimes_agency_totals WHERE county = 'Fresno' ORDER BY date DESC LIMIT 10;`
    // )
    // await exec(` SELECT COUNT(*) FROM covid.latimes_agency_totals WHERE county = 'Fresno';`)
    // await exec(` EXPLAIN SELECT COUNT(*) FROM covid.latimes_agency_totals WHERE county = 'Fresno';`)

    await exec(` SELECT * FROM covid.sqlite_master;`)

    // await exec(`SELECT * FROM covid.economist_excess_deaths order by rowid`)

    // await vfs.sqlite3_close_v2(db)
    console.timeEnd('start')
}
