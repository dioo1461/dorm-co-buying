import BottomSheet from '@/components/bottomSheet/BottomSheet'
import Line from '@/components/Line'
import { baseColors, Icolor } from '@/constants/colors'
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native'

export type SelectableBottomSheetButtonProps = {
    text: string
    style: 'default' | 'destructive'
    onPress: () => void
}

type SelectableBottomSheetProps = {
    enabled: boolean
    onClose: () => void
    theme: Icolor
    buttons: SelectableBottomSheetButtonProps[]
}

/**
 * SelectableBottomSheet
 *
 * 선택 가능한 버튼 목록을 하단 시트(Bottom Sheet) 형태로 보여주는 컴포넌트입니다.
 * 각 버튼은 사용자 정의 동작을 트리거할 수 있으며, 이 컴포넌트는 주로 화면 하단에서 여러 옵션을 제공할 때 사용됩니다.
 *
 * @param enabled - Bottom Sheet의 표시 여부를 제어하는 boolean 값입니다.
 * @param onClose - Bottom Sheet가 닫힐 때 호출할 함수입니다.
 * @param theme - 현재 테마에 따른 색상 정보를 담고 있는 객체로, Bottom Sheet의 스타일을 지정하는 데 사용됩니다.
 * @param buttons - 버튼 목록을 설정하는 배열입니다. 각 버튼은 `text`, `style` ('default' 또는 'destructive'), `onPress` 함수 속성을 가집니다.
 *
 * @example
 * ```typescript
 * import { SelectableBottomSheet } from '@/components/bottomSheet/SelectableBottomSheet';
 *
 * const MyComponent = () => {
 *     const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
 *
 *     const buttons = [
 *         { text: '수정하기', style: 'default', onPress: handleEdit },
 *         { text: '삭제하기', style: 'destructive', onPress: handleDelete }
 *     ];
 *
 *     const handleEdit = () => {
 *         // 수정 동작을 처리하는 함수
 *     };
 *
 *     const handleDelete = () => {
 *         // 삭제 동작을 처리하는 함수
 *     };
 *
 *     return (
 *         <View>
 *             <Button title="Bottom Sheet 열기" onPress={() => setBottomSheetVisible(true)} />
 *             <SelectableBottomSheet
 *                 enabled={isBottomSheetVisible}
 *                 onClose={() => setBottomSheetVisible(false)}
 *                 theme={theme}
 *                 buttons={buttons}
 *             />
 *         </View>
 *     );
 * };
 * ```
 */
export const SelectableBottomSheet: React.FC<SelectableBottomSheetProps> = ({
    enabled,
    onClose,
    theme,
    buttons,
}): JSX.Element => {
    const styles = createStyles(theme)

    return (
        <BottomSheet enabled={enabled} onClose={onClose} theme={theme}>
            <View>
                <View style={styles.buttonsContainer}>
                    {buttons.map((buttonProp, index) => {
                        let textStyle
                        switch (buttonProp.style) {
                            case 'default':
                                textStyle = styles.buttonText
                                break
                            case 'destructive':
                                textStyle = styles.destructiveButtonText
                                break
                        }
                        return (
                            <View key={index}>
                                <View style={styles.touchableWrapper}>
                                    <TouchableNativeFeedback
                                        onPress={buttonProp.onPress}
                                        background={TouchableNativeFeedback.Ripple(
                                            theme.TEXT_SECONDARY,
                                            false, // 리플 효과가 경계를 넘지 않도록 설정
                                        )}>
                                        <View style={styles.button}>
                                            <Text style={textStyle}>
                                                {buttonProp.text}
                                            </Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                                {index !== buttons.length - 1 && (
                                    <Line
                                        style={{
                                            marginHorizontal: 10,
                                        }}
                                        theme={theme}
                                    />
                                )}
                            </View>
                        )
                    })}
                </View>
                <View style={[styles.buttonsContainer, { marginTop: 10 }]}>
                    <View style={styles.touchableWrapper}>
                        <TouchableNativeFeedback
                            onPress={onClose}
                            background={TouchableNativeFeedback.Ripple(
                                theme.TEXT_SECONDARY,
                                false,
                            )}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>닫기</Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            </View>
        </BottomSheet>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        overlay: {
            position: 'absolute',
            width: '100%',
            height: '100%',
        },
        container: {
            backgroundColor: theme.BG,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: 'absolute',
            padding: 18,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'flex-end',
            zIndex: 1,
        },
        buttonsContainer: {
            backgroundColor: theme.BG_SECONDARY,
            width: '100%',
            borderRadius: 10,
            paddingVertical: 0,
            zIndex: 2,
        },
        touchableWrapper: {
            borderRadius: 10, // 리플 효과가 맞춰질 radius
            overflow: 'hidden', // 리플 효과가 반경을 넘지 않도록 설정
            paddingVertical: 2,
        },
        button: {
            paddingVertical: 16,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonText: {
            fontFamily: 'NanumGothic',
            fontSize: 13,
            color: theme.TEXT,
        },
        destructiveButtonText: {
            fontFamily: 'NanumGothic',
            fontSize: 13,
            color: baseColors.RED,
        },
        backdrop: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
    })
