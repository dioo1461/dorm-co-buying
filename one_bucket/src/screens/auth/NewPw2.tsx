import { darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useEffect } from 'react'
import {
    Appearance,
    BackHandler,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import {
    RootStackParamList,
    stackNavigation,
} from '../navigation/NativeStackNavigation'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const NewPw2: React.FC = (): React.JSX.Element => {
    const { themeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
    }))

    const onPressBackBtn = (action: boolean) => {
        const backAction = (): boolean => {
            if (action) {
                return action
            } else {
                navigation.goBack()
                return action
            }
        }
        BackHandler.addEventListener('hardwareBackPress', backAction)
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backAction)
        }
    }

    const styles = CreateStyles(themeColor)
    const navigation = stackNavigation()

    type NewPw2RouteProp = RouteProp<RootStackParamList, 'NewPw2'>
    const { params } = useRoute<NewPw2RouteProp>()

    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>
                {`새로운 비밀번호로 변경되었습니다!\n${params.email}로 보낸\n메일을 확인해 보세요.`}
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    onPressBackBtn(false)
                    navigation.pop(2)
                }}>
                <Text style={styles.buttonText}>다시 로그인하기</Text>
            </TouchableOpacity>
        </View>
    )
}

const CreateStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.BG,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        subtitle: {
            color: theme.TEXT_SECONDARY,
            fontSize: 20,
            fontFamily: 'NanumGothic',
            lineHeight: 30,
            textAlign: 'center',
        },
        button: {
            height: 50,
            width: '90%',
            borderRadius: 8,
            borderWidth: 0.5,
            backgroundColor: theme.BUTTON_BG,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
        },
        buttonText: {
            color: theme.BUTTON_TEXT,
        },
    })

export default NewPw2
