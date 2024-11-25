import messaging, {
    FirebaseMessagingTypes,
} from '@react-native-firebase/messaging'
import notifee, { AuthorizationStatus } from '@notifee/react-native'
import { submitFCMDeviceToken } from '@/apis/authService'

const TOPIC_ALL = 'ALL_USER'

const initializeFcm = () => {
    const init = async () => {
        const token = await messaging().getToken()
        submitFCMDeviceToken(token)
        const channelId = await notifee.createChannel({
            id: 'all',
            name: 'All Notifications',
        })

        const displayNotification = async (
            message: FirebaseMessagingTypes.RemoteMessage,
        ) => {
            console.log('message:', message)
            if (message.notification === undefined) return
            await notifee.displayNotification({
                title: message.notification.title,
                body: message.notification.body,
                android: {
                    channelId: channelId,
                    smallIcon: 'ic_launcher',
                },
            })
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
    }

    init()
}

export default initializeFcm
