import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { useEffect, useRef } from 'react'
import {
    Appearance,
    FlatList,
    ListRenderItem,
    StyleSheet,
    TouchableNativeFeedback,
    View,
} from 'react-native'
import { Text } from 'react-native-elements'
import { stackNavigation } from '../navigation/NativeStackNavigation'

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

    const flatlistRef = useRef<FlatList>(null)

    type ChatItemProps = {
        id: number
        title: string
        isMyChat: boolean
        lastChat: string
        lastChatTime: Date
        location: string
        peopleCount: number
    }

    const tempChats: ChatItemProps[] = [
        {
            id: 1,
            title: 'title',
            isMyChat: true,
            lastChat: 'lastChat',
            lastChatTime: new Date(),
            location: 'location',
            peopleCount: 1,
        },
        {
            id: 2,
            title: 'title2',
            isMyChat: false,
            lastChat: 'lastChat2',
            lastChatTime: new Date(),
            location: 'location2',
            peopleCount: 2,
        },
        {
            id: 3,
            title: 'title3',
            isMyChat: false,
            lastChat: 'lastChat3',
            lastChatTime: new Date(),
            location: 'location3',
            peopleCount: 3,
        },
        {
            id: 4,
            title: 'title4',
            isMyChat: true,
            lastChat: 'lastChat4',
            lastChatTime: new Date(),
            location: 'location4',
            peopleCount: 4,
        },
        {
            id: 5,
            title: 'title5',
            isMyChat: true,
            lastChat: 'lastChat5',
            lastChatTime: new Date(),
            location: 'location5',
            peopleCount: 5,
        },
    ]

    const FlatlistHeader = () => <View></View>

    const touchableNativeFeedbackBg = () => {
        return TouchableNativeFeedback.Ripple(
            themeColor === lightColors ? baseColors.GRAY_3 : baseColors.GRAY_1,
            false,
        )
    }

    const ChatItem = (data: ChatItemProps) => {
        const styles = createChatitemStyles(themeColor)

        return (
            <TouchableNativeFeedback
                background={touchableNativeFeedbackBg()}
                onPress={() => navigation.navigate('Chat')}>
                <View style={styles.container}>
                    <View style={styles.imageContainer}></View>
                    <View>
                        <View style={styles.headerContainer}>
                            <View style={styles.headerFirstContainer}>
                                <Text style={styles.titleText}>
                                    {data.title}
                                </Text>
                                <Text style={styles.lastChatTimeText}>
                                    {data.lastChatTime
                                        .getHours()
                                        .toString()
                                        .padStart(2, '0')}
                                    :
                                    {data.lastChatTime
                                        .getMinutes()
                                        .toString()
                                        .padStart(2, '0')}
                                </Text>
                            </View>
                            <View style={styles.headerSecondContainer}></View>
                        </View>
                        <View style={styles.bodyContainer}>
                            <View>
                                {data.isMyChat ? (
                                    <View style={{ backgroundColor: 'yellow' }}>
                                        <Text style={styles.lastChatText}>
                                            {data.lastChat}
                                        </Text>
                                    </View>
                                ) : (
                                    <View
                                        style={{
                                            backgroundColor: baseColors.GRAY_2,
                                        }}>
                                        <Text style={styles.lastChatText}>
                                            {data.lastChat}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
        )
    }

    const renderItem: ListRenderItem<ChatItemProps> = ({ item }) => (
        <ChatItem {...item} />
    )

    return (
        <View style={styles.container}>
            <FlatList
                // ListHeaderComponent={FlatlistHeader}
                showsVerticalScrollIndicator={false}
                ref={flatlistRef}
                data={tempChats}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
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
