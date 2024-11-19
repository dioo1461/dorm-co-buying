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
import SQLite from 'react-native-sqlite-storage'
import { stackNavigation } from './navigation/NativeStackNavigation'

type HistoryItemProp = {
    id: number
    name: string
    category: string
}

const Search: React.FC = (): React.JSX.Element => {
    const { themeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
    }))

    var [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null)

    const [searchHistory, setSearchHistory] = useState<HistoryItemProp[]>([])

    useEffect(() => {
        // SQLite.enablePromise(true)
        setDb(
            SQLite.openDatabase(
                {
                    name: 'searchHistoryDB.db',
                    location: 'default',
                    createFromLocation: 1,
                },
                DB => {
                    console.log('Database opened')
                    createTable()
                },
                error => {
                    console.log('Error:', error)
                },
            ),
        )
    }, [])

    useEffect(() => {
        loadSearchHistory()
    }, [db])

    const createTable = () => {
        db?.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS searchHistory (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category TEXT);',
                [],
                () => {
                    console.log('Table created successfully')
                },
                error => {
                    console.log('Error creating table:', error)
                },
            )
        })
    }

    const onSearchSubmit = (text: string) => {
        if (!text) return

        db?.transaction(tx => {
            tx.executeSql(
                `INSERT INTO searchHistory (name, category) VALUES (?, 'default')`,
                [text],
                () => {
                    loadSearchHistory()
                },
                error => {
                    console.log('Error:', error)
                },
            )
        })
    }

    const loadSearchHistory = () => {
        db?.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM searchHistory ORDER BY id DESC',
                [],
                (_, results) => {
                    var history: HistoryItemProp[] = []
                    for (let i = 0; i < results.rows.length; i++) {
                        history.push({
                            id: results.rows.item(i).id,
                            name: results.rows.item(i).name,
                            category: results.rows.item(i).category,
                        })
                    }
                    setSearchHistory(history)
                },
                error => {
                    console.log('Error:', error)
                },
            )
        })
    }

    const deleteSearchItem = (data: HistoryItemProp) => {
        db?.transaction(tx => {
            tx.executeSql(
                'DELETE FROM searchHistory WHERE id = ?;',
                [data.id],
                () => {
                    loadSearchHistory() // 검색 기록 다시 불러오기
                },
                error => {
                    console.log('Error deleting search item:', error)
                },
            )
        })
    }

    const styles = CreateStyles(themeColor)
    const navigation = stackNavigation()

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

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IcAngleLeft fill={baseColors.GRAY_2} />
                </TouchableOpacity>
                <TextInput
                    style={styles.textInput}
                    inputMode='search'
                    placeholder='공동구매 및 중고거래 게시글 검색'
                    placeholderTextColor={themeColor.TEXT_SECONDARY}
                    onSubmitEditing={e => onSearchSubmit(e.nativeEvent.text)}
                />
            </View>
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
            </View>
            <FlatList
                style={styles.historyFlatlist}
                data={searchHistory}
                renderItem={({ item }) => renderRecentSearchedItem(item)}
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
