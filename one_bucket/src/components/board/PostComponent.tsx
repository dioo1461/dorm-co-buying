import IcComment from '@/assets/drawable/ic-comment.svg'
import IcLikes from '@/assets/drawable/ic-thumb-up.svg'
import { CachedImage } from '@/components/CachedImage'
import { baseColors, Icolor, lightColors } from '@/constants/colors'
import { BoardPostReduced } from '@/data/response/success/board/GetBoardPostListResponse'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import { formatTimeAgo } from '@/utils/formatUtils'
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'

const PostComponent: React.FC<{ data: BoardPostReduced }> = ({
    data,
}): JSX.Element => {
    const { themeColor, getBoardNameById } = useBoundStore(state => ({
        themeColor: state.themeColor,
        getBoardNameById: state.getBoardNameById,
    }))

    const styles = createStyles(themeColor)
    const navigation = stackNavigation()

    const touchableNativeFeedbackBg = () => {
        return TouchableNativeFeedback.Ripple(
            themeColor === lightColors ? baseColors.GRAY_3 : baseColors.GRAY_1,
            false,
        )
    }

    return (
        <View>
            <TouchableNativeFeedback
                background={touchableNativeFeedbackBg()}
                onPress={() =>
                    navigation.navigate('BoardPost', {
                        boardId: data.boardId,
                        boardName: getBoardNameById(data.boardId) ?? '',
                        postId: data.postId,
                        performRefresh: false,
                    })
                }>
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
                                    {data.title}
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
                                    {data.text}
                                </Text>
                            </View>
                        </View>
                        {/* ### 이미지 ### */}
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
                        )}
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
                                {`${formatTimeAgo(data.createdDate)}ㆍ조회 ${
                                    data.views
                                }`}
                            </Text>
                        </View>
                        {/* ### 추천수, 댓글 ### */}
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'flex-end',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            <IcLikes />
                            <Text
                                style={[
                                    styles.postlikeCountText,
                                    { marginStart: 1, marginEnd: 6 },
                                ]}>
                                {data.likes}
                            </Text>
                            <IcComment />
                            <Text
                                style={[
                                    styles.postCommentCountText,
                                    { marginStart: 2 },
                                ]}>
                                {data.commentsCount ?? 0}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
            <View style={styles.line} />
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
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
    })

export default PostComponent
