import { Icolor } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import {
    BackHandler,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const ChangePw2: React.FC = (): React.JSX.Element => {
    const { themeColor, onLogOut } = useBoundStore(state => ({
        themeColor: state.themeColor,
        onLogOut: state.onLogOut,
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

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 25, textAlign: 'center' }}>
                {`비밀번호가 변경되었습니다!\n새 비밀번호로 다시 로그인해 보세요.`}
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    onPressBackBtn(false)
                    onLogOut()
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
            fontSize: 16,
        },
    })

export default ChangePw2
