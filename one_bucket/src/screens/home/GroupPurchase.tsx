import IcDisposableItem from '@/assets/drawable/ic-disposable-item.svg'
import IcFrozenItem from '@/assets/drawable/ic-frozen-item.svg'
import IcLocation from '@/assets/drawable/ic-location.svg'
import IcRefridgeratedItem from '@/assets/drawable/ic-refridgerated-item.svg'
import IcOther from '@/assets/mipmap/tab/ic-other.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { AppContext } from '@/hooks/useContext/AppContext'
import { useContext, useEffect, useRef, useState } from 'react'
import {
    Appearance,
    FlatList,
    ListRenderItem,
    ScrollView,
    StyleSheet,
    Text,
    TouchableNativeFeedback,
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

type ItemProps = {
    id: string
    title: string
    location: string
    createdAt: string
    deadline: number
    amount: number
    price: number
    imageUri: string
    participants: number
    maxParticipants: number
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
    const flatlistData: ItemProps[] = [
        {
            id: '1',
            title: '물티슈',
            location: '제 2기숙사',
            createdAt: 'createdAt1',
            deadline: 5,
            amount: 7,
            price: 5600,
            imageUri: 'imageUri',
            participants: 3,
            maxParticipants: 4,
        },
        {
            id: '2',
            title: '두루마리 휴지',
            location: 'T동 3층 휴게실',
            createdAt: 'createdAt2',
            deadline: 4,
            amount: 6,
            price: 2700,
            imageUri: 'imageUri',
            participants: 2,
            maxParticipants: 5,
        },
        {
            id: '3',
            title: '일회용 플라스틱 숟가락',
            location: '제 3기숙사',
            createdAt: 'createdAt3',
            deadline: 1,
            amount: 20,
            price: 900,
            imageUri: 'imageUri',
            participants: 5,
            maxParticipants: 5,
        },
    ]

    const [currentCategory, setCurrentCategory] = useState(Category.none)

    const touchableNativeFeedbackBg = () => {
        return TouchableNativeFeedback.Ripple(
            themeColor === lightColors ? baseColors.GRAY_3 : baseColors.GRAY_1,
            false,
        )
    }

    const Post = (data: ItemProps) => {
        return (
            <View>
                <TouchableNativeFeedback
                    style={styles.postContainer}
                    background={touchableNativeFeedbackBg()}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View
                            style={[
                                styles.postImage,
                                { backgroundColor: 'white' },
                            ]}
                        />
                        <View style={styles.postContentContainer}>
                            <View>
                                <View
                                    style={{
                                        marginTop: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                    <Text style={styles.postTitle}>
                                        {data.title}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginTop: 10,
                                    }}>
                                    <IcLocation />
                                    <Text style={styles.postLocation}>
                                        {`${data.location}ㆍ${data.deadline}일 남음`}
                                    </Text>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={styles.postPrice}>{`${
                                        data.amount
                                    }개  ${data.price.toLocaleString()} 원`}</Text>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <Text
                                        style={styles.postEachPrice}>{`개당 ${(
                                        data.price / data.amount
                                    ).toFixed(0)} 원`}</Text>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                right: 10,
                                top: -4,
                            }}>
                            <TouchableNativeFeedback
                                background={touchableNativeFeedbackBg()}
                                useForeground={true}>
                                <View
                                    style={{
                                        borderRadius: 30,
                                        padding: 10,
                                        overflow: 'hidden',
                                    }}>
                                    <IcOther fill={baseColors.GRAY_3} />
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 16,
                                right: 16,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                            {data.participants < data.maxParticipants ? (
                                <View
                                    style={{
                                        backgroundColor: themeColor.BUTTON_BG,
                                        borderRadius: 30,
                                        padding: 6,
                                        marginEnd: 5,
                                    }}>
                                    <Text
                                        style={{
                                            color: themeColor.BUTTON_TEXT,
                                            fontFamily: 'NanumGothic-Bold',
                                            fontSize: 11,
                                        }}>
                                        참여 가능
                                    </Text>
                                </View>
                            ) : (
                                <View
                                    style={{
                                        backgroundColor: baseColors.GRAY_2,
                                        borderRadius: 30,
                                        padding: 6,
                                        marginEnd: 5,
                                    }}>
                                    <Text
                                        style={{
                                            color: baseColors.WHITE,
                                            fontFamily: 'NanumGothic-Bold',
                                            fontSize: 11,
                                        }}>
                                        마감
                                    </Text>
                                </View>
                            )}
                            <Text style={styles.postParticipants}>
                                {`${data.participants} / ${data.maxParticipants}명`}
                            </Text>
                        </View>
                        <View style={styles.line} />
                    </View>
                </TouchableNativeFeedback>
                <View style={styles.line} />
            </View>
        )
    }

    const handleCategorySelect = (category: Category) => {
        if (currentCategory === category) {
            setCurrentCategory(Category.none)
            return
        }
        setCurrentCategory(category)
    }

    const renderItem: ListRenderItem<ItemProps> = ({ item }) => (
        <Post {...item} />
    )

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
                    onPress={() =>
                        handleCategorySelect(Category.refridgerated)
                    }>
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
                    onPress={() => handleCategorySelect(Category.frozen)}>
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
                    onPress={() => handleCategorySelect(Category.disposable)}>
                    <IcDisposableItem fill={themeColor.TEXT} />
                    <Text style={styles.categoryText}>일회용품</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        {
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginVertical: 8,
                            marginStart: 10,
                            borderRadius: 30,
                            backgroundColor: baseColors.GRAY_2,
                            paddingHorizontal: 24,
                        },
                        currentCategory === Category.others
                            ? styles.selectedCategoryButton
                            : styles.unselectedCategoryButton,
                    ]}
                    onPress={() => handleCategorySelect(Category.others)}>
                    <Text style={styles.categoryText}>기타</Text>
                </TouchableOpacity>
            </ScrollView>
            <View style={styles.flatList}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    ref={flatlistRef}
                    data={flatlistData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
        </View>
    )
}

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
        unselectedCategoryButton: {
            backgroundColor:
                theme === lightColors ? baseColors.GRAY_3 : baseColors.GRAY_1,
        },
        selectedCategoryButton: { backgroundColor: baseColors.SCHOOL_BG },
        categoryText: {
            color: baseColors.WHITE,
            fontFamily: 'NanumGothic',
            fontSize: 13,
        },
        flatList: {
            flex: 11,
        },
        postContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 6,
            paddingStart: 6,
        },
        postImage: { width: 100, height: 100, borderRadius: 10, margin: 10 },
        postContentContainer: { flex: 6, marginEnd: 20, flexDirection: 'row' },
        line: {
            borderBottomWidth: 1,
            borderBottomColor:
                theme === lightColors ? baseColors.GRAY_3 : baseColors.GRAY_1,
            marginHorizontal: 12,
            marginVertical: 4,
        },
        postTitle: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic',
        },
        postLocation: {
            color: theme.TEXT_SECONDARY,
            fontSize: 11,
            fontFamily: 'NanumGothic',
        },
        postDeadline: {
            color: theme.TEXT_SECONDARY,
            fontSize: 11,
            fontFamily: 'NanumGothic',
        },
        postPrice: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic-Bold',
        },
        postEachPrice: {
            color: theme.TEXT_SECONDARY,
            fontSize: 11,
            fontFamily: 'NanumGothic',
        },
        postParticipants: {
            color: theme.TEXT,
            fontSize: 13,
            fontFamily: 'NanumGothic',
        },
    })

export default GroupPurchase
