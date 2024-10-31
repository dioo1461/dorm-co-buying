import EventSource, {
    EventSourceOptions,
    OpenEvent,
    MessageEvent,
    ErrorEvent,
    CloseEvent,
    TimeoutEvent,
    ExceptionEvent,
} from 'react-native-sse'
import { BASE_URL } from '@env'
import { getAccessToken } from '@/utils/accessTokenUtils'

interface Props {
    endpoint: string
    options?: EventSourceOptions
    onOpen?: (event: OpenEvent) => void
    onMessage?: (event: MessageEvent) => void
    onError?: (event: ErrorEvent | TimeoutEvent | ExceptionEvent) => void
    onClose?: (event: CloseEvent) => void
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
    onOpen,
    onMessage,
    onError,
    onClose,
}: Props): Promise<EventSource> => {
    const token = await getAccessToken()
    const es = new EventSource(BASE_URL + endpoint, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    onOpen && es.addEventListener('open', onOpen)
    onMessage && es.addEventListener('message', onMessage)
    onError && es.addEventListener('error', onError)
    onClose && es.addEventListener('close', onClose)

    return es
}
