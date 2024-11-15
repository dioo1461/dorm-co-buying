import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import IcClose from '@/assets/drawable/ic-close.svg'
import IcNotification from '@/assets/drawable/ic-angle-left.svg'
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
import { getAnnouncPost } from '@/apis/boardService'
import Loading from '@/components/Loading'
import Backdrop from '@/components/Backdrop'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const REDUCE_LEN = 100

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

    useEffect(()=>{
        console.log(params)
    })

    {/*
        "content": [{
            "content": "it is content", 
            "createAt": "2024-11-15T09:00:23.719474", 
            "id": 1, 
            "imageUrl": "", 
            "title": "hihi", 
            "updateAt": "2024-11-15T09:00:23.719474"
        }], 
        "empty": false, 
        "first": true, 
        "last": true, 
        "number": 0, 
        "numberOfElements": 1, 
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
        "totalElements": 1, 
        "totalPages": 1
    */}

    const styles = CreateStyles(themeColor)
    const navigation = stackNavigation()

    const announcs = params?.content

    const contentReduced = (content: string) => {
        if(content.length >= REDUCE_LEN)
            return `${content.slice(0, REDUCE_LEN)}...`
        else
            return content
    }

    const goAnnouncPost = (
        title: string,
        content: string,
        id: number
    ) => {
        getAnnouncPost(id)
            .then(res=>{
                navigation.navigate('AnnouncementPost', {title, content, id})
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
                    onPress={() =>
                        goAnnouncPost(
                            item?.title,
                            item?.content,
                            item?.id
                        )
                       /*
                        navigation.navigate('AnnouncementPost', {
                            title: item?.title,
                            content: item?.content,
                            id: params?.id}
                        )   */
                        }
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
                                        {contentReduced(item?.content)}
                                    </Text>
                                </View>
                            </View>
                            {/* ### 이미지 ### 
                            {data.imageUrls.length > 0 ? (
                                <View style={styles.postImage}>
                                    <CachedImage
                                        imageStyle={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: 8,
                                        }}
                                        imageUrl={data.imageUrls[0]}
                                    />
                                </View>
                            ) : (
                                <></>
                            )}  */}
                        </View>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 6,
                            }}>
                            {/* ### 생성일자, 조회수 ### */}
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
        params?.numberOfElements != 0 ? (
        <View>
            <FlatList
                style={styles.announcList}
                data={announcs}
                renderItem={announcFrame}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
        ) : (
            <View>
                <Text>공지사항 없음</Text>
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
    })

export default AnnouncementList