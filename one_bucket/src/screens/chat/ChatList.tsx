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

    type esEventType = 'initial-room-list'

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
                    },
                    debug: true,
                })
                esRef.current = eventSource
            }

            const initialRoomListHandler = (event: SSEMessage) => {
                setChatRoomData(JSON.parse(event.data))
            }

            initializeSSEConnection()

            return () => {
                if (esRef.current) {
                    esRef.current.remove(initialRoomListHandler)
                    esRef.current.close()
                    esRef.current = null
                }
            }
        }, [setChatRoomData]),
    )

    const formatRecentMessageTime = (time: Date) => {
        const now = new Date()
        const diff = now.getTime() - time.getTime()

        const diffMinutes = Math.floor(diff / 1000 / 60)
        if (diffMinutes < 1) return '방금'

        const diffHours = Math.floor(diffMinutes / 60)
        if (diffHours < 24) {
            const hour = time.getHours()
            const minute = time.getMinutes().toString().padStart(2, '0')
            const period = hour < 12 ? '오전' : '오후'
            const formattedHour = (hour % 12 || 12).toString() // 12시간제, 0시는 12로 표시
            return `${period} ${formattedHour}:${minute}`
        }

        const diffDays = Math.floor(diffHours / 24)
        if (diffDays < 2) return '어제'
        if (diffDays < 3) return '이틀 전'
        if (diffDays < 7) return `${diffDays}일 전`

        // 해당 연도인지 확인
        const isCurrentYear = time.getFullYear() === now.getFullYear()
        if (isCurrentYear) {
            return `${time.getMonth() + 1}월 ${time.getDate()}일` // 해당 연도 내에서는 월, 일로 표시
        }

        // 연도가 다르면 YYYY.MM.DD 형식으로 표시
        return `${time.getFullYear()}.${(time.getMonth() + 1)
            .toString()
            .padStart(2, '0')}.${time.getDate().toString().padStart(2, '0')}`
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
                                        '새로운 메시지가 없습니다'}
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
            fontSize: 16,
            fontFamily: 'NanumGothic-Bold',
            flex: 1, // 남은 공간을 차지하도록 설정
            paddingRight: 8,
        },
        lastChatTimeText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 12,
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
            color: theme.TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
        noMessageText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
    })

export default ChatList
