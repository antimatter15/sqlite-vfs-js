import React from 'react'
import ReactDOM from 'react-dom'
import CodeMirror from 'codemirror'
import NProgress from 'nprogress'
import 'normalize.css/normalize.css'
import 'codemirror/mode/sql/sql'
import 'codemirror/addon/comment/comment'
import 'codemirror/lib/codemirror.css'
import 'nprogress/nprogress.css'
import './styles.less'
import { abort } from 'process'

// const defaultDbUrl = '/ipfs/QmTJnRuyqzZDCNTu5GDgRuD17jsTpnZsFAxHJ4N7LDQtYR'
const defaultDbUrl = 'https://datasette.s3.us-west-001.backblazeb2.com/covid.db'

const worker = new Worker(new URL('./worker/index', import.meta.url))

function makeRPC(client: (path: string[], args: any[]) => any) {
    const makeLayer = path =>
        new Proxy((...args) => client(path, args), {
            get: (obj, name) => makeLayer([...path, name]),
        })
    return makeLayer([])
}

let messageHandlers = []
const SQL: typeof import('./worker/api') = makeRPC(
    (path, args) =>
        new Promise((resolve, reject) => {
            let id = messageHandlers.length
            messageHandlers[id] = [resolve, reject]
            worker.postMessage({
                method: path[0],
                params: args,
                id: id,
            })
        })
)

worker.onmessage = e => {
    const msg = e.data
    if ('id' in msg) {
        const [resolve, reject] = messageHandlers[msg.id]
        delete messageHandlers[msg.id]
        if (msg.error) {
            reject(msg.error)
        } else {
            resolve(msg.result)
        }
    } else {
        // if (msg.event === 'RUNTIME_INIT') {
        //     NProgress.done()
        // }
        console.log(msg)
    }
}

console.log(worker)

window['SQL'] = SQL

function Link({ children, query }) {
    const url = new URL(location.href)
    const originalQuery = url.searchParams.get('query')
    url.searchParams.set('query', query)
    return (
        <a href={url.toString()} className={originalQuery === query ? 'active' : ''}>
            {children}
        </a>
    )
}

const DEFAULT_QUERY = `SELECT * FROM sqlite_master where type = 'table'\n\n-- Ctrl-Enter to Run. \n-- Ctrl-. to interrupt query`

function App() {
    const [error, setError] = React.useState(null)
    const [result, setResult] = React.useState(null)
    const [schema, setSchema] = React.useState(null)

    const ref = React.useRef<HTMLDivElement>()

    const url = new URL(location.href)
    const dbUrl = url.searchParams.get('db') || defaultDbUrl

    React.useEffect(() => {
        const run = () => {
            NProgress.start()
            const query = cm.getValue()
            console.log('>>>', query)
            SQL.exec(query).then(
                result => {
                    NProgress.done()

                    const newUrl =
                        '?db=' + encodeURIComponent(dbUrl) + '&query=' + encodeURIComponent(query)
                    if (!location.search || location.search === newUrl) {
                        history.replaceState(result, '', newUrl)
                    } else {
                        history.pushState(result, '', newUrl)
                    }
                    setResult(result)
                    setError(null)
                },
                err => {
                    console.error(err)
                    NProgress.done()
                    setError(err.toString())
                }
            )
            // console.log(cm)
        }
        const abort = () => {
            // NProgress.done()
            console.log('abork')
            SQL.abort()
        }
        const startup = async () => {
            await SQL.open(dbUrl)
            const schema = await SQL.exec(`
                SELECT DISTINCT m.name as tbl, ii.name AS col
                FROM sqlite_master AS m,
                       pragma_index_list(m.name) AS il,
                       pragma_index_info(il.name) AS ii
                WHERE m.type = 'table'
            `)
            console.log(schema)
            setSchema(schema)
            run()
        }

        const cm = CodeMirror(ref.current, {
            mode: 'text/x-sql',
            lineNumbers: true,
            lineWrapping: true,
            extraKeys: {
                'Ctrl-Enter': run,
                'Cmd-Enter': run,
                'Shift-Enter': run,
                'Cmd-.': abort,
                'Ctrl-.': abort,
                'Cmd-/': editor => editor.execCommand('toggleComment'),
                'Ctrl-/': editor => editor.execCommand('toggleComment'),
            },
        })
        ref.current['cm'] = cm
        ref.current['run'] = run

        const restoreState = () => {
            const url = new URL(location.href)
            const query = url.searchParams.get('query')
            if (history.state) setResult(history.state)
            if (query) cm.setValue(query)
        }

        if (!url.searchParams.get('query')) {
            cm.setValue(DEFAULT_QUERY)
        }
        NProgress.start()
        startup().catch(err => {
            console.error(err)
            NProgress.done()
            setError(err.toString())
        })

        restoreState()

        const handler = e => {
            restoreState()
        }
        window.addEventListener('popstate', handler)

        const linkHandler = e => {
            if (
                e.target.tagName === 'A' &&
                !e.metaKey &&
                !e.ctrlKey &&
                !e.shiftKey &&
                e.button === 0
            ) {
                e.preventDefault()
                const url = new URL(e.target.href)
                cm.setValue(url.searchParams.get('query'))
                run()
            }
        }
        document.addEventListener('click', linkHandler)
        return () => {
            window.removeEventListener('popstate', handler)
            document.removeEventListener('click', linkHandler)
        }
    }, [])

    const tableName =
        schema &&
        result &&
        result.query &&
        schema.rows.map(([t]) => t).find(t => result.query.includes(`"${t}"`))
    return (
        <div className="main">
            <div className="header">
                <h1>
                    <Link query={DEFAULT_QUERY}>JS SQLite VFS</Link>
                </h1>
            </div>
            <div ref={ref} />
            {error && <div className="error">{error}</div>}
            <div className="output">
                {result && (
                    <table>
                        <tbody>
                            <tr>
                                {result.cols.map((col, i) => (
                                    <th key={i}>
                                        <div className="column">
                                            <div className="name">{col}</div>
                                            <div className="actions">
                                                {schema &&
                                                    result &&
                                                    result.query &&
                                                    schema.rows.some(
                                                        ([t, c]) =>
                                                            c === col &&
                                                            result.query.includes(`"${t}"`)
                                                    ) && (
                                                        <>
                                                            <Link
                                                                query={`SELECT * FROM "${tableName}" ORDER BY "${col}" ASC`}
                                                            >
                                                                ▲
                                                            </Link>
                                                            <Link
                                                                query={`SELECT * FROM "${tableName}" ORDER BY "${col}" DESC`}
                                                            >
                                                                ▼
                                                            </Link>
                                                            <Link
                                                                query={`SELECT DISTINCT "${col}" FROM "${tableName}"`}
                                                            >
                                                                ☰
                                                            </Link>
                                                        </>
                                                    )}
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                            {result.rows.map((row, i) => (
                                <tr key={i}>
                                    {result.cols.map((col, j) => (
                                        <td key={j}>
                                            {col === 'tbl_name' ? (
                                                <Link query={'SELECT * FROM "' + row[j] + '"'}>
                                                    {row[j]}
                                                </Link>
                                            ) : (
                                                row[j]
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

NProgress.start()
ReactDOM.render(<App />, document.getElementById('root'))
