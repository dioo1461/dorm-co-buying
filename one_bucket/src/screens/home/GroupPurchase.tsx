import IcDisposableItem from '@/assets/drawable/ic-disposable-item.svg'
import IcFrozenItem from '@/assets/drawable/ic-frozen-item.svg'
import IcRefridgeratedItem from '@/assets/drawable/ic-refridgerated-item.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { AppContext } from '@/hooks/useContext/AppContext'
import { useContext, useEffect, useRef, useState } from 'react'
import {
    Appearance,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

const enum Category {
    'none' = 0,
    'refridgerated' = 1,
    'frozen' = 2,
    'disposable' = 3,
    'others' = 4,
}

const GroupPurchase: React.FC = (): JSX.Element => {
    const { themeColor, setThemeColor } = useContext(AppContext)
    // 다크모드 변경 감지
    useEffect(() => {
        const themeSubscription = Appearance.addChangeListener(
            ({ colorScheme }) => {
                setThemeColor(colorScheme === 'dark' ? darkColors : lightColors)
            },
        )
        return () => themeSubscription.remove()
    }, [])

    const styles = createStyles(themeColor)
    const flatlistRef = useRef(null)

    const [currentCategory, setCurrentCategory] = useState(Category.none)

    const post = (data: any) => {
        return <></>
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.categoryContainer}
                horizontal
                contentContainerStyle={{ flexGrow: 1 }}
                showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        currentCategory === Category.refridgerated
                            ? styles.selectedCategoryButton
                            : styles.unselectedCategoryButton,
                    ]}
                    onPress={() => setCurrentCategory(Category.refridgerated)}>
                    <IcRefridgeratedItem fill={themeColor.TEXT} />
                    <Text style={styles.categoryText}>냉장식품</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        currentCategory === Category.frozen
                            ? styles.selectedCategoryButton
                            : styles.unselectedCategoryButton,
                    ]}
                    onPress={() => setCurrentCategory(Category.frozen)}>
                    <IcFrozenItem fill={themeColor.TEXT} />
                    <Text style={styles.categoryText}>냉동식품</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        currentCategory === Category.disposable
                            ? styles.selectedCategoryButton
                            : styles.unselectedCategoryButton,
                    ]}
                    onPress={() => setCurrentCategory(Category.disposable)}>
                    <IcDisposableItem fill={themeColor.TEXT} />
                    <Text style={styles.categoryText}>일회용품</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        { paddingHorizontal: 24 },
                        currentCategory === Category.others
                            ? styles.selectedCategoryButton
                            : styles.unselectedCategoryButton,
                    ]}
                    onPress={() => setCurrentCategory(Category.others)}>
                    <Text style={styles.categoryText}>기타</Text>
                </TouchableOpacity>
            </ScrollView>
            <View style={styles.contextContainer}>
                {/* <FlatList ref={flatlistRef}></FlatList> */}
            </View>
        </View>
    )
}

export default GroupPurchase

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: { flex: 1 },
        categoryContainer: { flex: 1, flexDirection: 'row' },
        categoryButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingStart: 10,
            paddingEnd: 12,
            marginVertical: 8,
            marginStart: 10,
            borderRadius: 30,
            backgroundColor: baseColors.GRAY_2,
        },
        unselectedCategoryButton: { backgroundColor: baseColors.GRAY_2 },
        selectedCategoryButton: { backgroundColor: baseColors.SCHOOL_BG },
        categoryText: {
            color: baseColors.WHITE,
            fontFamily: 'NanumGothic',
            fontSize: 13,
        },
        contextContainer: {
            flex: 11,
        },
    })
