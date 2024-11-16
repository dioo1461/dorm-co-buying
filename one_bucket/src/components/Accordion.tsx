import {
    StyleSheet,
    View,
    LayoutChangeEvent,
    TouchableOpacity,
    ViewStyle,
} from 'react-native'
import Animated, {
    useSharedValue,
    useDerivedValue,
    withTiming,
    useAnimatedStyle,
} from 'react-native-reanimated'
import Line from './Line'
import { baseColors, Icolor } from '@/constants/colors'
import { Text } from 'react-native'
import IcAngleDown from '@/assets/drawable/ic-angle-down.svg'
interface AccordionProps {
    expanded: boolean
    onToggle: () => void
    theme: Icolor
    headerTitle: string
    containerStyle: ViewStyle
    children: React.ReactNode
    viewKey?: string
    duration?: number
}

const Accordion: React.FC<AccordionProps> = ({
    expanded,
    onToggle,
    theme,
    containerStyle,
    headerTitle,
    children,
    viewKey,
    duration = 500,
}): JSX.Element => {
    const styles = createStyles(theme)
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

    // 아이콘 회전 애니메이션 (IcAngleDown)
    const rotateValue = useDerivedValue(() =>
        withTiming(expanded ? 180 : 0, { duration }),
    )
    const rotateStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotateValue.value}deg` }],
    }))

    return (
        <View style={containerStyle}>
            <View style={styles.hiddenContent} onLayout={onLayout}>
                {children}
            </View>
            {/* 헤더 */}
            <TouchableOpacity style={styles.headerContainer} onPress={onToggle}>
                <Text style={styles.headerText}>{headerTitle}</Text>
                <Animated.View style={[rotateStyle]}>
                    <IcAngleDown />
                </Animated.View>
            </TouchableOpacity>
            <Animated.View
                key={`accordionItem_${viewKey}`}
                style={[styles.animatedView, bodyStyle]}>
                <Line
                    theme={theme}
                    style={{
                        marginTop: 4,
                    }}
                />
                <View style={styles.wrapper}>{children}</View>
            </Animated.View>
        </View>
    )
}

export default Accordion

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {},
        headerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 20,
            alignItems: 'center',
        },
        headerText: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic-Bold',
            marginEnd: 10,
        },
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
