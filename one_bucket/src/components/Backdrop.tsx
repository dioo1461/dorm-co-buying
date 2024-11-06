import { useEffect, useRef } from 'react'
import { Animated, Dimensions, Pressable } from 'react-native'

interface BackdropProps {
    enabled: boolean
    onPress: () => void
}

const Backdrop: React.FC<BackdropProps> = ({
    enabled,
    onPress,
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
            duration: 300,
            useNativeDriver: false,
        }).start()
    }, [enabled])

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                    backgroundColor: 'black',
                    zIndex: 1,
                },
                backdropAnimatedStyle,
                { pointerEvents: enabled ? 'auto' : 'none' },
            ]}>
            <Pressable style={{ flex: 1 }} onPress={onPress} />
        </Animated.View>
    )
}

export default Backdrop
