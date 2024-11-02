import EventSource, { SSEMessage } from 'react-native-oksse'
import { BASE_URL } from '@env'
import { getAccessToken } from '@/utils/accessTokenUtils'

interface EventHandlers {
    [key: string]: (event: SSEMessage) => void
}
interface Props {
    endpoint: string
    options?: {}
    eventHandlers: EventHandlers
    debug?: boolean
}

/**
 * Creates a Server-Sent Events (SSE) connection to the specified endpoint with an authorization token.
 * This function returns an EventSource instance for real-time data communication.
 *
 * @param {string} params.endpoint - The endpoint to connect to (relative to the BASE_URL).
 * @param {Object} params.options - Additional options for the EventSource connection.
 * @param {EventHandlers} params.eventHandlers - Event handlers for the connection.
 * @param {boolean} params.debug - Whether to log debug messages.
 * 
 * @example
 *  useEffect(() => {
        const eventSource = createSSEConnection({
            endpoint: '/chat/sse/chatList',
            options: {},
            eventHandlers: {
                open: openHandler,
                close: closeHandler,
                'initial-room-list': initialRoomListHandler,
            },
            debug: true,
        })

        esRef.current = eventSource

        return () => {
            esRef.current?.remove(initialRoomListHandler)
            esRef.current?.close()
        }
    }, [])
 */
export const createSSEConnection = async ({
    endpoint,
    options,
    eventHandlers,
    debug = false,
}: Props): Promise<EventSource<string>> => {
    const es = new EventSource<string>(BASE_URL + endpoint, {
        headers: {
            Authorization: `Bearer ${await getAccessToken()}`,
            ...options,
        },
    })

    for (const [event, handler] of Object.entries(eventHandlers)) {
        if (typeof handler === 'function') {
            debug &&
                console.log(`[EventSource] Adding event handler for '${event}'`)
            es.addEventListener(event, handler)
        } else {
            debug &&
                console.log(
                    `[EventSource] Event handler for '${event}' is not a function.`,
                )
        }
    }
    return es
}
