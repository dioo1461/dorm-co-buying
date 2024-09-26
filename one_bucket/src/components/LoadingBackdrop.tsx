import { baseColors, Icolor, lightColors } from '@/constants/colors'
import { useEffect, useRef } from 'react'
import { ActivityIndicator, Animated, Pressable } from 'react-native'

interface BackdropProps {
    enabled: boolean
    theme: Icolor
}

const LoadingBackdrop: React.FC<BackdropProps> = ({
    enabled,
    theme,
}): JSX.Element => {
    const animation = useRef(new Animated.Value(0)).current

    const backdropAnimatedStyle = {
        opacity: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5],
        }),
    }

    useEffect(() => {
        Animated.timing(animation, {
            toValue: enabled ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start()
    }, [enabled])

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'black',
                    zIndex: 1,
                },
                backdropAnimatedStyle,
                { pointerEvents: enabled ? 'auto' : 'none' },
            ]}>
            <ActivityIndicator
                style={{
                    flex: 1,
                    alignSelf: 'center',
                    zIndex: 2,
                }}
                color={
                    theme === lightColors
                        ? baseColors.SCHOOL_BG
                        : baseColors.GRAY_2
                }
                // style={backdropAnimatedStyle}
                size='large'
            />
        </Animated.View>
    )
}

export default LoadingBackdrop
