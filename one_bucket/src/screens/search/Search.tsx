import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import IcClose from '@/assets/drawable/ic-close.svg'
import IcHistory from '@/assets/drawable/ic-history.svg'
import { baseColors, Icolor } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { useEffect, useState } from 'react'
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
} from 'react-native'
import { stackNavigation } from '../navigation/NativeStackNavigation'
import useDatabase from '@/hooks/useDatabase/useDatabase'
import { GetBoardPostListResponse } from '@/data/response/success/board/GetBoardPostListResponse'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import SearchTab from '../navigation/SearchTab'

const Tab = createMaterialTopTabNavigator()

// TODO: 같은 검색어 중복 저장 안 되게 하기
type HistoryItemProp = {
    id: number
    name: string
}

const Search: React.FC = (): React.JSX.Element => {
    const { themeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
    }))

    const styles = CreateStyles(themeColor)
    const navigation = stackNavigation()

    const [keyword, setKeyword] = useState('')
    const [searchHistory, setSearchHistory] = useState<HistoryItemProp[]>([])
    const [showSearchResults, setShowSearchResults] = useState(false)

    const { addData, getAllData, deleteDataByKeys } =
        useDatabase<HistoryItemProp>({
            tableName: 'searchHistory',
            columns: {
                id: 'number',
                name: 'string',
            },
        })

    useEffect(() => {
        const setupData = async () => {
            setSearchHistory(await getAllData(true))
        }

        setupData()
    }, [])

    const onSearchSubmit = (text: string) => {
        if (!text) return
        const data = { id: Date.now(), name: text }

        addData(data).then(() => {
            setSearchHistory([...searchHistory, data])
        })
        setShowSearchResults(true)
    }

    const deleteSearchItem = (data: HistoryItemProp) => {
        deleteDataByKeys({ id: data.id }).then(() => {
            setSearchHistory(searchHistory.filter(item => item.id !== data.id))
        })
    }

    const historyRecommendations = [
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

    const renderRecentSearchedItem = (data: HistoryItemProp) => (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
                themeColor.BG_SECONDARY,
                false,
            )}>
            <View style={styles.recentSearchedItemContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IcHistory style={{ marginEnd: 8 }} />
                    <Text style={styles.recentSearchedItemText}>
                        {data.name}
                    </Text>
                </View>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple(
                        themeColor.BG_SECONDARY,
                        true,
                        24,
                    )}
                    onPress={() => deleteSearchItem(data)}>
                    <IcClose width={24} height={24} fill={baseColors.GRAY_2} />
                </TouchableNativeFeedback>
            </View>
        </TouchableNativeFeedback>
    )

    const renderSearchedResults = (data: GetBoardPostListResponse) => {}

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IcAngleLeft fill={baseColors.GRAY_2} />
                </TouchableOpacity>
                <TextInput
                    style={styles.textInput}
                    value={keyword}
                    onChangeText={text => setKeyword(text)}
                    inputMode='search'
                    placeholder='공동구매 및 중고거래 게시글 검색'
                    placeholderTextColor={themeColor.TEXT_SECONDARY}
                    onSubmitEditing={e => onSearchSubmit(e.nativeEvent.text)}
                />
            </View>
            {!showSearchResults ? (
                <View style={styles.bodyContainer}>
                    <Text style={styles.recommendationText}>맞춤 검색</Text>
                    <ScrollView
                        style={styles.recommendationScrollView}
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        {historyRecommendations.map((value, index) =>
                            RecommendationItem(value, index),
                        )}
                    </ScrollView>
                    <Text style={styles.recommendationText}>최근 검색</Text>
                    <FlatList
                        style={styles.historyFlatlist}
                        data={searchHistory}
                        renderItem={({ item }) =>
                            renderRecentSearchedItem(item)
                        }
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            ) : (
                <SearchTab keyword={keyword} />
            )}
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
            paddingVertical: 8,
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
