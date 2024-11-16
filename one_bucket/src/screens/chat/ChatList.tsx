import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import {
    ChatRoom,
    GetChatRoomListResponse,
} from '@/data/response/success/chat/GetChatRoomListResponse'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { createSSEConnection } from '@/utils/sseFactory'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
    Appearance,
    FlatList,
    ListRenderItem,
    StyleSheet,
    TouchableNativeFeedback,
    View,
} from 'react-native'
import { Text } from 'react-native-elements'
import EventSource, { SSEMessage } from 'react-native-oksse'
import { stackNavigation } from '../navigation/NativeStackNavigation'
import { getAccessToken } from '@/utils/accessTokenUtils'
import { useFocusEffect } from '@react-navigation/native'
import { convertToKoreanTime } from '@/utils/dateUtils'
import { SseRoomUpdateBody } from '@/data/response/success/chat/SseRoomUpdateBody'

const ChatList: React.FC = (): React.JSX.Element => {
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

    const styles = createStyles(themeColor)
    const navigation = stackNavigation()

    type esEventType = 'initial-room-list' | 'room-update'

    const esRef = useRef<EventSource<esEventType> | null>(null)
    const [chatRoomList, setChatRoomData] =
        useState<GetChatRoomListResponse | null>(null)

    useFocusEffect(
        useCallback(() => {
            const initializeSSEConnection = async () => {
                if (esRef.current) return // 이미 연결이 있다면 중복 연결 방지
                const eventSource = await createSSEConnection({
                    endpoint: '/chat/sse/chatList',
                    options: {
                        headers: {
                            Authorization: `Bearer ${await getAccessToken()}`,
                        },
                    },
                    eventHandlers: {
                        'initial-room-list': initialRoomListHandler,
                        'room-update': roomUpdateHandler,
                    },
                    debug: true,
                })
                esRef.current = eventSource
            }

            const initialRoomListHandler = (event: SSEMessage) => {
                const data = JSON.parse(event.data) as GetChatRoomListResponse
                const sortedData = data.sort((a: ChatRoom, b: ChatRoom) => {
                    const dateA = new Date(a.recentMessageTime).getTime()
                    const dateB = new Date(b.recentMessageTime).getTime()
                    return dateB - dateA
                })
                setChatRoomData(sortedData)
            }

            const roomUpdateHandler = (event: SSEMessage) => {
                const data = JSON.parse(event.data) as SseRoomUpdateBody
                const staleRoom = chatRoomList?.find(
                    room => room.roomId === data.roomId,
                )
                if (!chatRoomList) return
                if (!staleRoom) {
                    console.log(
                        'room-update received but no matching room found, is incorrect behavior',
                    )
                    return
                }
                staleRoom.recentMessage = data.recentMessage
                staleRoom.recentMessageTime = new Date(data.recentMessageTime)
                setChatRoomData([...chatRoomList])
                console.log('room-update received')
            }

            initializeSSEConnection()

            return () => {
                if (esRef.current) {
                    esRef.current.remove(initialRoomListHandler)
                    esRef.current.remove(roomUpdateHandler)
                    esRef.current.close()
                    esRef.current = null
                }
            }
        }, [setChatRoomData]),
    )

    const formatRecentMessageTime = (utcTime: Date) => {
        const now = convertToKoreanTime(new Date())

        const diff = now.getTime() - utcTime.getTime()

        const diffMinutes = Math.floor(diff / 1000 / 60)
        if (diffMinutes < 1) return '방금'

        const diffHours = Math.floor(diffMinutes / 60)
        if (diffHours < 24) {
            const hour = utcTime.getHours()
            const minute = utcTime.getMinutes().toString().padStart(2, '0')
            const period = hour < 12 ? '오전' : '오후'
            const formattedHour = (hour % 12 || 12).toString() // 12시간제, 0시는 12로 표시
            return `${period} ${formattedHour}:${minute}`
        }

        const diffDays = Math.floor(diffHours / 24)
        if (diffDays < 2) return '어제'
        if (diffDays < 3) return '이틀 전'
        if (diffDays < 7) return `${diffDays}일 전`

        // 해당 연도인지 확인
        const isCurrentYear = utcTime.getFullYear() === now.getFullYear()
        if (isCurrentYear) {
            return `${utcTime.getMonth() + 1}월 ${utcTime.getDate()}일` // 해당 연도 내에서는 월, 일로 표시
        }

        // 연도가 다르면 YYYY.MM.DD 형식으로 표시
        return `${utcTime.getFullYear()}.${(utcTime.getMonth() + 1)
            .toString()
            .padStart(2, '0')}.${utcTime.getDate().toString().padStart(2, '0')}`
    }

    const flatlistRef = useRef<FlatList>(null)

    const FlatlistHeader = () => <View></View>

    const touchableNativeFeedbackBg = () => {
        return TouchableNativeFeedback.Ripple(
            themeColor === lightColors ? baseColors.GRAY_3 : baseColors.GRAY_1,
            false,
        )
    }

    const ChatItem = (chatRoom: ChatRoom) => {
        const styles = createChatitemStyles(themeColor)

        return (
            <TouchableNativeFeedback
                background={touchableNativeFeedbackBg()}
                onPress={() => navigation.navigate('Chat', chatRoom)}>
                <View style={styles.chatContainer}>
                    {/* ### 채팅 이미지 ### */}
                    <View style={styles.imageContainer}></View>
                    <View style={{ flex: 1 }}>
                        <View style={styles.headerContainer}>
                            <View style={styles.headerFirstContainer}>
                                <Text style={styles.titleText}>
                                    {chatRoom?.roomName}
                                </Text>
                                <Text style={styles.lastChatTimeText}>
                                    {chatRoom.recentMessageTime
                                        ? formatRecentMessageTime(
                                              new Date(
                                                  chatRoom.recentMessageTime,
                                              ),
                                          )
                                        : '방금'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.bodyContainer}>
                            <View style={styles.recentMessageContainer}>
                                <Text
                                    style={
                                        chatRoom.recentMessage
                                            ? styles.recentMessageText
                                            : styles.noMessageText
                                    }
                                    numberOfLines={1} // 한 줄만 표시하고 넘치면 말줄임
                                    ellipsizeMode='tail' // 넘칠 때 ... 처리
                                >
                                    {chatRoom.recentMessage ||
                                        '첫 메시지를 남겨보세요!'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
        )
    }

    const renderItem: ListRenderItem<ChatRoom> = ({ item }) => (
        <ChatItem {...item} />
    )

    // if (error) return <Text>Error...</Text>

    // if (isLoading)
    // return (
    //     <View
    //         style={{
    //             backgroundColor: themeColor.BG,
    //             flex: 1,
    //             justifyContent: 'center',
    //             alignItems: 'center',
    //         }}>
    //         <ActivityIndicator
    //             size='large'
    //             color={
    //                 themeColor === lightColors
    //                     ? baseColors.SCHOOL_BG
    //                     : baseColors.GRAY_2
    //             }
    //         />
    //     </View>
    // )

    return (
        <View style={styles.container}>
            <FlatList
                // ListHeaderComponent={FlatlistHeader}
                ref={flatlistRef}
                data={chatRoomList ?? []}
                renderItem={renderItem}
                keyExtractor={item => item.roomId.toString()}
            />
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.BG,
        },
    })

const createChatitemStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: theme.BG,
        },
        chatContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 6,
        },
        imageContainer: {
            width: 80,
            height: 80,
            backgroundColor: 'white',
            borderRadius: 40,
        },
        headerContainer: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
        },
        headerFirstContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        titleText: {
            color: theme.TEXT,
            fontSize: 15,
            fontFamily: 'NanumGothic-Bold',
            flex: 1, // 남은 공간을 차지하도록 설정
            paddingRight: 8,
        },
        lastChatTimeText: {
            color: theme.TEXT_TERTIARY,
            fontSize: 10,
            fontFamily: 'NanumGothic',
            paddingLeft: 8,
        },
        bodyContainer: {
            flex: 1,
            paddingHorizontal: 16,
            paddingBottom: 6,
        },
        recentMessageContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        recentMessageText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
        noMessageText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
    })

export default ChatList
