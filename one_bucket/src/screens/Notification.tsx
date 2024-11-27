import { Icolor } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import {
    Dimensions,
    FlatList,
    Image,
    ListRenderItem,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
    View,
} from 'react-native'
import { stackNavigation } from './navigation/NativeStackNavigation'
import useNotificationDB, {
    NotificationColumns,
} from '@/hooks/useDatabase/useNotificationDB'
import IcClose from '@/assets/drawable/ic-close.svg'
import { useEffect, useRef, useState } from 'react'
import { FcmMessageData } from '@/data/response/success/fcm/FcmMessageData'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const RENDER_AMOUNT = 10

const Notification: React.FC = (): React.JSX.Element => {
    const { themeColor, setNewNotificationCount } = useBoundStore(state => ({
        themeColor: state.themeColor,
        setNewNotificationCount: state.setNewNotificationCount,
    }))

    const styles = CreateStyles(themeColor)
    const navigation = stackNavigation()
    const [offset, setOffset] = useState(0)
    const isLoadingMore = useRef<Boolean>(false)
    const [hasMoreNotifications, setHasMoreNotificationsToRender] =
        useState(true)
    const [messageRenderLimit, setMessageRenderLimit] = useState(RENDER_AMOUNT)
    const [messageRenderOffset, setMessageRenderOffset] =
        useState(RENDER_AMOUNT)

    const [notificationList, setNotificationList] = useState<
        NotificationColumns[]
    >([])
    const { getNotifications, deleteNotification } = useNotificationDB()

    useEffect(() => {
        const init = async () => {
            setNotificationList(await getNotifications(10, 0))
            setOffset(10)
            setNewNotificationCount(0)
        }

        init()
    }, [])

    const loadMoreMessages = async () => {
        if (isLoadingMore.current || !hasMoreNotifications) return
        isLoadingMore.current = true

        const moreNotifications = await getNotifications(
            messageRenderLimit,
            messageRenderOffset,
        )
        if (moreNotifications == null || moreNotifications.length == 0) {
            setHasMoreNotificationsToRender(false)
            isLoadingMore.current = false
            return
        }

        setNotificationList([...notificationList, ...moreNotifications])
        setMessageRenderOffset(messageRenderOffset + moreNotifications.length)

        if (moreNotifications.length < messageRenderLimit) {
            // 더 이상 가져올 메시지가 없음
            setHasMoreNotificationsToRender(false)
        } else {
            // 다음 로드를 위해 limit를 늘림
            setMessageRenderLimit(messageRenderLimit * 2)
        }

        isLoadingMore.current = false
    }

    const handleNavigation = (type: FcmMessageData['type'], id: string) => {
        switch (type) {
            case 'CHAT':
                // ChatRoomList를 캐싱하는 로직이 필요함
                // navigation.navigate('Chat', {  })
                break
            case 'COMMENT':
                // boardId가 필요함
                // navigation.navigate('BoardPost', { postId: id })
                break
            case 'TRADE':
                // navigation.navigate('Post', { postId: id })
                break
            case 'ALL':
                // navigation.navigate('Profile', { userId: id })
                break
            case 'WARNING':
                break
        }
    }

    const renderItem: ListRenderItem<NotificationColumns> = ({ item }) => (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
                themeColor.BG_SECONDARY,
                false,
            )}
            onPress={() => {
                handleNavigation(item.type, item.id)
            }}>
            <View style={styles.notif}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/*
                    <IcNotification 
                        style={{ marginEnd: 8 }} 
                        fill='black'a
                    />
                    */}
                    <Image
                        source={require('@/assets/drawable/vector.png')}
                        style={styles.notifIcon}
                    />
                    <View style={styles.notifTitle}>
                        <Text
                            style={{ ...styles.notifText, fontWeight: 'bold' }}>
                            {item.title}
                        </Text>
                        <View style={styles.notifCont}>
                            <Text style={styles.notifText}>{item.content}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableNativeFeedback>
    )

    return (
        <View>
            <FlatList
                style={styles.notifList}
                data={notificationList}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={loadMoreMessages} // 끝에 도달할 때 loadMoreMessages 호출
                onEndReachedThreshold={0.6} // 리스트 끝에서 10% 지점 도달 시 loadMoreMessages 호출
            />
        </View>
    )
}

const CreateStyles = (theme: Icolor) =>
    StyleSheet.create({
        notif: {
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            paddingVertical: 10,
        },
        notifText: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic',
        },
        notifTitle: {
            paddingHorizontal: 20,
        },
        notifCont: {
            justifyContent: 'space-between',
            paddingVertical: 10,
        },
        notifList: {},
        notifIcon: {
            height: 25,
            width: 25,
        },
    })

export default Notification
