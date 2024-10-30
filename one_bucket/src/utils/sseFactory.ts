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
            Authorization: {
                toString() {
                    return `Bearer ${token}`
                },
            },
        },
    })

    onOpen && es.addEventListener('open', onOpen)
    onMessage && es.addEventListener('message', onMessage)
    onError && es.addEventListener('error', onError)
    onClose && es.addEventListener('close', onClose)

    return es
}
