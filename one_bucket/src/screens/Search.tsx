import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import IcClose from '@/assets/drawable/ic-close.svg'
import IcHistory from '@/assets/drawable/ic-history.svg'
import { baseColors, darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { useEffect } from 'react'
import {
    Appearance,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native'
import { stackNavigation } from './navigation/NativeStackNavigation'

const Search: React.FC = (): React.JSX.Element => {
    const { themeColor, setThemeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
        setThemeColor: state.setThemeColor,
    }))
    // 다크모드 변경 감지
    useEffect(() => {
        const themeSubscription = Appearance.addChangeListener(
            ({ colorScheme }) => {
                setThemeColor(colorScheme === 'dark' ? darkColors : lightColors)
            },
        )
        return () => themeSubscription.remove()
    }, [])

    const styles = CreateStyles(themeColor)
    const navigation = stackNavigation()

    const tempRecommendations = [
        '우유',
        '계란',
        '물',
        '휴지',
        '물티슈',
        '종이컵',
        '컵라면',
        '라면',
        '커피',
        '콜라',
        '컵라면',
        '라면',
        '커피',
        '콜라',
    ]

    const tempSearched = [
        '우유',
        '계란',
        '물',
        '휴지',
        '물티슈',
        '종이컵',
        '컵라면',
        '라면',
        '커피',
        '콜라',
        '컵라면',
        '라면',
        '커피',
        '콜라',
    ]

    const RecommendationItem = (name: string, key: number) => (
        <TouchableOpacity key={key}>
            <View
                style={{
                    borderColor: baseColors.GRAY_2,
                    borderWidth: 1,
                    borderRadius: 30,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    marginEnd: 6,
                }}>
                <Text
                    style={{
                        color: themeColor.TEXT,
                        fontSize: 14,
                        fontFamily: 'NanumGothic',
                    }}>
                    {name}
                </Text>
            </View>
        </TouchableOpacity>
    )

    const renderRecentSearchedItem = (data: any) => (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
                themeColor.BG_SECONDARY,
                false,
            )}>
            <View style={styles.recentSearchedItemContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IcHistory style={{ marginEnd: 8 }} />
                    <Text style={styles.recentSearchedItemText}>
                        {data.item}
                    </Text>
                </View>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(
                        themeColor.BG_SECONDARY,
                        true,
                        24,
                    )}
                    onPress={() => {}}>
                    <IcClose width={24} height={24} fill={baseColors.GRAY_2} />
                </TouchableNativeFeedback>
            </View>
        </TouchableNativeFeedback>
    )

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IcAngleLeft fill={baseColors.GRAY_2} />
                </TouchableOpacity>
                <TextInput
                    style={styles.textInput}
                    placeholder='공동구매 및 중고거래 게시글 검색'
                    placeholderTextColor={themeColor.TEXT_SECONDARY}
                />
            </View>
            <View style={styles.bodyContainer}>
                <Text style={styles.recommendationText}>맞춤 검색</Text>
                <ScrollView
                    style={styles.recommendationScrollView}
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    {tempRecommendations.map((value, index) =>
                        RecommendationItem(value, index),
                    )}
                </ScrollView>
                <Text style={styles.recommendationText}>최근 검색</Text>
            </View>
            <FlatList
                style={styles.historyFlatlist}
                data={tempRecommendations}
                renderItem={renderRecentSearchedItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    )
}

const CreateStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            flex: 1,
            marginTop: 20,
        },
        headerContainer: {
            marginHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
        },
        textInput: {
            flex: 1,
            backgroundColor: theme.BG_SECONDARY,
            borderRadius: 10,
            marginStart: 20,
            paddingVertical: 6,
            paddingHorizontal: 16,
        },
        bodyContainer: {},
        recommendationText: {
            color: theme.TEXT,
            marginHorizontal: 20,
            fontSize: 16,
            fontFamily: 'NanumGothic-Bold',
        },
        recommendationScrollView: {
            marginStart: 20,
            marginVertical: 20,
        },
        recentSearchedItemContainer: {
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
        },
        recentSearchedItemText: {
            color: theme.TEXT,
            fontSize: 16,
            fontFamily: 'NanumGothic',
        },
        historyFlatlist: {
            marginTop: 14,
        },
    })

export default Search
