import { Module, temp } from './vfs'

var db

function handle_error(result) {
    if (result !== Module.SQLITE_OK) {
        throw new Error(Module.sqlite3_errmsg(db))
    }
}

export async function open(file = ':memory:') {
    if (db) {
        await Module.sqlite3_close_v2(db)
    }
    var open_result = await Module.sqlite3_open(file, temp)
    db = Module.getValue(temp, 'i32')
    if (open_result !== Module.SQLITE_OK) throw new Error(Module.sqlite3_errmsg(db))
}

export async function exec(sql) {
    if (!db) {
        await open()
    }
    handle_error(await Module.sqlite3_prepare_v2(db, sql, -1, temp, 0))
    let res = Module.getValue(temp, 'i32')
    try {
        let col_count = await Module.sqlite3_column_count(res)
        let col_names = []
        let rows = []
        for (let i = 0; i < col_count; i++) {
            col_names.push(await Module.sqlite3_column_name(res, i))
        }
        // console.log(col_names)
        while (rows.length < 100) {
            // console.time('step')
            let step = await Module.sqlite3_step(res)
            // console.timeEnd('step')

            if (step === Module.SQLITE_ROW) {
                // console.time('row')
                // let row = {}
                let row = []
                for (let i = 0; i < col_count; i++) {
                    // row[col_names[i]] = await Module.sqlite3_column_text(res, i)
                    row.push(await Module.sqlite3_column_text(res, i))
                }
                rows.push(row)

                // if (rows.length > 10) {
                //     Module.sqlite3_interrupt(db)
                // }
                // console.timeEnd('row')
            } else if (step === Module.SQLITE_DONE) {
                console.log('done')
                break
            } else {
                console.log('step', step)
                handle_error(step)
                break
            }
        }

        // console.table(rows)
        // return rows
        return {
            cols: col_names,
            rows: rows,
        }
    } finally {
        handle_error(await Module.sqlite3_finalize(res))
    }
}

export async function abort() {
    console.log('i can haz abort')
    if (db) Module.sqlite3_interrupt(db)

    // console.time('start')

    // var open_result = await Module.sqlite3_open(':memory:', temp)
    // if (open_result !== Module.SQLITE_OK) console.error(Module.sqlite3_errmsg(db))
    // db = Module.getValue(temp, 'i32')

    // console.log('db', db)

    // // await exec(` ATTACH DATABASE 'covid.db' AS covid ;`)
    // // await exec(`DETACH DATABASE covid`)

    // await exec(
    //     ` ATTACH DATABASE 'https://datasette.s3.us-west-001.backblazeb2.com/covid.db' AS covid ;`
    // )

    // await exec(`PRAGMA database_list;`)
    // // await exec(
    // //     ` SELECT * FROM covid.latimes_agency_totals WHERE county = 'Fresno' ORDER BY date DESC LIMIT 10;`
    // // )
    // // await exec(` SELECT COUNT(*) FROM covid.latimes_agency_totals WHERE county = 'Fresno';`)
    // // await exec(` EXPLAIN SELECT COUNT(*) FROM covid.latimes_agency_totals WHERE county = 'Fresno';`)

    // // await exec(` SELECT * FROM covid.sqlite_master;`)

    // // await exec(`PRAGMA covid.index_xinfo('idx_johns_hopkins_csse_daily_reports_province_or_state')`)

    // // await exec(`SELECT DISTINCT country FROM covid.economist_excess_deaths`)

    // // await exec(
    // //     `SELECT * FROM dbstat('covid') WHERE name = 'johns_hopkins_csse_daily_reports' AND pagetype = 'internal';`
    // // )
    // // await exec(`SELECT * FROM covid.economist_excess_deaths order by rowid`)

    // // await Module.sqlite3_close_v2(db)
    // console.timeEnd('start')
    return 42
}
