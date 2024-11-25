import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import IcClose from '@/assets/drawable/ic-close.svg'
import IcNotification from '@/assets/drawable/ic-angle-left.svg'
import IcNone from '@/assets/drawable/ic-no-announc.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { BoardPostReduced } from '@/data/response/success/board/GetBoardPostListResponse'
import { useEffect, useRef, useState } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import {
    Animated,
    Appearance,
    Dimensions,
    FlatList,
    Image,
    ListRenderItem,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native'
import { formatTimeAgo } from '@/utils/formatUtils'
import {
    RootStackParamList,
    stackNavigation,
} from '../navigation/NativeStackNavigation'
import { getAnnouncPostList, getAnnouncPost } from '@/apis/boardService'
import { CachedImage } from '@/components/CachedImage'
import Loading from '@/components/Loading'
import Backdrop from '@/components/Backdrop'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const AnnouncementList: React.FC = (): React.JSX.Element => {
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

    type AnnouncementListRouteProp = RouteProp<RootStackParamList, 'AnnouncementList'>
    const { params } = useRoute< AnnouncementListRouteProp>()

    useEffect(()=>{ console.log("AnnouncementList params:", params) })

    {/*
        AnnouncementList params: 
        {
            "content": [
                {"content": "중상혁입니다.", "createAt": "2024-11-18T08:21:37.80559", "id": 8, "imageUrl": "", "title": "중상혁", "updateAt": "2024-11-18T08:21:37.80559"}, 
                {"content": "중상혁입니다.", "createAt": "2024-11-18T08:22:37.322689", "id": 9, "imageUrl": "", "title": "중상혁", "updateAt": "2024-11-18T08:22:37.322689"}, 
                {"content": "중상혁입니다.", "createAt": "2024-11-18T08:23:00.141414", "id": 10, "imageUrl": "", "title": "중상혁", "updateAt": "2024-11-18T08:23:00.141414"}, 
                {"content": "대대상혁입니다.", "createAt": "2024-11-18T08:43:33.641007", "id": 11, "imageUrl": "one-bucket/announcement/images/KakaoTalk_20240515_172347068.jpg", "title": "대대상혁", "updateAt": "2024-11-18T08:43:33.641007"}, 
                {"content": "대대상혁입니다.", "createAt": "2024-11-18T08:51:56.975053", "id": 12, "imageUrl": "one-bucket/announcement/images/KakaoTalk_20240515_172347068.jpg", "title": "대대상혁", "updateAt": "2024-11-18T08:51:56.975053"}, 
                {"content": "대대상혁입니다.", "createAt": "2024-11-18T08:52:18.82503", "id": 13, "imageUrl": "one-bucket/announcement/images/KakaoTalk_20240515_172347068.jpg", "title": "대대상혁", "updateAt": "2024-11-18T08:52:18.82503"}, 
                {"content": "대대상혁입니다.", "createAt": "2024-11-18T08:53:15.909428", "id": 14, "imageUrl": "one-bucket/announcement/images/KakaoTalk_20240515_172347068.jpg", "title": "대대상혁", "updateAt": "2024-11-18T08:53:15.909428"}, 
                {"content": "대대상혁입니다.", "createAt": "2024-11-18T09:11:17.014847", "id": 15, "imageUrl": "one-bucket/announcement/images/KakaoTalk_20240515_172347068.jpg", "title": "대대상혁", "updateAt": "2024-11-18T09:11:17.014847"}
            ], 
            "empty": false, 
            "first": true, 
            "last": true, 
            "number": 0, 
            "numberOfElements": 8, 
            "pageable": {
                "offset": 0, 
                "pageNumber": 0, 
                "pageSize": 20, 
                "paged": true, 
                "sort": {
                    "empty": true, 
                    "sorted": false, 
                    "unsorted": true
                }, 
                "unpaged": false
            }, 
            "size": 20, 
            "sort": {
                "empty": true, 
                "sorted": false, 
                "unsorted": true
            }, 
            "totalElements": 8, 
            "totalPages": 1
        }
    */}

    const styles = CreateStyles(themeColor)
    const navigation = stackNavigation()

    const announcs = params?.content.reverse()

    const goAnnouncPost = ( id: number ) => {
        getAnnouncPost(id)
            .then(res=>{
                navigation.navigate('AnnouncementPost', {res}
                )
            })
            .catch(err=>{
                console.log('getAnnouncPostList: ', err)
            })
    }

    const announcFrame = ({ item }: { item: any }) => (
        <View>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(
                            themeColor.BG_SECONDARY,
                            false,
                    )}
                    onPress={() =>goAnnouncPost(item?.id)}
                    >
                    <View
                        style={{
                            marginHorizontal: 10,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                        }}>
                        <View style={{ flexDirection: 'row', margin: 4 }}>
                            <View style={{ flex: 1, marginEnd: 10 }}>
                                {/* ### 제목 ### */}
                                <View
                                    style={{
                                        // marginTop: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text
                                        style={styles.postTitle}
                                        ellipsizeMode='tail'
                                        numberOfLines={1}>
                                        {item?.title}
                                    </Text>
                                </View>
                                {/* ### 내용 ### */}
                                <View
                                    style={{
                                        marginTop: 16,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text
                                        numberOfLines={2}
                                        ellipsizeMode='tail'
                                        style={styles.postContentText}>
                                        {item?.content}
                                    </Text>
                                </View>
                            </View>
                            {/* ### 이미지 ### */}
                            {item?.imageUrl.length > 0 ? (
                                <View style={styles.postImage}>
                                    <CachedImage
                                        imageStyle={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: 8,
                                        }}
                                        imageUrl={item?.imageUrl}
                                    />
                                </View>
                            ) : (
                                <></>
                            )}  
                        </View>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 6,
                            }}>
                            {/* ### 생성일자 ### */}
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                <Text style={styles.postMetaDataText}>
                                    {`${formatTimeAgo(
                                        item?.createAt,
                                    )}`}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <View style={styles.line} />
            </View>
    )

    return (
        !params?.empty ? (
        <View>
            <FlatList
                style={styles.announcList}
                data={announcs}
                renderItem={announcFrame}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
        ) : (
            <View style={styles.container2}>
                <IcNone />
                <Text style={{fontSize: 20, textAlign: 'center'}}>
                    공지사항이 없습니다.
                </Text>
            </View>
        )
    )
}

const CreateStyles = (theme: Icolor) =>
    StyleSheet.create({
        announc: {
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            paddingVertical: 10,
        },
        announcText: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic',
        },
        announcTitle:{
            paddingHorizontal: 20,
        },
        announcCont:{
            justifyContent: 'space-between',
            paddingVertical: 10,
        },
        announcList:{

        },
        announcIcon:{
            height: 25,
            width: 25,
        },
        //
        container: { flex: 1 },
        flatList: {
            flex: 11,
        },
        boardTypeContainer: {
            marginTop: 4,
            padding: 20,
        },
        boardTypeLabel: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic-Bold',
        },
        boardTypeToggleButton: {
            position: 'absolute',
            top: 14,
            right: 14,
            padding: 6,
            borderRadius: 10,
            zIndex: 2,
            backgroundColor:
                theme === lightColors ? baseColors.WHITE : baseColors.GRAY_2,
        },
        boardTypeSelectionWrapper: {
            position: 'absolute',
            top: 60,
            right: 14,
            width: 160,
            borderRadius: 10,
            backgroundColor:
                theme === lightColors ? baseColors.WHITE : baseColors.GRAY_2,
            elevation: 4,
            zIndex: 2,
        },
        boardTypeSelectionContainer: {
            maxHeight: 200,
        },
        boardTypeSelectionContent: {
            paddingVertical: 5,
        },
        boardTypeItem: {
            paddingVertical: 12,
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        boardTypeText: {
            fontSize: 14,
            color: theme === lightColors ? theme.TEXT_SECONDARY : theme.TEXT,
            fontFamily: 'NanumGothic',
        },
        boardTypeTextActive: {
            color: baseColors.SCHOOL_BG,
            fontFamily: 'NanumGothic-Bold',
        },
        postContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 10,
            paddingStart: 6,
        },
        postImage: {
            width: 72,
            height: 72,
            borderRadius: 10,
        },
        postContentContainer: {
            flex: 6,
            marginStart: 24,
            marginEnd: 10,
            marginTop: 6,
            flexDirection: 'row',
        },
        line: {
            borderBottomWidth: 1,
            borderBottomColor:
                theme === lightColors ? baseColors.GRAY_3 : baseColors.GRAY_1,
            marginHorizontal: 10,
        },
        postTitle: {
            color: theme.TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic-Bold',
        },
        postContentText: {
            color: theme.TEXT,
            fontSize: 13,
            fontFamily: 'NanumGothic',
            lineHeight: 18,
        },
        postMetaDataText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
        postlikeCountText: {
            color: baseColors.LIGHT_RED,
            fontSize: 12,
            fontFamily: 'NanumGothic-Bold',
        },
        postCommentCountText: {
            color: baseColors.LIGHT_BLUE,
            fontSize: 12,
            fontFamily: 'NanumGothic-Bold',
        },
        fab: {
            backgroundColor: theme.BUTTON_BG,
            position: 'absolute',
            width: 56,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
            right: 25,
            bottom: 70,
            borderRadius: 30,
            elevation: 8,
        },
        fabIcon: {
            fontSize: 40,
            color: theme.BUTTON_TEXT,
        },
        container2:{
            backgroundColor: theme.BG,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
    })

export default AnnouncementList