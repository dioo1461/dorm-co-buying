import { FcmMessageData } from '@/data/response/success/fcm/FcmMessageData'
import notifee, {
    AndroidImportance,
    AndroidVisibility,
    AuthorizationStatus,
} from '@notifee/react-native'
import messaging, {
    FirebaseMessagingTypes,
} from '@react-native-firebase/messaging'

const TOPIC_ALL = 'ALL_USER'

const initializeFcm = () => {
    const init = async () => {
        const channelIdAll = await notifee.createChannel({
            id: 'all',
            name: 'All Notifications',
        })

        const displayNotification = async (
            message: FirebaseMessagingTypes.RemoteMessage,
        ) => {
            console.log('message:', message)
            if (message.data === undefined) {
                console.log('FCM - message.data is undefined')
                return
            }
            const data = message.data as unknown as FcmMessageData

            const channelId = data.type
            var notificationId = undefined
            var importance
            var visibility

            switch (data.type) {
                case 'CHAT':
                    notificationId = 'chat-' + data.id
                    break
                case 'COMMENT':
                    notificationId = 'comment-' + data.id
                    break
                case 'TRADE':
                    notificationId = 'trade-' + data.id
                    break
                case 'ALL':
                    break
                case 'WARNING':
                    break
            }

            if (notificationId) {
                notifee.displayNotification({
                    id: notificationId,
                    title: data.title as string,
                    body: data.body as string,
                    android: {
                        channelId: channelIdAll,
                        smallIcon: 'ic_launcher',
                        // groupId: groupId ?? undefined,
                        importance: AndroidImportance.HIGH,
                        visibility: AndroidVisibility.PUBLIC,
                    },
                })
            } else {
                notifee.displayNotification({
                    title: data.title as string,
                    body: data.body as string,
                    android: {
                        channelId: channelIdAll,
                        smallIcon: 'ic_launcher',
                        // groupId: groupId ?? undefined,
                        importance: AndroidImportance.HIGH,
                        visibility: AndroidVisibility.PUBLIC,
                    },
                })
            }
        }

        const requestNotificationPermission = async () => {
            // 사용자에게 알림 권한 허용을 요청한다, 설정된 권한 상태를 반환한다
            const settings = await notifee.requestPermission()

            // 권한 상태는 settings.authorizationStatus로 확인할 수 있다
            if (settings.authorizationStatus >= AuthorizationStatus.DENIED) {
                return true
            } else return false
        }

        const notificationHandler = async (
            remoteMessage: FirebaseMessagingTypes.RemoteMessage,
        ) => {
            console.log(remoteMessage)
            displayNotification(remoteMessage)
        }

        const backgroundMessageHandler = async (
            remoteMessage: FirebaseMessagingTypes.RemoteMessage,
        ) => {
            displayNotification(remoteMessage)
        }

        // ########### MAIN ###########

        requestNotificationPermission()
        messaging().subscribeToTopic(TOPIC_ALL)
        messaging().onMessage(() => {
            console.log('onMessage')
        })
        messaging().setBackgroundMessageHandler(backgroundMessageHandler)
    }

    init()
}

export default initializeFcm
