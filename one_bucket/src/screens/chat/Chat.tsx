import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { ChatMessageBody } from '@/data/request/chat/ChatMessage'
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

Object.assign(global, {
    TextEncoder: encoding.TextEncoder,
    TextDecoder: encoding.TextDecoder,
})

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

    const [message, setMessage] = useState('')
    const [chatMessages, setChatMessages] = useState<ChatMessageBody[]>([])

    const stompClientRef = useRef<Client | null>(null)

    const styles = createStyles(themeColor)

    // 헤더 옵션 설정
    useEffect(() => {
        navigation.setOptions({
            title: params.roomName,
            headerStyle: { backgroundColor: themeColor.BG },
            headerTintColor: themeColor.TEXT,
            headerTitleStyle: { fontWeight: 'bold' },
        })
    }, [navigation, params.roomName, themeColor])

    useEffect(() => {
        const initializeStompClient = async () => {
            const stompClient = new Client({
                brokerURL: CHAT_BASE_URL,
                connectHeaders: {
                    Authorization: `Bearer ${await getAccessToken()}`,
                },
                debug: (str: string) => console.log(str),
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
                        setChatMessages(prev => [...prev, msg])
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

    const validateMessage = () => message.trim() !== ''

    const sendMessage = () => {
        if (!validateMessage()) return
        const messageForm: ChatMessageBody = {
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

    const renderMessageItem = ({ item }: { item: ChatMessageBody }) => {
        const isMyMessage =
            item.sender === useBoundStore.getState().memberInfo?.nickname
        return isMyMessage ? (
            <View style={[styles.messageContainer, styles.myMessage]}>
                <Text style={styles.messageSender}></Text>
                <Text style={styles.myMessageText}>{item.message}</Text>
                <Text style={styles.messageTime}>
                    {new Date(item.time).toLocaleTimeString()}
                </Text>
            </View>
        ) : (
            <View style={[styles.messageContainer, styles.otherMessage]}>
                <Text style={styles.messageSender}>{item.sender}</Text>
                <Text style={styles.otherMessageText}>{item.message}</Text>
                <Text style={styles.messageTime}>
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
        messageSender: {
            fontSize: 10,
            color: theme.TEXT_SECONDARY,
        },
        messageTime: {
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
