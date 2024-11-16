import IcComment from '@/assets/drawable/ic-comment.svg'
import IcReply from '@/assets/drawable/ic-reply.svg'
import IcOthers from '@/assets/drawable/ic-others.svg'
import { baseColors, Icolor } from '@/constants/colors'
import { IComment } from '@/data/response/success/board/GetBoardPostResponse'
import React, { useEffect, useRef } from 'react'
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

const Comment: React.FC<{
    theme: Icolor
    data: IComment
    isReply: boolean
    parentCommentId: number
    setParentCommentId: (id: number) => void
    highlight: boolean
    onReplyButtonPress?: (data: IComment) => void
    onOptionButtonPress?: (data: IComment) => void
}> = ({
    theme,
    data,
    isReply,
    parentCommentId,
    setParentCommentId,
    highlight,
    onReplyButtonPress,
    onOptionButtonPress,
}): JSX.Element => {
    const animation = useRef(new Animated.Value(0)).current

    // TODO: 하이라이트 Fade-out 구현

    const styles = createStyles(theme)

    const replyAnimatedStyle = {
        opacity: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        }),
    }

    const replyIcon = (isReply: boolean) => {
        if(isReply) return <IcReply />
    }
    const commentLine = (isReply: boolean) => {
        if(!isReply) return <View style={styles.line} />
    }

    useEffect(() => {
        Animated.timing(animation, {
            toValue: highlight ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start()
    }, [highlight])

    return (
        <View style={{paddingBottom: 8}}>
            {commentLine(isReply)} 
            <View style={{flexDirection: 'row'}}>
                {replyIcon(isReply)}
                <Animated.View
                    style={[styles.commentHighlight, replyAnimatedStyle]}
                />
                <View style={
                    !isReply
                        ? styles.commentContainer
                        : styles.replyCommentContainer
                }>
                    <View style={styles.commentHeader}>
                        {/* ### 프로필 이미지 ### */}
                        <View style={styles.commentProfileImage}></View>
                        {/* ### 닉네임 ### */}
                        <View style={styles.commentNicknameContainer}>
                            <Text style={styles.commentNicknameText}>
                                {data.authorNickname}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={{ position: 'relative', top: -8 }}
                            onPress={() =>
                                onOptionButtonPress && onOptionButtonPress(data)
                            }>
                            <IcOthers fill='gray' />
                        </TouchableOpacity>
                    </View>
                    {/* ### 댓글 본문 ### */}
                    <View style={styles.commentBody}>
                        <Text style={styles.commentBodyText}>{data.text}</Text>
                    </View>
                    <View style={styles.commentFooter}>
                        <View style={styles.commentTime}>
                            <Text style={styles.commentTimeText}>9/01 13:32</Text>
                        </View>
                        <View style={styles.commentActions}>
                            {/* ### 답글 달기 버튼 ### */}
                            {!isReply && (
                                <TouchableOpacity
                                    style={styles.commentActionButton}
                                    onPress={() => {
                                        onReplyButtonPress && onReplyButtonPress(data)

                                        if (parentCommentId === data.commentId) {
                                            setParentCommentId(-1)
                                        } else {
                                            setParentCommentId(data.commentId)
                                        }
                                    }}>
                                    <IcComment />
                                    <Text
                                        style={[
                                            styles.commentActionText,
                                            { color: baseColors.LIGHT_BLUE },
                                        ]}>
                                        답글 달기
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        commentContainer: {
            flex: 1,
            paddingVertical: 2,
            marginBottom: 2,
        },
        replyCommentContainer: {
            flex: 1,
            marginStart: 8,
            paddingTop: 8,
            paddingBottom: 20,
            backgroundColor: theme.BG_SECONDARY,
            borderRadius: 8,
            marginBottom: 2,
        },
        commentHighlight: {
            backgroundColor: baseColors.GRAY_3,
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            borderRadius: 8,
        },
        commentHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        commentProfileImage: {
            backgroundColor: 'white',
            width: 40,
            height: 40,
            margin: 6,
        },
        commentNicknameContainer: {
            flex: 1,
        },
        commentNicknameText: {
            color: theme.TEXT,
            fontSize: 16,
            marginStart: 10,
            fontFamily: 'NanumGothic',
        },
        commentBody: {
            flex: 1,
            paddingVertical: 6,
            paddingHorizontal: 10,
        },
        commentBodyText: {
            color: theme.TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
        commentFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        commentTime: {
            marginStart: 10,
        },
        commentTimeText: {
            color: theme.TEXT_SECONDARY,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
        commentActions: {
            flexDirection: 'row',
        },
        commentActionButton: {
            // borderColor:
            //     theme === lightColors ? baseColors.GRAY_2 : baseColors.GRAY_2,
            // borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 4,
            paddingVertical: 4,
            marginStart: 6,
            borderRadius: 8,
        },
        commentActionText: {
            marginStart: 4,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
        line: {
            borderBottomWidth: 1,
            borderBottomColor:
                theme === theme ? baseColors.GRAY_3 : baseColors.GRAY_1,
            paddingTop: 2,
            paddingBottom: 2,
            marginBottom: 2,
        },
    })

export default Comment
