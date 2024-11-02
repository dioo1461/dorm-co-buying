import EventSource, { EventSourceOptions, CustomEvent } from 'react-native-sse'
import { BASE_URL } from '@env'
import { getAccessToken } from '@/utils/accessTokenUtils'

interface EventHandlers {
    [key: string]: (event: CustomEvent<string>) => void
}
interface Props {
    endpoint: string
    options?: EventSourceOptions
    eventHandlers: EventHandlers
}

/**
 * Creates a Server-Sent Events (SSE) connection to the specified endpoint with an authorization token.
 * This function returns an EventSource instance for real-time data communication.
 *
 * @param {string} params.endpoint - The endpoint to connect to (relative to the BASE_URL).
 * @param {function} [params.onOpen] - Callback function to handle the 'open' event when the connection is established.
 * @param {function} [params.onMessage] - Callback function to handle incoming 'message' events with data.
 * @param {function} [params.onError] - Callback function to handle 'error' events when an error occurs.
 * @param {function} [params.onClose] - Callback function to handle 'close' events when the connection is closed.
 *
 * @returns {Promise<EventSource>} - A Promise that resolves to an EventSource instance.
 *
 * @example
 *  useEffect(() => {
        const eventSource = createSSEConnection({
            endpoint: '/events',
            onOpen: event => console.log('Connection opened', event),
            onMessage: event => console.log('New message:', event.data),
            onError: error => console.error('Error:', error),
            onClose: event => console.log('Connection closed', event),
        })

        return () => {
            
            eventSource.then(connection => connection.close())
        }
    }, [])
 */
export const createSSEConnection = async ({
    endpoint,
    options,
    eventHandlers,
}: Props): Promise<EventSource<string>> => {
    const token = await getAccessToken()
    const es = new EventSource<string>(BASE_URL + endpoint, {
        headers: {
            Authorization: `Bearer ${token}`,
            ...options,
        },
        debug: false,
    })

    for (const [event, handler] of Object.entries(eventHandlers)) {
        if (typeof handler === 'function') {
            console.log(`Adding event handler for '${event}'`)
            es.addEventListener(event, handler)
        } else {
            console.log(`Event handler for '${event}' is not a function.`)
        }
    }
    return es
}
