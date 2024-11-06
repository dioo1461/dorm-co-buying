import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { WsChatMessageBody } from '@/data/request/chat/ChatMessage'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { getAccessToken } from '@/utils/accessTokenUtils'
import { CHAT_BASE_URL } from '@env'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Client } from '@stomp/stompjs'
import { useEffect, useRef, useState } from 'react'
import { Appearance, FlatList, StyleSheet, TextInput, View } from 'react-native'
import { Button, Text } from 'react-native-elements'
import encoding from 'text-encoding'
import { RootStackParamList } from '../navigation/NativeStackNavigation'
import useCache, { ColumnTypes } from '@/hooks/useCache/useCache'
import { setLastTimestampOfChatRoom } from '@/utils/asyncStorageUtils'

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

    const [message, setMessage] = useState('')
    const [chatMessages, setChatMessages] = useState<ChatCacheColumns[]>([])
    const [messageRenderCount, setMessageRenderCount] = useState(20)

    const stompClientRef = useRef<Client | null>(null)

    const { dropTable, getAllCaches, getCachesByKeys, addCache, removeCache } =
        useCache<ChatCacheColumns>({
            tableName: 'chat',
            columns: {
                roomId: 'string',
                sender: 'string',
                message: 'string',
                time: 'string',
            },
            debug: true,
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

    // ### STOMP CONNECTION ###
    useEffect(() => {
        const initializeStompClient = async () => {
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
                console.log('Connected')
                stompClient.subscribe(
                    `/sub/chat/room/${params.roomId}`,
                    message => {
                        const msg = JSON.parse(message.body)
                        onMessageReceive(msg)
                    },
                )
            }

            stompClient.activate()
            stompClientRef.current = stompClient
        }

        initializeStompClient()

        return () => {
            stompClientRef.current?.deactivate()
        }
    }, [])

    useEffect(() => {
        const initChatMessages = async () => {
            const newMessages = await getCachesByKeys({ roomId: params.roomId })
            console.log(newMessages)
            if (newMessages) setChatMessages([...newMessages, ...chatMessages])
        }
        initChatMessages()
    }, [])

    const validateMessage = () => message.trim() !== ''

    const onMessageReceive = (messageBody: WsChatMessageBody) => {
        console.log(messageBody)
        const { type, ...message } = messageBody
        setChatMessages(prev => [...prev, message])
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
        if (!validateMessage()) return
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

    const renderMessageItem = ({ item }: { item: ChatCacheColumns }) => {
        const isMyMessage =
            item.sender === useBoundStore.getState().memberInfo?.nickname
        return isMyMessage ? (
            <View style={[styles.messageContainer, styles.myMessage]}>
                <Text style={styles.messageSenderText}></Text>
                <Text style={styles.myMessageText}>{item.message}</Text>
                <Text style={styles.messageTimeText}>
                    {new Date(item.time).toLocaleTimeString()}
                </Text>
            </View>
        ) : (
            <View style={[styles.messageContainer, styles.otherMessage]}>
                <Text style={styles.messageSenderText}>{item.sender}</Text>
                <Text style={styles.otherMessageText}>{item.message}</Text>
                <Text style={styles.messageTimeText}>
                    {new Date(item.time).toLocaleTimeString()}
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={chatMessages}
                renderItem={renderMessageItem}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.chatContainer}
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
            paddingVertical: 20,
        },
        messageContainer: {
            maxWidth: '70%',
            marginVertical: 5,
            padding: 10,
            borderRadius: 10,
        },
        myMessage: {
            backgroundColor: theme.BUTTON_BG,
            alignSelf: 'flex-end',
        },
        myMessageText: {
            color: theme.BUTTON_TEXT,
            fontSize: 16,
        },
        otherMessageText: {
            color: theme.TEXT,
            fontSize: 16,
        },
        otherMessage: {
            backgroundColor: theme.BG_SECONDARY,
            alignSelf: 'flex-start',
        },
        messageSenderText: {
            fontSize: 10,
            color: theme.TEXT_SECONDARY,
        },
        messageTimeText: {
            fontSize: 10,
            color: theme.TEXT_SECONDARY,
            alignSelf: 'flex-end',
            marginTop: 4,
        },
        inputContainer: {
            flexDirection: 'row',
            paddingHorizontal: 10,
            paddingVertical: 10,
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
