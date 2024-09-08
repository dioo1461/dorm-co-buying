import { useEffect, useRef } from 'react'
import { Animated, Pressable } from 'react-native'

interface BackdropProps {
    expanded: boolean
    onPress: () => void
}

const Backdrop: React.FC<BackdropProps> = ({
    expanded,
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
            toValue: expanded ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start()
    }, [expanded])

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
                { pointerEvents: expanded ? 'auto' : 'none' },
            ]}>
            <Pressable style={{ flex: 1 }} onPress={onPress} />
        </Animated.View>
    )
}

export default Backdrop
