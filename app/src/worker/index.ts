import * as SQL from './api'
import { runtimeInitialization } from './vfs'

type JSONRPC = {
    method: string
    params: any[]
    id: number
}

onmessage = async e => {
    const message: JSONRPC = e.data

    // console.log(message)
    // if (Object.prototype.hasOwnProperty.call(SQL, message.method))
    try {
        await runtimeInitialization
        const result = await SQL[message.method](...message.params)
        postMessage({
            id: message.id,
            result: result,
        })
    } catch (err) {
        postMessage({
            id: message.id,
            error: err,
        })
    }
}
