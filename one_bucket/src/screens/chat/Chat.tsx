import { darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { useEffect, useRef, useState } from 'react'
import { Appearance, StyleSheet, View } from 'react-native'
import encoding from 'text-encoding'
import { RootStackParamList } from '../navigation/NativeStackNavigation'
import { RouteProp, useRoute } from '@react-navigation/native'
import { Client } from '@stomp/stompjs'
import { getAccessToken } from '@/utils/accessTokenUtils'
import { Button, Text } from 'react-native-elements'
import { TextInput } from 'react-native-gesture-handler'
import { CHAT_BASE_URL } from '@env'

Object.assign(global, {
    TextEncoder: encoding.TextEncoder,
    TextDecoder: encoding.TextDecoder,
})

const Chat: React.FC = (): React.JSX.Element => {
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
    // const [chatMessages, setChatMessages] = useState<string[]>([])
    const chatMessages = ['']

    const stompClientRef = useRef<Client | null>(null) // Stomp 클라이언트를 useRef로 저장

    const styles = createStyles(themeColor)

    useEffect(() => {
        const initializeStompClient = async () => {
            // Stomp 클라이언트 생성
            const stompClient = new Client({
                brokerURL: CHAT_BASE_URL,
                connectHeaders: {
                    Authorization: `Bearer ${await getAccessToken()}`,
                },
                debug: (str: string) => {
                    console.log(str)
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            })

            // 연결 성공 시
            stompClient.onConnect = () => {
                console.log('Connected')
                // 구독
                stompClient.subscribe('/sub/chat/room', message => {
                    const msg = JSON.parse(message.body)
                    console.log(msg)
                    // setChatMessages(prev => [...prev, msg.content])
                })
            }

            // 연결 시도
            stompClient.activate()

            stompClientRef.current = stompClient
        }

        initializeStompClient()

        return () => {
            stompClientRef.current?.deactivate()
        }
    }, [])

    // 메시지 전송 함수
    const sendMessage = () => {
        message.trim()
        stompClientRef.current?.publish({
            destination: '/pub/message',
            body: JSON.stringify({ content: message, sender: 'test' }),
        })
        setMessage('')
    }
    return (
        <View style={styles.container}>
            <View style={styles.chatContainer}>
                {/* 채팅 메시지 목록 */}
                {chatMessages.map((msg, index) => (
                    <View key={index} style={styles.message}>
                        <Text>{msg}</Text>
                    </View>
                ))}
            </View>

            {/* 메시지 입력 필드 */}
            <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder='메시지를 입력하세요'
            />
            <Button title='전송' onPress={sendMessage} />
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
        },
        chatContainer: {
            flex: 1,
            marginBottom: 10,
        },
        message: {
            padding: 8,
            marginVertical: 4,
            backgroundColor: theme.BG,
            borderRadius: 5,
        },
        input: {
            height: 40,
            borderColor: theme.TEXT_SECONDARY,
            borderWidth: 1,
            paddingHorizontal: 10,
        },
    })

export default Chat
