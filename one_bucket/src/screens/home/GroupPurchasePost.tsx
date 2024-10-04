import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { useEffect, useState } from 'react'
import {
    Appearance,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import IcShare from '@/assets/drawable/ic-share.svg'
import IcOthers from '@/assets/drawable/ic-others.svg'
import { TouchableOpacity } from 'react-native'

const GroupPurchasePost: React.FC = (): JSX.Element => {
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

    const styles = createStyles(themeColor)

    const [imageUriList, setImageUriList] = useState<string[]>([])

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1, borderWidth: 1 }}>
                <View>
                    <View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}>
                            {imageUriList.map((uri, index) => (
                                <View key={index}>
                                    <Image
                                        source={{ uri }}
                                        style={{ width: 100, height: 100 }}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
            {/* ### 헤더 ### */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <IcAngleLeft fill={baseColors.GRAY_4} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity>
                        <IcShare fill={baseColors.GRAY_4} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <IcOthers fill={baseColors.GRAY_4} />
                    </TouchableOpacity>
                </View>
            </View>
            {/* ### 하단 바 ### */}
            <View style={styles.bottomBarContainer}>
                <TouchableOpacity>{/* <IcHeart /> */}</TouchableOpacity>
                <View>
                    <Text>남은 수량</Text>
                    <Text>모집 인원</Text>
                </View>
                <View>
                    <Text style={styles.bottomBarCountText}>12 / 30</Text>
                    <Text style={styles.bottomBarCountText}>3 / 5</Text>
                </View>
                <TouchableOpacity style={styles.joinButton}>
                    <Text>참여하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: { flex: 1, borderWidth: 1 },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'absolute',
            top: 0,
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: 16,
        },
        bottomBarContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: 16,
        },
        bottomBarCountText: {
            color: theme.TEXT,
            fontFamily: 'NanumGothic-Bold',
            fontSize: 16,
            textAlign: 'right',
        },
        joinButton: {
            backgroundColor: theme.BUTTON_BG,
            padding: 10,
            borderRadius: 8,
        },
    })

export default GroupPurchasePost
