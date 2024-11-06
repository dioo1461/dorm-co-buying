export interface EventSourceOptions {
    method?: string
    headers?: { [key: string]: string }
    body?: any
    debug?: boolean
}

export interface Event {
    type: string
    data: any
}

export type EventHandler = (event: Event) => void

interface EventHandlers {
    [eventType: string]: EventHandler[]
}

export class EventSource {
    static readonly CONNECTING = 0
    static readonly OPEN = 1
    static readonly CLOSED = 2

    url: string
    readyState: number

    private method: string
    private headers: { [key: string]: string }
    private body: any
    private debug: boolean

    private xhr: XMLHttpRequest | null
    private eventHandlers: EventHandlers
    private lastIndex: number
    private buffer: string

    constructor(url: string, options: EventSourceOptions = {}) {
        this.url = typeof url.toString === 'function' ? url.toString() : url
        this.readyState = EventSource.CONNECTING

        this.method = options.method || 'GET'
        this.headers = options.headers || {}
        this.body = options.body || null
        this.debug = options.debug || false

        this.xhr = null
        this.eventHandlers = {}
        this.lastIndex = 0
        this.buffer = ''

        this.connect()
    }

    private connect() {
        try {
            this.xhr = new XMLHttpRequest()
            this.xhr.open(this.method, this.url, true)

            // Set headers
            for (const key in this.headers) {
                if (Object.prototype.hasOwnProperty.call(this.headers, key)) {
                    this.xhr.setRequestHeader(key, this.headers[key])
                }
            }

            this.xhr.onreadystatechange = () => {
                if (!this.xhr) return

                if (this.readyState === EventSource.CLOSED) {
                    return
                }

                if (this.xhr.readyState >= XMLHttpRequest.LOADING) {
                    if (this.xhr.status >= 200 && this.xhr.status < 400) {
                        if (this.readyState === EventSource.CONNECTING) {
                            this.readyState = EventSource.OPEN
                            this.dispatchEvent('open', {
                                type: 'open',
                                data: null,
                            })
                        }
                    } else if (this.xhr.status !== 0) {
                        this.readyState = EventSource.CLOSED
                        this.dispatchEvent('error', {
                            type: 'error',
                            data: {
                                message: this.xhr.responseText,
                                status: this.xhr.status,
                            },
                        })
                        this.close()
                    }
                }
            }

            this.xhr.onprogress = () => {
                if (!this.xhr) return

                const responseText = this.xhr.responseText
                this.processResponse(responseText)
            }

            this.xhr.onerror = () => {
                if (!this.xhr) return

                this.readyState = EventSource.CLOSED
                this.dispatchEvent('error', {
                    type: 'error',
                    data: {
                        message: this.xhr.responseText,
                        status: this.xhr.status,
                    },
                })
                this.close()
            }

            this.xhr.onload = () => {
                if (!this.xhr) return

                this.processResponse(this.xhr.responseText)

                this.readyState = EventSource.CLOSED
                this.dispatchEvent('close', { type: 'close', data: null })
                this.close()
            }

            this.xhr.send(this.body)
        } catch (e) {
            this.readyState = EventSource.CLOSED
            this.dispatchEvent('error', {
                type: 'exception',
                data: {
                    message: (e as Error).message,
                    error: e,
                },
            })
        }
    }

    private processResponse(responseText: string) {
        const newText = responseText.substring(this.lastIndex)
        this.lastIndex = responseText.length

        this.buffer += newText

        try {
            // Attempt to parse the entire buffer as JSON
            const data = JSON.parse(this.buffer)
            console.log('data received: ', data)
            this.buffer = ''
            this.dispatchEvent('message', { type: 'message', data })
        } catch (e) {
            // JSON is incomplete, wait for more data
            if (this.debug) {
                console.warn(
                    '[EventSource] Incomplete JSON, waiting for more data',
                )
            }
        }
    }

    addEventListener(eventType: string, listener: EventHandler) {
        if (!this.eventHandlers[eventType]) {
            this.eventHandlers[eventType] = []
        }

        this.eventHandlers[eventType].push(listener)
    }

    removeEventListener(eventType: string, listener: EventHandler) {
        if (this.eventHandlers[eventType]) {
            this.eventHandlers[eventType] = this.eventHandlers[
                eventType
            ].filter(handler => handler !== listener)
        }
    }

    removeAllEventListeners(eventType?: string) {
        if (eventType) {
            if (this.eventHandlers[eventType]) {
                this.eventHandlers[eventType] = []
            }
        } else {
            this.eventHandlers = {}
        }
    }

    dispatchEvent(eventType: string, event: Event) {
        if (this.eventHandlers[eventType]) {
            for (const handler of this.eventHandlers[eventType]) {
                try {
                    handler(event)
                } catch (e) {
                    console.error(
                        `[EventSource] Error in event handler for ${eventType}:`,
                        e,
                    )
                }
            }
        }
    }

    close() {
        if (this.readyState !== EventSource.CLOSED) {
            this.readyState = EventSource.CLOSED
            this.dispatchEvent('close', { type: 'close', data: null })
        }

        if (this.xhr) {
            this.xhr.abort()
            this.xhr = null
        }
    }
}

export default EventSource
