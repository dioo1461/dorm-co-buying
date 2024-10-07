import { darkColors, Icolor, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { useEffect, useRef, useState } from 'react'
import {
    Appearance,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { stackNavigation } from '../navigation/NativeStackNavigation'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const Home: React.FC = (): JSX.Element => {
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

    const styles = createStyles(themeColor)
    const navigation = stackNavigation()
    const flatListRef = useRef<FlatList>(null)
    const [data, setData] = useState([
        'post1',
        'post2',
        'post3',
        'post4',
        'post5',
        'post6',
        'post7',
        'post8',
        'post9',
        'post10',
    ])

    const renderItem_Box = ({ item }: { item: string }) => (
        <TouchableOpacity style={styles.postBox}>
            <View style={styles.postBox_thumbFrame}>
                <View style={styles.postBox_thumb}>
                    <Text>{item}</Text>
                </View>
                <View style={styles.postBox_part}>
                    <Text style={{ color: 'black' }}>0/10</Text>
                </View>
            </View>
            <View style={styles.postBox_cont}>
                <Text>{item}</Text>
            </View>
        </TouchableOpacity>
    )

    const renderItem_Horz = ({ item }: { item: string }) => (
        <View style={styles.postHorz}>
            <View style={styles.postHorz_cont}>
                <Text>{item}</Text>
            </View>
            <View style={styles.postHorz_thumbFrame}>
                <View style={styles.postHorz_thumb}>
                    <Text>{item}</Text>
                </View>
            </View>
        </View>
    )

    const onScrollEnd = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x
        const contentWidth = event.nativeEvent.contentSize.width
        if (offsetX >= contentWidth - SCREEN_WIDTH) {
            flatListRef.current?.scrollToOffset({ animated: false, offset: 0 })
        }
    }

    return (
        <View>
            <View style={styles.homeTitle}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                    추천 거래글
                </Text>
            </View>
            <FlatList
                ref={flatListRef}
                data={data}
                renderItem={renderItem_Box}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onScrollEnd}
                contentContainerStyle={styles.postList}
            />
            <View style={styles.homeTitle}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                    내가 참여한 거래글
                </Text>
            </View>
            <FlatList
                ref={flatListRef}
                data={data}
                renderItem={renderItem_Box}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onScrollEnd}
                contentContainerStyle={styles.postList}
            />
            <View style={styles.homeTitle}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                    내가 쓴 거래글
                </Text>
            </View>
            <FlatList
                key={'home'}
                ref={flatListRef}
                data={data}
                renderItem={renderItem_Box}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onScrollEnd}
                contentContainerStyle={styles.postList}
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateMarketPost')}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

const createStyles = (theme: Icolor) =>
    StyleSheet.create({
        upperFrame: {
            height: 50,
            flexDirection: 'row',
        },
        upperMenu: {
            height: 50,
            width: SCREEN_WIDTH / 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 0.5,
        },
        homeTitle: {
            height: 30,
            marginStart: 14,
        },
        postList: {},
        postBox: {
            width: SCREEN_WIDTH / 3,
            height: (SCREEN_WIDTH / 3) * 1.3,
            alignItems: 'center',
        },
        postBox_thumbFrame: {
            width: SCREEN_WIDTH / 3,
            height: SCREEN_WIDTH / 3,
            justifyContent: 'center',
            alignItems: 'center',
        },
        postBox_thumb: {
            width: SCREEN_WIDTH / 3 - 5,
            height: SCREEN_WIDTH / 3 - 5,
            backgroundColor: 'lightgray',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            borderWidth: 0,
        },
        postBox_part: {
            width: 50,
            height: 20,
            marginTop: -20,
            marginLeft: SCREEN_WIDTH / 6 + 10,
            backgroundColor: 'lightblue',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            borderWidth: 0.3,
        },
        postBox_cont: {
            width: SCREEN_WIDTH / 3,
            height: (SCREEN_WIDTH / 3) * 0.3,
            paddingHorizontal: 10,
        },
        postHorz: {
            height: SCREEN_HEIGHT / 8,
            flexDirection: 'row',
        },
        postHorz_cont: {
            height: SCREEN_HEIGHT / 8,
            width: SCREEN_WIDTH - SCREEN_HEIGHT / 8,
            justifyContent: 'center',
            paddingHorizontal: 20,
        },
        postHorz_thumbFrame: {
            height: SCREEN_HEIGHT / 8,
            width: SCREEN_HEIGHT / 8,
            justifyContent: 'center',
            alignItems: 'center',
        },
        postHorz_thumb: {
            height: SCREEN_HEIGHT / 8 - 5,
            width: SCREEN_HEIGHT / 8 - 5,
            backgroundColor: 'lightgray',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            borderWidth: 0,
        },
        fab: {
            backgroundColor: theme.BUTTON_BG,
            position: 'absolute',
            width: 56,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
            right: 25,
            bottom: 70,
            borderRadius: 30,
            elevation: 8,
        },
        fabIcon: {
            fontSize: 40,
            color: theme.BUTTON_TEXT,
        },
    })

export default Home
