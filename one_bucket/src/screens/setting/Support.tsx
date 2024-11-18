import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import IcClose from '@/assets/drawable/ic-close.svg'
import IcNotification from '@/assets/drawable/ic-angle-left.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { useEffect, useState } from 'react'
import {
    Appearance,
    Dimensions,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const Support: React.FC = (): React.JSX.Element => {
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

    return (
        <View style={styles.container}>
            <View style={styles.supportText}>
                <Text>{`저희 한바구니 서비스를 이용해 주셔서 감사합니다.\n문의사항을 작성해 주시면 개발자에게 제출됩니다.`}</Text>
            </View>
            <TextInput
                    style={styles.reportBox}
                    placeholder='문의사항을 입력해 주세요..'
                    placeholderTextColor={themeColor.TEXT_SECONDARY}
                    multiline={true}
            />
            <TouchableOpacity 
                style={styles.reportButton}
                onPress={()=>{
                    navigation.goBack()
                    ToastAndroid.show(
                        `소중한 의견 감사합니다!\n개발자에게 제출되었습니다.`,
                        ToastAndroid.SHORT,
                    )
                }}>
                <Text style={styles.reportButtonText}>제출하기</Text>
            </TouchableOpacity>
        </View>
    )
}

const CreateStyles = (theme: Icolor) =>
    StyleSheet.create({
        container:{
            backgroundColor: theme.BG,
            flex: 1,
            alignItems: 'center',
        },
        supportText:{
            height: 80,
            backgroundColor: theme.BG,
            justifyContent: 'center',
            alignItems: 'center',
        },
        reportBox:{
            height: '50%',
            width: '90%',
            borderRadius: 8,
            borderWidth: 0.5,
            backgroundColor: theme.BG_SECONDARY,
            textAlignVertical: 'top'
        },
        reportButton:{
            height: 50,
            width: '90%',
            borderRadius: 8,
            borderWidth: 0.5,
            backgroundColor: theme.BUTTON_BG,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
        },
        reportButtonText:{
            color: theme.BUTTON_TEXT,
            fontSize: 16,
        },
    })

export default Support