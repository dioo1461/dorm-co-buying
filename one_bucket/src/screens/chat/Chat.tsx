import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { WsChatMessageBody } from '@/data/request/chat/WsChatMessageBody'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { getAccessToken } from '@/utils/accessTokenUtils'
import { CHAT_BASE_URL } from '@env'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Client } from '@stomp/stompjs'
import { useEffect, useRef, useState } from 'react'
import {
    Appearance,
    FlatList,
    InteractionManager,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    TextInput,
    View,
} from 'react-native'
import { Button, Text } from 'react-native-elements'
import encoding from 'text-encoding'
import { RootStackParamList } from '../navigation/NativeStackNavigation'
import useCache, { ColumnTypes } from '@/hooks/useCache/useCache'
import {
    getLastTimestampOfChatRoom,
    setLastTimestampOfChatRoom,
} from '@/utils/asyncStorageUtils'
import Loading from '@/components/Loading'
import { convertToKoreanTime } from '@/utils/dateUtils'

Object.assign(global, {
    TextEncoder: encoding.TextEncoder,
    TextDecoder: encoding.TextDecoder,
})

interface ChatCacheColumns {
    [key: string]: ColumnTypes
    roomId: string
    sender: string
    message: string
    time: string
}

const RENDER_AMOUNT = 20

const Chat: React.FC = (): React.JSX.Element => {
    const navigation = useNavigation()
    const { themeColor, setThemeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
        setThemeColor: state.setThemeColor,
    }))
    // 다크모드 변경 감지
    useEffect(() => {
        const themeSubscription = Appearance.addChangeListener(
            ({ colorScheme }) => {
                setThemeColor(colorScheme === 'dark' ? darkColors : lightColors)
            },
        )
        return () => themeSubscription.remove()
    }, [])

    type ChatRouteProp = RouteProp<RootStackParamList, 'Chat'>
    const { params } = useRoute<ChatRouteProp>()
    const styles = createStyles(themeColor)

    const [isLoading, setIsLoading] = useState(true)
    const [lastTimestamp, setLastTimestamp] = useState<string | null>(null)
    const [message, setMessage] = useState('')
    const [chatMessages, setChatMessages] = useState<ChatCacheColumns[] | null>(
        null,
    )

    const isLoadingMore = useRef<Boolean>(false)
    const [messageRenderLimit, setMessageRenderLimit] = useState(RENDER_AMOUNT)
    const [messageRenderOffset, setMessageRenderOffset] =
        useState(RENDER_AMOUNT)

    const flatListRef = useRef<FlatList<ChatCacheColumns> | null>(null)
    const stompClientRef = useRef<Client | null>(null)

    const { getCachesByWhereClause, getCachesByKeys, addCache, removeCache } =
        useCache<ChatCacheColumns>({
            tableName: 'chat',
            columns: {
                roomId: 'string',
                sender: 'string',
                message: 'string',
                time: 'string',
            },
            // debug: true,
        })

    // navigation 헤더 옵션 설정
    useEffect(() => {
        navigation.setOptions({
            title: params.roomName,
            headerStyle: { backgroundColor: themeColor.BG },
            headerTintColor: themeColor.TEXT,
            headerTitleStyle: { fontWeight: 'bold' },
        })
    }, [navigation, params.roomName, themeColor])

    const retrieveMessages = async (
        limit: number,
        offset: number,
        lastTimestamp: string,
    ) => {
        console.log(`<retrieveMessages>, limit: ${limit}, offset: ${offset}`)
        const messages = await getCachesByWhereClause(
            `WHERE roomId = '${params.roomId}' AND time < '${
                lastTimestamp ?? new Date().toISOString()
            }' ORDER BY time DESC LIMIT ${limit} OFFSET ${offset}`,
        )
        console.log(`<retrieved> ${messages.length} messages`)
        return messages
    }

    // ############ STOMP CONNECTION ############
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
                    `/sub/chat/room/${params.roomId}`,
                    message => {
                        const msg = JSON.parse(message.body)
                        onMessageReceive(msg)
                        scrollToBottom()
                    },
                )
            }

            stompClient.activate()
            stompClientRef.current = stompClient
        }

        const initChatMessages = async (): Promise<Boolean> => {
            const messages = await retrieveMessages(
                messageRenderLimit,
                0,
                lastTimestamp ?? new Date().toISOString(),
            )
            if (messages) setChatMessages(messages)
            return true
        }

        const executeSynchoronously = async () => {
            setLastTimestamp(await getLastTimestampOfChatRoom(params.roomId))
            await initChatMessages()
            initStompClient()
        }

        executeSynchoronously()

        return () => {
            stompClientRef.current?.deactivate()
        }
    }, [])

    const onMessageReceive = (messageBody: WsChatMessageBody) => {
        // console.log(messageBody)
        const { type, ...message } = messageBody
        setChatMessages(prev => [message, ...prev!])
        addCache({
            roomId: messageBody.roomId,
            sender: messageBody.sender,
            message: messageBody.message,
            time: messageBody.time,
        }).then(() => {
            setLastTimestampOfChatRoom(messageBody.roomId, messageBody.time)
            setChatMessages
        })
    }

    const sendMessage = () => {
        if (message.trim() == '') return
        const messageForm: WsChatMessageBody = {
            type: 'TALK',
            roomId: params.roomId,
            sender: useBoundStore.getState().memberInfo?.nickname!,
            message,
            time: new Date().toISOString(),
        }
        stompClientRef.current?.publish({
            destination: '/pub/message',
            body: JSON.stringify(messageForm),
        })
        setMessage('')
    }

    // ############## RENDERING PARTS ##############

    useEffect(() => {
        if (chatMessages != null) {
            // console.log(chatMessages)
            setIsLoading(false)
        }
    }, [chatMessages])

    useEffect(() => {
        console.log('isloading', isLoading)
        if (!isLoading) {
            InteractionManager.runAfterInteractions(() => {
                // scrollToBottom()
            })
        }
    }, [isLoading])

    const scrollToBottom = () => {
        flatListRef.current?.scrollToOffset({ animated: false, offset: 0 })
    }

    // 메시지 로드 함수
    const loadMoreMessages = async () => {
        isLoadingMore.current = true
        const moreMessages = await retrieveMessages(
            messageRenderLimit,
            messageRenderOffset,
            lastTimestamp ?? new Date().toISOString(),
        )
        setChatMessages([...chatMessages!, ...moreMessages])
        setMessageRenderOffset(messageRenderOffset + moreMessages.length)
        if (moreMessages.length > 0)
            setMessageRenderLimit(messageRenderLimit * 2)
        isLoadingMore.current = false
    }

    const formatMessageTime = (utcTime: string) => {
        const time = convertToKoreanTime(new Date(utcTime))
        const hour = time.getHours()
        const minute = time.getMinutes()
        const period = hour < 12 ? '오전' : '오후'
        const formattedHour = (hour % 12 || 12).toString() // 12시간제, 0시는 12로 표시
        const formattedMinute = minute < 10 ? `0${minute}` : minute.toString() // 분이 한 자리일 경우 앞에 0 추가
        return `${period} ${formattedHour}:${formattedMinute}`
    }

    // ############ ACTUAL RENDER ############

    const renderMessageItem = ({
        item,
        index,
    }: {
        item: ChatCacheColumns
        index: number
    }) => {
        const isMyMessage =
            item.sender === useBoundStore.getState().memberInfo?.nickname
        const currentMessageTime = new Date(item.time)

        if (!chatMessages) return null

        // 참고: 맨 밑에 표시되는 메시지의 index는 0임 (invereted FlatList)
        // 다음 메시지와 발신자가 다른지 확인
        const shouldShowSenderName =
            index === chatMessages.length - 1 ||
            chatMessages[index + 1].sender !== item.sender

        // 이전 메시지와 시간이 다른지, 발신자가 다른지 확인
        const isLastInSameMinute =
            index === 0 || // 첫 번째 메시지일 때 표시
            chatMessages[index - 1].sender !== item.sender || // 이전 메시지의 발신자가 다를 때 표시
            new Date(chatMessages[index - 1].time).getMinutes() !==
                currentMessageTime.getMinutes() ||
            new Date(chatMessages[index - 1].time).getHours() !==
                currentMessageTime.getHours()

        return isMyMessage ? (
            // ### 본인이 보낸 메시지 ###
            <View style={styles.myMessageContainer}>
                <View style={styles.myMessageContent}>
                    {isLastInSameMinute && (
                        <Text style={styles.myMessageTimeText}>
                            {formatMessageTime(item.time)}
                        </Text>
                    )}
                    <View style={styles.myMessageBG}>
                        <Text style={styles.myMessageText}>{item.message}</Text>
                    </View>
                </View>
            </View>
        ) : (
            // ### 상대방이 보낸 메시지 ###
            <View style={styles.otherMessageContainer}>
                {/* 다음 메시지와 발신자가 다를 때만 닉네임 표시 */}
                {shouldShowSenderName && (
                    <Text style={styles.messageSenderText}>{item.sender}</Text>
                )}
                <View style={styles.otherMessageContent}>
                    <View style={styles.otherMessageBG}>
                        <Text style={styles.otherMessageText}>
                            {item.message}
                        </Text>
                    </View>
                    {/* 이전 메시지와 시간이 같지 않거나 발신자가 다를 때만 시간 표시 */}
                    {isLastInSameMinute && (
                        <Text style={styles.otherMessageTimeText}>
                            {formatMessageTime(item.time)}
                        </Text>
                    )}
                </View>
            </View>
        )
    }

    if (isLoading) return <Loading theme={themeColor} />

    return (
        <View style={styles.container}>
            <FlatList
                initialNumToRender={20}
                ref={flatListRef}
                data={chatMessages}
                renderItem={renderMessageItem}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.chatContainer}
                inverted
                onEndReached={loadMoreMessages} // 끝에 도달할 때 loadMoreMessages 호출
                onEndReachedThreshold={0.6} // 리스트 끝에서 10% 지점 도달 시 loadMoreMessages 호출
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder='메시지를 입력하세요'
                />
                <Button
                    title='전송'
                    onPress={sendMessage}
                    buttonStyle={styles.sendButton}
                />
            </View>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.BG,
        },
        chatContainer: {
            paddingHorizontal: 10,
        },
        // 본인 메시지 스타일
        myMessageContainer: {
            alignSelf: 'flex-end',
            marginVertical: 5,
            alignItems: 'flex-end',
            maxWidth: '80%', // 메시지 최대 너비 제한
        },
        myMessageContent: {
            flexDirection: 'row', // 메시지와 시간을 수평으로 배치
            alignItems: 'flex-end',
        },
        myMessageBG: {
            backgroundColor: theme.BUTTON_BG,
            padding: 10,
            borderRadius: 10,
            maxWidth: '100%',
        },
        myMessageText: {
            color: theme.BUTTON_TEXT,
            fontSize: 16,
        },
        myMessageTimeText: {
            fontSize: 10,
            color: theme.TEXT_SECONDARY,
            marginRight: 5, // 메시지와 시간 사이 간격
        },
        // 상대방 메시지 스타일
        otherMessageContainer: {
            alignSelf: 'flex-start',
            marginVertical: 5,
            maxWidth: '80%', // 메시지 최대 너비 제한
        },
        otherMessageContent: {
            flexDirection: 'row', // 메시지와 시간을 수평으로 배치
            alignItems: 'flex-end',
        },
        otherMessageBG: {
            backgroundColor: theme.BG_SECONDARY,
            padding: 10,
            borderRadius: 10,
            maxWidth: '100%',
        },
        otherMessageText: {
            color: theme.TEXT,
            fontSize: 16,
        },
        otherMessageTimeText: {
            fontSize: 10,
            color: theme.TEXT_SECONDARY,
            marginLeft: 5, // 메시지와 시간 사이 간격
        },
        messageSenderText: {
            fontSize: 12,
            color: theme.TEXT_SECONDARY,
            marginBottom: 3,
        },
        inputContainer: {
            flexDirection: 'row',
            paddingHorizontal: 10,
            paddingVertical: 10,
            marginTop: 10,
            borderTopWidth: 1,
            borderTopColor: theme.TEXT_SECONDARY,
            backgroundColor: theme.BG,
        },
        input: {
            flex: 1,
            height: 40,
            borderRadius: 20,
            paddingHorizontal: 15,
            backgroundColor: theme.BG_SECONDARY,
            color: theme.TEXT,
        },
        sendButton: {
            marginLeft: 10,
            borderRadius: 20,
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: theme.TEXT_SECONDARY,
        },
    })

export default Chat
