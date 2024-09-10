import { darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { BASE_URL } from '@env'
import { Stomp } from '@stomp/stompjs'
import { useEffect, useRef, useState } from 'react'
import {
    Appearance,
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'
import SockJS from 'sockjs-client'

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

    const [message, setMessage] = useState('')
    const [chatMessages, setChatMessages] = useState<string[]>([])
    const stompClientRef = useRef<any>(null) // Stomp 클라이언트를 useRef로 저장

    // WebSocket 연결 및 설정
    useEffect(() => {
        const socket = new SockJS(BASE_URL + '/chat')
        const stompClient = Stomp.over(() => socket)

        const onConnected = () => {
            console.log('Connected to WebSocket')
            // 메시지 구독
            stompClient.subscribe('/chat/messages', message => {
                onMessageReceived(message)
            })
        }

        const onMessageReceived = (message: any) => {
            const payload = JSON.parse(message.body)
            console.log('Message received: ', payload)
            setChatMessages(prevMessages => [...prevMessages, payload.content]) // 새로운 메시지 추가
        }

        const onError = (error: any) => {
            console.log('Error', error)
        }

        // 연결 시작
        stompClient.connect({}, onConnected, onError)

        // Stomp 클라이언트를 참조로 저장
        stompClientRef.current = stompClient

        // 컴포넌트 언마운트 시 연결 해제
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect(() => {
                    console.log('Disconnected from WebSocket')
                })
            }
        }
    }, [])

    // 메시지 전송 함수
    const sendMessage = () => {
        if (stompClientRef.current && message.trim()) {
            stompClientRef.current.send(
                '/app/chat', // 서버 측에서 처리할 엔드포인트
                {},
                JSON.stringify({ sender: 'sender', content: message }),
            )
            setMessage('') // 메시지 전송 후 입력 필드 비움
        }
    }

    const styles = createStyles(themeColor)

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
