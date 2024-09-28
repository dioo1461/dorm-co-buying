import { baseColors, Icolor, lightColors } from '@/constants/colors'
import { ActivityIndicator, View } from 'react-native'

interface LoadingProps {
    theme: Icolor
}
const Loading: React.FC<LoadingProps> = ({ theme }): JSX.Element => {
    return (
        <View
            style={{
                backgroundColor: theme.BG,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <ActivityIndicator
                size='large'
                color={
                    theme === lightColors
                        ? baseColors.SCHOOL_BG
                        : baseColors.GRAY_2
                }
            />
        </View>
    )
}

export default Loading
