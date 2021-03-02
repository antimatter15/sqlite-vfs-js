import React from 'react'
import ReactDOM from 'react-dom'
import CodeMirror from 'codemirror'
import NProgress from 'nprogress'
import 'normalize.css/normalize.css'
import 'codemirror/mode/sql/sql'
import 'codemirror/lib/codemirror.css'
import 'nprogress/nprogress.css'
import './styles.less'
import { abort } from 'process'

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
        if (msg.event === 'RUNTIME_INIT') {
            NProgress.done()
        }
        console.log(msg)
    }
}

console.log(worker)

window['SQL'] = SQL

function App() {
    const [error, setError] = React.useState(null)
    const [result, setResult] = React.useState(null)

    const ref = React.useRef<HTMLDivElement>()

    const url = new URL(location.href)
    const dbUrl =
        url.searchParams.get('db') || 'https://datasette.s3.us-west-001.backblazeb2.com/covid.db'

    React.useEffect(() => {
        const run = () => {
            NProgress.start()
            const query = cm.getValue()
            console.log('>>>', query)
            SQL.exec(query).then(
                result => {
                    NProgress.done()
                    setResult(result)
                    setError(null)
                    const newUrl =
                        '?db=' + encodeURIComponent(dbUrl) + '&query=' + encodeURIComponent(query)
                    if (!location.search) {
                        history.replaceState(result, '', newUrl)
                    } else if (location.search !== newUrl) {
                        history.pushState(result, '', newUrl)
                    }
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
            },
        })

        const restoreState = () => {
            const url = new URL(location.href)
            const query = url.searchParams.get('query')
            if (history.state) setResult(history.state)
            if (query) cm.setValue(query)
        }

        if (!url.searchParams.get('query')) {
            cm.setValue(
                'SELECT * FROM sqlite_master\n\n-- Ctrl-Enter to Run. \n-- Ctrl-. to interrupt query'
            )
        }
        NProgress.start()
        SQL.open(dbUrl).then(
            () => {
                // NProgress.done()
                run()
            },
            err => {
                console.error(err)
                NProgress.done()
                setError(err.toString())
            }
        )

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

    return (
        <div className="main">
            <div ref={ref} />
            {error && <div className="error">{error}</div>}
            <div className="output">
                {result && (
                    <table>
                        <tbody>
                            <tr>
                                {result.cols.map((col, i) => (
                                    <th key={i}>{col}</th>
                                ))}
                            </tr>
                            {result.rows.map((row, i) => (
                                <tr key={i}>
                                    {result.cols.map((col, j) => (
                                        <td key={j}>
                                            {col === 'tbl_name' ? (
                                                <a
                                                    href={
                                                        '?db=' +
                                                        encodeURIComponent(dbUrl) +
                                                        '&query=' +
                                                        encodeURIComponent(
                                                            'SELECT * FROM ' + row[j]
                                                        )
                                                    }
                                                >
                                                    {row[j]}
                                                </a>
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
