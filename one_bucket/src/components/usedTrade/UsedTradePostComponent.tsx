import IcLocation from '@/assets/drawable/ic-location.svg'
import { CachedImage } from '@/components/CachedImage'
import { baseColors, Icolor, lightColors } from '@/constants/colors'
import { UsedTradePostReduced } from '@/data/response/success/UsedTrade/GetUsedTradePostListResponse'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import React from 'react'
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'

interface Props {
    data: UsedTradePostReduced
}

const UsedTradePostComponent: React.FC<Props> = ({ data }): JSX.Element => {
    const { themeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
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
                    navigation.navigate('UsedTradePost', {
                        postId: data.postId,
                    })
                }>
                <View style={styles.postContainer}>
                    {data.imageUrls.length > 0 ? (
                        <CachedImage
                            imageStyle={styles.postImage}
                            imageUrl={data.imageUrls[0]}
                        />
                    ) : (
                        <View style={styles.postImage} />
                    )}
                    <View style={styles.postContentContainer}>
                        <View style={{ marginStart: 6 }}>
                            <View
                                style={{
                                    marginTop: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <Text style={styles.postTitle}>
                                    {data.title}
                                </Text>
                                <Text style={styles.postLocation}>
                                    {data.trade_tag}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 10,
                                }}>
                                <IcLocation />
                                <Text style={styles.postLocation}>
                                    {`${data.trade_location}ㆍ${Math.max(
                                        0,
                                        Math.ceil(
                                            (new Date(
                                                data.trade_dueDate,
                                            ).getTime() -
                                                new Date().getTime()) /
                                                (1000 * 60 * 60 * 24),
                                        ),
                                    )}일 남음`}
                                </Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text
                                    style={
                                        styles.postPrice
                                    }>{`${data.trade_price.toLocaleString()} 원`}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.line} />
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
            paddingVertical: 6,
            paddingStart: 6,
        },
        postImage: { width: 100, height: 100, borderRadius: 10, margin: 10 },
        postContentContainer: { flex: 6, marginEnd: 20, flexDirection: 'row' },
        line: {
            borderBottomWidth: 1,
            borderBottomColor:
                theme === lightColors ? baseColors.GRAY_3 : baseColors.GRAY_1,
            marginHorizontal: 12,
            marginVertical: 4,
        },
        postTitle: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic',
        },
        postLocation: {
            color: theme.TEXT_SECONDARY,
            fontSize: 11,
            fontFamily: 'NanumGothic',
            paddingHorizontal: 4,
        },
        postDeadline: {
            color: theme.TEXT_SECONDARY,
            fontSize: 10,
            fontFamily: 'NanumGothic',
        },
        postPrice: {
            color: theme.TEXT,
            fontSize: 14,
            fontFamily: 'NanumGothic-Bold',
        },
        postEachPrice: {
            color: theme.TEXT_SECONDARY,
            fontSize: 10,
            fontFamily: 'NanumGothic',
        },
        postParticipants: {
            color: theme.TEXT,
            fontSize: 12,
            fontFamily: 'NanumGothic',
        },
    })

export default UsedTradePostComponent
