import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import IcClose from '@/assets/drawable/ic-close.svg'
import IcNotification from '@/assets/drawable/ic-angle-left.svg'
import IcUnauth from '@/assets/drawable/tabler_school-off.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { useEffect, useState } from 'react'
import {
    Appearance,
    BackHandler,
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
import strings from '@/constants/strings'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const UnauthHome: React.FC = (): React.JSX.Element => {
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

    const onPressBackBtn = (action: boolean) => {
        const backAction = (): boolean => {
            if (action) {
                return action;
            }
            else {
                navigation.goBack();
                return action;
            }
        }
        BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => { BackHandler.removeEventListener('hardwareBackPress', backAction); }
    }

    const styles = CreateStyles(themeColor)
    const navigation = stackNavigation()

    return (
        <View style={styles.container}>
            <IcUnauth />
            <Text style={{fontSize: 20, textAlign: 'center'}}>
                {`학교 인증을 완료하셔야\n모든 서비스를 이용하실 수 있습니다.`}
            </Text>
        </View>
    )
}

const CreateStyles = (theme: Icolor) =>
    StyleSheet.create({
        container:{
            backgroundColor: theme.BG,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        button:{
            height: 50,
            width: '90%',
            borderRadius: 8,
            borderWidth: 0.5,
            backgroundColor: theme.BUTTON_BG,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
        },
        buttonText:{
            color: theme.BUTTON_TEXT
        }
    })

export default UnauthHome