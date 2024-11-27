import { FcmMessageData } from '@/data/response/success/fcm/FcmMessageData'
import notifee, {
    AndroidImportance,
    AndroidVisibility,
    AuthorizationStatus,
    EventType,
} from '@notifee/react-native'
import messaging, {
    FirebaseMessagingTypes,
} from '@react-native-firebase/messaging'
import {
    getGlobalChatNotificationEnabled,
    getGlobalCommentNotificationEnabled,
    getPostNotificationEnabled,
} from './asyncStorageUtils'
import { openDatabase } from 'react-native-sqlite-storage'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { Linking } from 'react-native'

const TOPIC_ALL = 'ALL_USER'

const initializeFcm = async () => {
    const init = async () => {
        const channelIdAll = await notifee.createChannel({
            id: 'all',
            name: 'All Notifications',
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
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
            var deepLink = 'app://'
            var notificationId = undefined

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
                    },
                    data: {
                        link: 'app://board/12345', // Deep Linking URL 설정
                    },
                })
            } else {
                notifee.displayNotification({
                    title: data.title as string,
                    body: data.body as string,
                    android: {
                        channelId: channelIdAll,
                        smallIcon: 'ic_launcher',
                    },
                    data: {
                        link: deepLink, // Deep Linking URL 설정
                    },
                })
            }
        }

        const requestNotificationPermission = async () => {
            const settings = await notifee.requestPermission()
            if (settings.authorizationStatus >= AuthorizationStatus.DENIED) {
                return true
            } else return false
        }

        const addToDB = async (data: FcmMessageData) => {
            openDatabase(
                { name: 'database.db', location: 'default' },
                DB => {
                    console.log('[notificationDB] Database opened')
                    DB.transaction(
                        tx => {
                            // notification 테이블 생성 (없으면 생성)
                            tx.executeSql(
                                `CREATE TABLE IF NOT EXISTS notification (
                                    tupleId INTEGER PRIMARY KEY AUTOINCREMENT,
                                    title TEXT,
                                    content TEXT,
                                    type TEXT,
                                    id TEXT
                                );`,
                                [],
                                () => {
                                    console.log(
                                        '[notificationDB] Table created or already exists',
                                    )

                                    // notification 테이블에 데이터 삽입
                                    tx.executeSql(
                                        `INSERT INTO notification (id, title, content, type) VALUES (?, ?, ?, ?)`,
                                        [
                                            data.id,
                                            data.title,
                                            data.body,
                                            data.type,
                                        ],
                                        (tx, results) => {
                                            console.log(
                                                '[notificationDB] Notification inserted',
                                            )
                                        },
                                        error => {
                                            console.log(
                                                '[notificationDB] Error inserting notification:',
                                                error,
                                            )
                                        },
                                    )
                                },
                                error => {
                                    console.log(
                                        '[notificationDB] Error creating table:',
                                        error,
                                    )
                                },
                            )
                        },
                        error => {
                            console.log(
                                '[notificationDB] Transaction error:',
                                error,
                            )
                        },
                    )
                },
                error => {
                    console.log(
                        '[notificationDB] Error opening database:',
                        error,
                    )
                },
            )
        }

        const checkWouldDisplayNotification = async (
            data: FcmMessageData,
        ): Promise<boolean> => {
            switch (data.type) {
                case 'CHAT':
                    if (!(await getGlobalChatNotificationEnabled()))
                        return false
                    break
                case 'COMMENT':
                    const [global, local] = await Promise.all([
                        getGlobalCommentNotificationEnabled(),
                        getPostNotificationEnabled(data.id),
                    ])
                    if (!global || !local) return false
                    break
                case 'TRADE':
                    break
                case 'ALL':
                    break
                case 'WARNING':
                    break
            }
            return true
        }

        const checkWouldAddToDB = async (
            data: FcmMessageData,
        ): Promise<boolean> => {
            switch (data.type) {
                case 'CHAT':
                    return false
                case 'COMMENT':
                    return true
                case 'TRADE':
                    return true
                case 'ALL':
                    return true
                case 'WARNING':
                    return false
            }
        }

        const foregroundHandler = async (
            remoteMessage: FirebaseMessagingTypes.RemoteMessage,
        ) => {
            useBoundStore.getState().increaseNewNotificationCount()
            const data = remoteMessage.data as unknown as FcmMessageData
            const [addFlag] = await Promise.all([checkWouldAddToDB(data)])

            if (addFlag) {
                useBoundStore.getState().increaseNewNotificationCount()
                addToDB(data)
            }
        }

        const backgroundHandler = async (
            remoteMessage: FirebaseMessagingTypes.RemoteMessage,
        ) => {
            useBoundStore.getState().increaseNewNotificationCount()
            const data = remoteMessage.data as unknown as FcmMessageData
            const [displayFlag, addFlag] = await Promise.all([
                checkWouldDisplayNotification(data),
                checkWouldAddToDB(data),
            ])

            if (addFlag) {
                useBoundStore.getState().increaseNewNotificationCount()
                addToDB(data)
            }
            if (displayFlag) displayNotification(remoteMessage)
        }

        // ########### MAIN ###########

        requestNotificationPermission()
        messaging().subscribeToTopic(TOPIC_ALL)
        messaging().onMessage(foregroundHandler)
        messaging().setBackgroundMessageHandler(backgroundHandler)
        notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.PRESS) {
                console.log('Notification Pressed:', detail.notification)
                const link = detail.notification?.data?.link as string // 알림의 데이터에서 Deep Linking URL 가져오기
                if (link) {
                    Linking.openURL(link) // Deep Linking URL로 이동
                }
            }
        })

        // Background 알림 이벤트 처리
        notifee.onBackgroundEvent(async ({ type, detail }) => {
            if (type === EventType.PRESS) {
                console.log(
                    'Notification Pressed in Background:',
                    detail.notification,
                )
                const link = detail.notification?.data?.link as string
                if (link) {
                    Linking.openURL(link)
                }
            }
        })
    }

    init()
}

export default initializeFcm
