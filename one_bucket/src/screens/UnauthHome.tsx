import IcUnauth from '@/assets/drawable/tabler_school-off.svg'
import { Icolor } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const UnauthHome: React.FC = (): React.JSX.Element => {
    const { themeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
    }))

    const styles = CreateStyles(themeColor)
    const navigation = stackNavigation()

    return (
        <View style={styles.container}>
            <IcUnauth />
            <Text style={{ fontSize: 20, textAlign: 'center' }}>
                {`학교 인증을 완료하셔야\n모든 서비스를 이용하실 수 있습니다.`}
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    navigation.navigate('SchoolAuth1')
                }}>
                <Text style={styles.buttonText}>학교 인증 바로가기</Text>
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

export default UnauthHome
