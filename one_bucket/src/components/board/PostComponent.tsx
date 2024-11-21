import { CachedImage } from '@/components/CachedImage'
import { baseColors, Icolor } from '@/constants/colors'
import { BoardPostReduced } from '@/data/response/success/board/GetBoardPostListResponse'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const PostComponent: React.FC<{ data: BoardPostReduced }> = ({
    data,
}): JSX.Element => {
    const { themeColor, getBoardNameById } = useBoundStore(state => ({
        themeColor: state.themeColor,
        getBoardNameById: state.getBoardNameById,
    }))

    const styles = createStyles(themeColor)
    const navigation = stackNavigation()

    return (
        <View style={styles.postContainer}>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('BoardPost', {
                        boardId: data.boardId,
                        boardName: getBoardNameById(data.boardId) ?? '',
                        postId: data.postId,
                        performRefresh: false,
                    })
                }>
                <Text style={styles.postTitle} numberOfLines={1}>
                    {data.title}
                </Text>
                <Text style={styles.postContentText} numberOfLines={2}>
                    {data.text}
                </Text>
                {data.imageUrls.length > 0 && (
                    <CachedImage
                        imageUrl={data.imageUrls[0]}
                        imageStyle={styles.postImage}
                    />
                )}
            </TouchableOpacity>
            <View style={styles.line} />
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        postContainer: {
            flex: 1,
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: baseColors.GRAY_3,
        },
        postTitle: {
            fontSize: 14,
            fontFamily: 'NanumGothic-Bold',
            color: theme.TEXT,
        },
        postContentText: {
            fontSize: 13,
            fontFamily: 'NanumGothic',
            color: theme.TEXT,
            lineHeight: 18,
            marginTop: 8,
        },
        postImage: {
            width: 72,
            height: 72,
            borderRadius: 8,
            marginTop: 10,
        },
        line: {
            borderBottomWidth: 1,
            borderBottomColor: baseColors.GRAY_3,
            marginVertical: 10,
        },
    })

export default PostComponent
