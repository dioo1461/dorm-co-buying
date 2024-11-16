import { StyleSheet, View, LayoutChangeEvent } from 'react-native'
import Animated, {
    useSharedValue,
    useDerivedValue,
    withTiming,
    useAnimatedStyle,
} from 'react-native-reanimated'

interface AccordionProps {
    expanded: boolean
    children: React.ReactNode
    viewKey?: string
    duration?: number
}

const Accordion: React.FC<AccordionProps> = ({
    expanded,
    children,
    viewKey,
    duration = 500,
}): JSX.Element => {
    const height = useSharedValue(0) // 실제 높이 값을 저장
    const animatedHeight = useSharedValue(0) // 애니메이션용 높이 값

    // isExpanded가 true일 때만 height를 적용
    const derivedHeight = useDerivedValue(() =>
        withTiming(expanded ? height.value : 0, { duration }),
    )

    // 애니메이션 스타일 적용
    const bodyStyle = useAnimatedStyle(() => ({
        height: derivedHeight.value,
        width: '100%',
    }))

    // 콘텐츠의 높이를 설정
    const onLayout = (e: LayoutChangeEvent) => {
        const contentHeight = e.nativeEvent.layout.height
        if (height.value === 0) {
            height.value = contentHeight
        }
    }

    return (
        <View>
            <View style={styles.hiddenContent} onLayout={onLayout}>
                {children}
            </View>
            <Animated.View
                key={`accordionItem_${viewKey}`}
                style={[styles.animatedView, bodyStyle]}>
                <View style={styles.wrapper}>{children}</View>
            </Animated.View>
        </View>
    )
}

export default Accordion

const styles = StyleSheet.create({
    animatedView: {
        overflow: 'hidden',
    },
    wrapper: {
        width: '100%',
    },
    hiddenContent: {
        position: 'absolute',
        opacity: 0,
        zIndex: -1,
    },
})
