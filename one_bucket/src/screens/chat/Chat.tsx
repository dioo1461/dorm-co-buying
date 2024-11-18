import {
    getChatLogAfterTimestamp,
    getTradeInfoOfChatRoom,
} from '@/apis/chatService'
import IcOthers from '@/assets/drawable/ic-others.svg'
import { SelectableBottomSheet } from '@/components/bottomSheet/SelectableBottomSheet'
import Loading from '@/components/Loading'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { WsChatMessageBody } from '@/data/request/chat/WsChatMessageBody'
import useDatabase, { ColumnTypes } from '@/hooks/useDatabase/useDatabase'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { getAccessToken } from '@/utils/accessTokenUtils'
import {
    getLastTimestampOfChatRoom,
    setLastTimestampOfChatRoom,
} from '@/utils/asyncStorageUtils'
import { CHAT_BASE_URL } from '@env'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Client } from '@stomp/stompjs'
import { useEffect, useRef, useState } from 'react'
import {
    Appearance,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Text,
} from 'react-native'
import encoding from 'text-encoding'
import { RootStackParamList } from '../navigation/NativeStackNavigation'
import BottomSheet from '@/components/bottomSheet/BottomSheet'

Object.assign(global, {
    TextEncoder: encoding.TextEncoder,
    TextDecoder: encoding.TextDecoder,
})

type ChatDataColumns = {
    type: string
    roomId: string
    sender: string
    message: string
    time: string
}

const RENDER_AMOUNT = 20

// TODO: 이미지 전송 가능하도록 구현
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

    // navigation 헤더 옵션 설정
    useEffect(() => {
        navigation.setOptions({
            title: params.roomName,
            headerStyle: { backgroundColor: themeColor.BG },
            headerTintColor: themeColor.TEXT,
            headerTitle: () => (
                <Text
                    style={{
                        color: themeColor.TEXT,
                        fontSize: 15,
                        fontFamily: 'NanumGothic-Bold',
                    }}
                    numberOfLines={1}
                    ellipsizeMode='tail'>
                    {params.roomName}
                </Text>
            ),
            headerRight: () => (
                <TouchableOpacity
                    onPress={() =>
                        setStandardBottomSheetEnabled(
                            !standardBottomSheetEnabled,
                        )
                    }
                    style={{ marginRight: 16 }}>
                    <IcOthers fill={baseColors.GRAY_2} />
                </TouchableOpacity>
            ),
        })
    }, [themeColor])

    type ChatRouteProp = RouteProp<RootStackParamList, 'Chat'>
    const { params } = useRoute<ChatRouteProp>()
    const styles = createStyles(themeColor)

    // ########## 상태 관리 변수 ##########

    const [isLoading, setIsLoading] = useState(true)
    const lastTimestamp = useRef<string | null>(null)
    const [message, setMessage] = useState('')
    const [chatMessages, setChatMessages] = useState<ChatDataColumns[]>([])

    const isLoadingMore = useRef<Boolean>(false)
    const [hasMoreMessages, setHasMoreMessagesToRender] = useState(true)
    const [messageRenderLimit, setMessageRenderLimit] = useState(RENDER_AMOUNT)
    const [messageRenderOffset, setMessageRenderOffset] =
        useState(RENDER_AMOUNT)

    const [standardBottomSheetEnabled, setStandardBottomSheetEnabled] =
        useState(false)
    const [membersBottomSheetEnabled, setMembersBottomSheetEnabled] =
        useState(false)
    // TODO: bottomSheetButton 동적 관리 - userId 필요
    // const [bottomSheetButtons, setBottomSheetButtons] = useState(null)

    const flatListRef = useRef<FlatList<ChatDataColumns> | null>(null)
    const stompClientRef = useRef<Client | null>(null)

    const { getDataByWhereClause, addData, removeData } =
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

        const fetchFreshChats = async () => {
            var timestamp = lastTimestamp.current!
            console.log('fetchFreshChats - lastTimestamp: ', timestamp)
            getChatLogAfterTimestamp(params.roomId, timestamp).then(res => {
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
                setLastTimestampOfChatRoom(params.roomId, freshMessages[0].time)
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
                (await getLastTimestampOfChatRoom(params.roomId)) ??
                new Date().toISOString()
            await Promise.all([
                initStompClient(),
                initChatMessages(),
                getTradeInfoOfChatRoom(params.roomId),
            ])
            await fetchFreshChats()
            setIsLoading(false)
        }
        console.log(params.roomId)
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
            `WHERE roomId = '${params.roomId}' ORDER BY time DESC LIMIT ${limit} OFFSET ${offset}`,
        )
        console.log(`<retrieved> ${messages.length} messages`)
        return messages
    }

    const onMessageReceive = (messageBody: WsChatMessageBody) => {
        // 본인의 LEAVE 메시지는 캐시에 저장하지 않음
        if (
            messageBody.type === 'LEAVE' &&
            messageBody.sender === useBoundStore.getState().memberInfo?.nickname
        ) {
            return
        }
        console.log('onMessageReceive - ', messageBody)
        const message = messageBody as ChatDataColumns
        setChatMessages(prev => [message, ...prev!])
        addMessagesToData([message]).then(() => {
            console.log('onMessageReceive - addData done')
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
        setLastTimestampOfChatRoom(params.roomId, messageForm.time)
    }

    const loadMoreMessages = async () => {
        if (isLoadingMore.current || !hasMoreMessages) return
        isLoadingMore.current = true

        const moreMessages = await retrieveMessagesFromData(
            messageRenderLimit,
            messageRenderOffset,
        )
        if (moreMessages == null || moreMessages.length == 0) {
            setHasMoreMessagesToRender(false)
            isLoadingMore.current = false
            return
        }

        setChatMessages([...chatMessages, ...moreMessages])
        setMessageRenderOffset(messageRenderOffset + moreMessages.length)

        if (moreMessages.length < messageRenderLimit) {
            // 더 이상 가져올 메시지가 없음
            setHasMoreMessagesToRender(false)
        } else {
            // 다음 로드를 위해 limit를 늘림
            setMessageRenderLimit(messageRenderLimit * 2)
        }

        isLoadingMore.current = false
    }

    // ############ BOTTOM SHEET PROPS ############

    const onMembersButtonPress = () => {
        setMembersBottomSheetEnabled(true)
    }

    const onReportButtonPress = () => {
        console.log('신고하기')
    }

    const onLeaveButtonPress = async () => {
        const token = await getAccessToken()
        const messageForm: WsChatMessageBody = {
            type: 'LEAVE',
            roomId: params.roomId,
            sender: useBoundStore.getState().memberInfo?.nickname!,
            message: `Bearer ${token}`,
            time: new Date().toISOString(),
        }
        stompClientRef.current?.publish({
            destination: '/pub/message',
            body: JSON.stringify(messageForm),
        })
        removeData({ roomId: params.roomId }).then(() => {
            navigation.goBack()
        })
    }

    const bottomSheetButtons = [
        {
            text: '거래 참여 멤버 보기',
            style: 'default' as const,
            onPress: onMembersButtonPress,
        },
        {
            text: '신고하기',
            style: 'default' as const,
            onPress: onReportButtonPress,
        },
        {
            text: '채팅방 나가기',
            style: 'destructive' as const,
            onPress: onLeaveButtonPress,
        },
    ]
    // ############ RENDERING PARTS ############

    const scrollToBottom = () => {
        flatListRef.current?.scrollToOffset({ animated: false, offset: 0 })
    }

    const formatMessageTime = (utcTime: string) => {
        const time = new Date(utcTime)
        const hour = time.getHours()
        const minute = time.getMinutes()
        const period = hour < 12 ? '오전' : '오후'
        const formattedHour = (hour % 12 || 12).toString() // 12시간제, 0시는 12로 표시
        const formattedMinute = minute < 10 ? `0${minute}` : minute.toString() // 분이 한 자리일 경우 앞에 0 추가
        return `${period} ${formattedHour}:${formattedMinute}`
    }

    const validateMessage = (message: string): Boolean => {
        if (message.trim() === '') {
            return false
        }
        return true
    }

    // ############ ACTUAL RENDER ############

    const renderMessageItem = ({
        item,
        index,
    }: {
        item: ChatDataColumns
        index: number
    }) => {
        const isMyMessage =
            item.sender === useBoundStore.getState().memberInfo?.nickname
        const currentMessageTime = new Date(item.time)

        // TODO: null check 관련 anomaly 발생 시 수정 필요
        if (chatMessages.length === 0) return null

        if (item.type === 'ENTER') {
            return (
                <View style={styles.eventMessageContainer}>
                    <Text style={styles.eventMessageText}>
                        {item.sender}님이 채팅방에 참가했습니다.
                    </Text>
                </View>
            )
        }

        if (item.type === 'LEAVE') {
            return (
                <View style={styles.eventMessageContainer}>
                    <Text style={styles.eventMessageText}>
                        {item.sender}님이 채팅방에서 나갔습니다.
                    </Text>
                </View>
            )
        }

        // ### item.type === 'TALK' ###
        // (참고: 맨 밑에 표시되는 메시지의 index는 0임 - FlatList is inverted)
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
                keyExtractor={(_, idx) => idx.toString()}
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
                <TouchableOpacity
                    style={
                        validateMessage(message)
                            ? styles.sendButtonActive
                            : styles.sendButtonInactive
                    }
                    onPress={() => sendMessage(message)}
                    disabled={!validateMessage(message)}>
                    <Text
                        style={
                            validateMessage(message)
                                ? styles.sendButtonTextActive
                                : styles.sendButtonTextInactive
                        }
                        onPress={() => sendMessage(message)}>
                        전송
                    </Text>
                </TouchableOpacity>
            </View>
            <SelectableBottomSheet
                enabled={standardBottomSheetEnabled}
                theme={themeColor}
                onClose={() => setStandardBottomSheetEnabled(false)}
                buttons={bottomSheetButtons}
            />
            <BottomSheet
                enabled={membersBottomSheetEnabled}
                onClose={() => setMembersBottomSheetEnabled(false)}
                theme={themeColor}>
                <Text>ㅎㅇㅋㅋ</Text>
            </BottomSheet>
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
        myMessageContainer: {
            alignSelf: 'flex-end',
            marginVertical: 5,
            alignItems: 'flex-end',
            maxWidth: '80%',
        },
        myMessageContent: {
            flexDirection: 'row',
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
            fontSize: 14,
        },
        myMessageTimeText: {
            fontSize: 10,
            color: theme.TEXT_SECONDARY,
            marginRight: 5,
        },
        otherMessageContainer: {
            alignSelf: 'flex-start',
            marginVertical: 5,
            maxWidth: '80%',
        },
        otherMessageContent: {
            flexDirection: 'row',
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
            fontSize: 14,
        },
        otherMessageTimeText: {
            fontSize: 10,
            color: theme.TEXT_SECONDARY,
            marginLeft: 5,
        },
        messageSenderText: {
            fontSize: 12,
            color: theme.TEXT_SECONDARY,
            marginBottom: 3,
        },
        eventMessageContainer: {
            backgroundColor: theme.BG_SECONDARY,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 30,
            alignSelf: 'center',
            alignItems: 'center',
            marginVertical: 10,
        },
        eventMessageText: {
            color: theme.TEXT_SECONDARY,
            fontFamily: 'NanumGothic',
            fontSize: 11,
            textAlign: 'center',
        },
        inputContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
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
        sendButtonActive: {
            backgroundColor: theme.BUTTON_BG,
            justifyContent: 'center',
            alignContent: 'center',
            marginLeft: 10,
            borderRadius: 20,
            paddingVertical: 8,
            paddingHorizontal: 16,
        },
        sendButtonTextActive: {
            color: theme.BUTTON_TEXT,
            fontFamily: 'NanumGothic',
            fontSize: 12,
        },
        sendButtonInactive: {
            backgroundColor: theme.BUTTON_SECONDARY_BG,
            justifyContent: 'center',
            alignContent: 'center',
            marginLeft: 10,
            borderRadius: 20,
            paddingVertical: 8,
            paddingHorizontal: 16,
        },
        sendButtonTextInactive: {
            color: theme.BUTTON_SECONDARY_TEXT,
            fontFamily: 'NanumGothic',
            fontSize: 12,
        },
    })

export default Chat
