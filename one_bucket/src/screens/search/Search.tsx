import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import IcClose from '@/assets/drawable/ic-close.svg'
import IcFilter from '@/assets/drawable/ic-filter.svg'
import IcSearch from '@/assets/drawable/ic-select-search.svg'
import IcHistory from '@/assets/drawable/ic-history.svg'
import Backdrop from '@/components/Backdrop'
import { baseColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { useEffect, useState, useRef } from 'react'
import {
    Animated,
    FlatList,
    SafeAreaView,
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
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import SearchTab from '../navigation/SearchTab'

const Tab = createMaterialTopTabNavigator()

// TODO: 같은 검색어 중복 저장 안 되게 하기
type HistoryItemProp = {
    name: string
    option: number
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

    const { addData, getAllData, deleteDataByKeys, dropTable } =
        useDatabase<HistoryItemProp>({
            tableName: 'searchHistory',
            columns: {
                name: 'string',
                option: 'number',
            },
            debug: true,
        })

    useEffect(() => {
        const setupData = async () => {
            setSearchHistory(await getAllData(true))
        }
        setupData()
    }, [])

    const onSearchSubmit = async (text: string, option: number) => {
        if (!text) return
        const data = { name: text, option: option }
        updateSearchItem(data)
        setShowSearchResults(true)
    }

    const deleteSearchItem = (data: HistoryItemProp) => {
        deleteDataByKeys({ name: data.name, option: data.option }).then(async () => {
            setSearchHistory(await getAllData(true))
        })
    }

    const updateSearchItem = (data: HistoryItemProp) => {
        deleteDataByKeys(data).then(async () => {
            addData(data).then(async () => {
                setSearchHistory(await getAllData(true))
            })
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

    const optionList = ['제목 + 내용', '제목만', '내용만']
    const [option, setOption] = useState(0)

    const RecommendationItem = (name: string, key: number) => (
        <TouchableOpacity 
            key={key}
            onPress={()=>{
                setKeyword(name)
                setOption(0)
                onSearchSubmit(name, 0)
            }}>
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

    const onSearchHistoryItemPress = (data: HistoryItemProp) => {
        const ndata = { name: data.name, option: data.option }
        updateSearchItem(ndata)
        setKeyword(data.name)
        setOption(data.option)
        setShowSearchResults(true)
    }

    const renderRecentSearchedItem = (data: HistoryItemProp) => (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
                themeColor.BG_SECONDARY,
                false,
            )}
            onPress={() => onSearchHistoryItemPress(data)}>
            <View style={styles.recentSearchedItemContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IcHistory style={{ marginEnd: 8 }} />
                    <Text style={styles.recentSearchedItemText}>
                        {data.name}
                    </Text>
                    <Text style={styles.recentSearchedItemOptionText}>
                        {optionList[data.option]}
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

    const [expanded, setExpanded] = useState(false)
    const animation = useRef(new Animated.Value(0)).current

    const toggleDropdown = () => {
        setExpanded(!expanded)
        Animated.timing(animation, {
            toValue: expanded ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start()
    }

    const dropdownAnimatedStyle = {
        height: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 125],
        }),
        opacity: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        }),
    }

    const buttonAnimatedStyle = {
        opacity: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
        }),
    }

    return (
        <View style={styles.container}>
            <Backdrop enabled={expanded} onPress={toggleDropdown} />
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IcAngleLeft fill={baseColors.GRAY_2} />
                </TouchableOpacity>
                <TextInput
                    style={styles.textInput}
                    value={keyword}
                    onChangeText={text => setKeyword(text)}
                    onFocus={() => setShowSearchResults(false)}
                    inputMode='search'
                    returnKeyType='search'
                    placeholder='공동구매 및 중고거래 게시글 검색'
                    placeholderTextColor={themeColor.TEXT_SECONDARY}
                    onSubmitEditing={e => onSearchSubmit(e.nativeEvent.text, option)}
                />
                <View
                style={[
                    styles.boardTypeToggleButton,
                    { backgroundColor: baseColors.GRAY_3 },
                ]}>
                    <TouchableOpacity onPress={toggleDropdown}>
                        <IcFilter />
                    </TouchableOpacity>
                </View>
                <Animated.View
                    style={[styles.boardTypeToggleButton, buttonAnimatedStyle]}>
                    <TouchableOpacity onPress={()=>{
                            toggleDropdown()
                            setShowSearchResults(false)
                        }}>
                        <IcFilter />
                    </TouchableOpacity>
                </Animated.View>
                <TouchableOpacity 
                    onPress={()=>{onSearchSubmit(keyword, option)}}
                    disabled={!keyword}>
                    <IcSearch />
                </TouchableOpacity>
                <Animated.View
                    style={[
                        styles.boardTypeSelectionWrapper,
                        dropdownAnimatedStyle,
                    ]}>
                    <ScrollView
                        style={styles.boardTypeSelectionContainer}
                        contentContainerStyle={styles.boardTypeSelectionContent}
                        showsVerticalScrollIndicator={false}>
                        {optionList.map(
                            (key, index) => (
                                <TouchableNativeFeedback
                                        key={index}
                                        // background={touchableNativeFeedbackBg()}
                                        onPress={() => {
                                            setOption(index)
                                            toggleDropdown()
                                        }}>
                                        <View style={styles.boardTypeItem}>
                                            <Text
                                                style={[
                                                    styles.boardTypeText,
                                                    option === index &&
                                                        styles.boardTypeTextActive,
                                                ]}>
                                                {optionList[index]}
                                            </Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                ),
                        )}
                    </ScrollView>
                </Animated.View>
            </View>
            {!showSearchResults ? (
                <View>
                    <Text style={styles.recommendationText}>맞춤 검색</Text>
                    <ScrollView
                        style={styles.recommendationScrollView}
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        {historyRecommendations.map((value, index) =>
                            RecommendationItem(value, index),
                        )}
                    </ScrollView>
                    <View style={{flexDirection: "row", justifyContent:"space-between"}}>
                        <Text style={styles.recommendationText}>최근 검색</Text>
                        <TouchableOpacity onPress={()=>{
                            dropTable()
                            setSearchHistory([])
                        }}>
                            <Text style={styles.historyResetText}>전체 삭제</Text>
                        </TouchableOpacity>
                    </View>
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
                <SearchTab 
                    keyword={keyword}
                    option={option}
                />
            )}
        </View>
    )
}

const CreateStyles = (theme: Icolor) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 20,
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
            marginEnd: 15,
            paddingVertical: 8,
            paddingHorizontal: 16,
        },
        boardTypeToggleButton: {
            position: 'absolute',
            right: 45,
            padding: 6,
            borderRadius: 10,
            zIndex: 2,
            backgroundColor: theme.BG_SECONDARY,
        },
        boardTypeSelectionWrapper: {
            position: 'absolute',
            top: 60,
            right: 14,
            width: 100,
            borderRadius: 10,
            backgroundColor:
                theme === lightColors ? baseColors.WHITE : baseColors.GRAY_2,
            elevation: 4,
            zIndex: 2,
        },
        boardTypeSelectionContainer: {
            maxHeight: 200,
        },
        boardTypeSelectionContent: {
            paddingVertical: 5,
        },
        boardTypeItem: {
            paddingVertical: 12,
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        boardTypeText: {
            fontSize: 14,
            color: theme === lightColors ? theme.TEXT_SECONDARY : theme.TEXT,
            fontFamily: 'NanumGothic',
        },
        boardTypeTextActive: {
            color: baseColors.SCHOOL_BG,
            fontFamily: 'NanumGothic-Bold',
        },
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
        recentSearchedItemOptionText: {
            color: theme.TEXT_TERTIARY,
            fontSize: 12,
            fontFamily: 'NanumGothic',
            paddingStart: 8,
        },
        historyFlatlist: {
            marginTop: 14,
        },
        historyResetText: {
            color: theme.TEXT_SECONDARY,
            marginHorizontal: 20,
            fontSize: 14,
            fontFamily: 'NanumGothic',
        },
    })

export default Search
