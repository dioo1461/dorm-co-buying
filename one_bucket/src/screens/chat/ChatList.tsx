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
                console.log('initial-room-list', event.data)
                setChatRoomData(JSON.parse(event.data))
            }

            initializeSSEConnection()

            return () => {
                console.log('cleanup')
                if (esRef.current) {
                    esRef.current.remove(initialRoomListHandler)
                    esRef.current.close()
                    esRef.current = null
                }
            }
        }, [setChatRoomData]),
    )

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
        console.log(chatRoom.recentMessageTime)

        return (
            <TouchableNativeFeedback
                background={touchableNativeFeedbackBg()}
                onPress={() =>
                    navigation.navigate('Chat', { roomId: chatRoom.roomId })
                }>
                <View style={styles.chatContainer}>
                    <View style={styles.imageContainer}></View>
                    <View>
                        <View style={styles.headerContainer}>
                            <View style={styles.headerFirstContainer}>
                                <Text style={styles.titleText}>
                                    {chatRoom?.roomName}
                                </Text>
                                <Text style={styles.lastChatTimeText}>
                                    {chatRoom.recentMessageTime
                                        ? new Date(chatRoom.recentMessageTime)
                                              .getHours()
                                              .toString()
                                              .padStart(2, '0')
                                        : '방금'}
                                </Text>
                            </View>
                            <View style={styles.headerSecondContainer}></View>
                        </View>
                        <View style={styles.bodyContainer}>
                            <View>
                                {/* {chatRoomList.isMyChat ? (
                                    <View style={{ backgroundColor: 'yellow' }}>
                                        <Text style={styles.lastChatText}>
                                            {chatRoomList.lastChat}
                                        </Text>
                                    </View>
                                ) : (
                                    <View
                                        style={{
                                            backgroundColor: baseColors.GRAY_2,
                                        }}>
                                        <Text style={styles.lastChatText}>
                                            {chatRoomList.lastChat}
                                        </Text>
                                    </View>
                                )} */}
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
        image: {
            width: 80,
            height: 80,
        },
        headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
        },
        headerFirstContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        titleText: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic-Bold',
        },
        lastChatTimeText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
        headerSecondContainer: {
            flexDirection: 'row',
        },
        locationContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        locationText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
        peopleCountContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        peopleCountText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
        bodyContainer: {},
        chatboxContainer: {
            position: 'absolute',
            left: 0,
            top: 0,
        },
        lastChatText: {
            color: theme.TEXT,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
    })

export default ChatList
