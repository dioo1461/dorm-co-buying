import { darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { getAccessToken } from '@/utils/accessTokenUtils'
import { Client, Stomp } from '@stomp/stompjs'
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

// Object.assign(global, { WebSocket })

const ROOM_ID = '4852b68f-da40-4235-898b-1a0ea25deb5b'

const ChatTest: React.FC = (): React.JSX.Element => {
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
    const stompClientRef = useRef<Client | null>(null) // Stomp 클라이언트를 useRef로 저장

    useEffect(() => {
        // WebSocket 연결 및 설정
        // 왜안되지 ..
        const initStompClient = async () => {
            const token = await getAccessToken()
            // const stompClient = new Client({
            //     // webSocketFactory: () => new WebSocket(CHAT_BASE_URL),
            //     brokerURL: 'ws://192.168.243.182:8080/ws',
            //     // connectHeaders: {
            //     //     Authorization: `Bearer ${token}`,
            //     // },
            //     onConnect: () => {
            //         console.log('connected')
            //         // stompClient.subscribe(
            //         //     '/sub/chat/room/' + ROOM_ID,
            //         //     message => {
            //         //         console.log(message)
            //         //     },
            //         // )
            //         // stompClient.publish({
            //         //     destination: '/pub/chat/message',
            //         //     body: 'test',
            //         // })
            //     },
            //     debug: str => console.log('stomp: ' + str),
            //     onStompError: frame => {
            //         console.log('stomp error: ', frame)
            //         console.log('details: ', frame.body)
            //     },
            //     reconnectDelay: 10000,
            //     heartbeatIncoming: 4000,
            //     heartbeatOutgoing: 4000,
            // })
            // stompClient.debug = str => {
            //     console.log('STOMP Debug: ', str) // STOMP 디버그 로그 추가
            // }

            var socket = new SockJS('http://192.168.243.182:8080/ws')
            const stompClient = Stomp.over(socket)
            stompClient.connect({}, function (frame: any) {
                console.log('Connected: ' + frame)
                stompClient.subscribe(
                    '/topic/public',
                    function (messageOutput) {
                        console.log(JSON.parse(messageOutput.body))
                    },
                )
            })

            stompClientRef.current = stompClient
            stompClient.activate()
        }

        // const initStompClient = () => {
        //     var socket = new SockJS('')
        //     const stompClient = Stomp.over(socket)
        //     stompClient.connect({}, function (frame: any) {
        //         console.log('Connected: ' + frame)
        //         stompClient.subscribe(
        //             '/topic/public',
        //             function (messageOutput) {
        //                 console.log(JSON.parse(messageOutput.body))
        //             },
        //         )
        //     })
        // }

        initStompClient()

        return () => {
            stompClientRef.current?.deactivate()
        }
    }, [])

    const styles = createStyles(themeColor)

    const onMessageReceived = (message: any) => {
        const payload = JSON.parse(message.body)
        console.log('Message received: ', payload)
        setChatMessages(prevMessages => [...prevMessages, payload.content]) // 새로운 메시지 추가
    }

    // 메시지 전송 함수
    const sendMessage = () => {
        message.trim()
        stompClientRef.current?.publish({
            destination: '/pub/chat/message',
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

export default ChatTest
