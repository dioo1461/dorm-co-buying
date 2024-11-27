import { useEffect, useRef, useState } from 'react'
import { SQLiteDatabase, openDatabase } from 'react-native-sqlite-storage'
import useDatabase, { ColumnTypes } from './useDatabase'
import { CHAT_BASE_URL } from '@env'
import { getAccessToken } from '@/utils/accessTokenUtils'
import {
    getLastTimestampOfChatRoom,
    setLastTimestampOfChatRoom,
} from '@/utils/asyncStorageUtils'
import { getChatLogAfterTimestamp } from '@/apis/chatService'
import { Client } from '@stomp/stompjs'

interface inputProps {
    chatRoomId: string
}

interface outputProps {
    messages: any
    sendMessage: (message: string) => void
}

interface ChatDataColumns {
    [key: string]: ColumnTypes
    type: string
    roomId: string
    sender: string
    message: string
    time: string
}

const useChat = ({ chatRoomId }: inputProps) => {
    const [db, setDb] = useState<SQLiteDatabase | null>(null)
    const stompClientRef = useRef<Client | null>(null)

    const { getDataByWhereClause, addData, deleteDataByKeys } =
        useDatabase<ChatDataColumns>({
            tableName: 'chat',
            columns: {
                type: 'string',
                roomId: 'string',
                sender: 'string',
                message: 'string',
                time: 'string',
            },
            // debug: true,
        })

    // ########## STATE MANAGEMENT ##########
    useEffect(() => {
        const initStompClient = async () => {
            const stompClient = new Client({
                brokerURL: CHAT_BASE_URL,
                connectHeaders: {
                    Authorization: `Bearer ${await getAccessToken()}`,
                },
                // debug: (str: string) => console.log(str),
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                forceBinaryWSFrames: true,
                appendMissingNULLonIncoming: true,
            })

            stompClient.onConnect = () => {
                console.log('Stomp Connected')
                stompClient.subscribe(
                    `/sub/chat/room/${chatRoomId}`,
                    message => {
                        const msg = JSON.parse(message.body)
                        handleMessageReceive(msg)
                        scrollToBottom()
                    },
                )
            }

            stompClient.activate()
            stompClientRef.current = stompClient
        }

        const fetchFreshChats = async () => {
            var timestamp = lastTimestamp.current!
            console.log('fetchFreshChats - lastTimestamp: ', timestamp)
            getChatLogAfterTimestamp(chatRoomId, timestamp).then(res => {
                console.log('$$$$$$$fresh messages fetched ', res)
                const freshMessages = res.map(chatLog => {
                    return {
                        type: 'TALK',
                        roomId: chatLog.roomId,
                        sender: chatLog.sender,
                        message: chatLog.message,
                        time: chatLog.timestamp,
                    }
                })
                addMessagesToData(freshMessages)
                if (freshMessages.length === 0) return
                setChatMessages(prev => [...freshMessages.reverse(), ...prev])
                setLastTimestampOfChatRoom(chatRoomId, freshMessages[0].time)
                return
            })
        }

        const initChatMessages = async (): Promise<void> => {
            console.log('lastTimeStamp: ', lastTimestamp.current)
            const messages = await retrieveMessagesFromData(
                messageRenderLimit,
                0,
            )
            if (messages) setChatMessages(messages)
        }

        const executeSynchoronously = async () => {
            lastTimestamp.current =
                (await getLastTimestampOfChatRoom(chatRoomId)) ??
                new Date().toISOString()
            await Promise.all([
                initStompClient(),
                initChatMessages(),
                getTradeInfoOfChatRoom(chatRoomId),
            ])
            await fetchFreshChats()
            setIsLoading(false)
        }
        console.log(chatRoomId)
        executeSynchoronously()

        return () => {
            console.log('close stomp connection')
            stompClientRef.current!.deactivate()
        }
    }, [])

    const retrieveMessagesFromData = async (limit: number, offset: number) => {
        console.log(
            `<retrieveMessagesFromData>, limit: ${limit}, offset: ${offset}`,
        )
        const messages = await getDataByWhereClause(
            `WHERE roomId = '${chatRoomId}' ORDER BY time DESC LIMIT ${limit} OFFSET ${offset}`,
        )
        console.log(`<retrieved> ${messages.length} messages`)
        return messages
    }

    const handleMessageReceive = (messageBody: WsChatMessageBody) => {
        // 본인의 LEAVE 메시지는 캐시에 저장하지 않음
        if (
            messageBody.type === 'LEAVE' &&
            messageBody.sender === useBoundStore.getState().memberInfo?.nickname
        ) {
            return
        }
        console.log('handleMessageReceive - ', messageBody)
        const message = messageBody as ChatDataColumns
        setChatMessages(prev => [message, ...prev!])
        addMessagesToData([message]).then(() => {
            console.log('handleMessageReceive - addData done')
            setLastTimestampOfChatRoom(messageBody.roomId, messageBody.time)
        })
    }

    const addMessagesToData = async (
        messages: ChatDataColumns[],
    ): Promise<void> => {
        console.log('addMessagesToData - ', messages)
        await Promise.all(
            messages.map(async message => {
                await addData({
                    type: message.type,
                    roomId: message.roomId,
                    sender: message.sender,
                    message: message.message,
                    time: message.time,
                })
            }),
        )
    }

    const sendMessage = (message: string) => {
        if (message.trim() == '') return
        const messageForm: WsChatMessageBody = {
            type: 'TALK',
            roomId: chatRoomId,
            sender: useBoundStore.getState().memberInfo?.nickname!,
            message,
            time: new Date().toISOString(),
        }
        stompClientRef.current?.publish({
            destination: '/pub/message',
            body: JSON.stringify(messageForm),
        })
        setMessage('')
        setLastTimestampOfChatRoom(chatRoomId, messageForm.time)
    }
}

export default useChat
