import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import IcClose from '@/assets/drawable/ic-close.svg'
import IcNotification from '@/assets/drawable/ic-angle-left.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { useEffect } from 'react'
import {
    Appearance,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const Announcement: React.FC = (): React.JSX.Element => {
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

    const styles = CreateStyles(themeColor)
    const navigation = stackNavigation()

    const announcs = [
        ['한바구니 론-칭 기념 이벤트',
        '대상혁에게 쿠폰을 받아가세요!\n01053726732...(더보기)'],
    ]

    const announcFrame = (data: any) => (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
                themeColor.BG_SECONDARY,
                false,
            )}>
            <View style={styles.announc}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={require('@/assets/drawable/vector.png')}
                        style={styles.announcIcon}
                    />
                    <View style={styles.announcTitle}>
                            <Text style={{...styles.announcText, fontWeight: 'bold'}}>
                                {data.item[0]}
                            </Text>
                        <View style={styles.announcCont}>
                            <Text style={styles.announcText}>
                                {data.item[1]}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableNativeFeedback>
    )

    return (
        <View>
            <FlatList
                style={styles.announcList}
                data={announcs}
                renderItem={announcFrame}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
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
        }
    })

export default Announcement