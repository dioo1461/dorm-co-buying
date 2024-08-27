import strings from '@/constants/strings'
import { useNavigation } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const Home: React.FC = (): React.JSX.Element => {
    const navigation = useNavigation()
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
    const flatListRef = useRef<FlatList>(null)

    const renderItem_Box = ({ item }: { item: string }) => (
        <View style={styles.postBox}>
            <View style={styles.postBox_thumbFrame}>
                <View style={styles.postBox_thumb}>
                    <Text>{item}</Text>
                </View>
                <View style={styles.postBox_part}>
                    <Text style={{color: "black"}}>0/10</Text>
                </View>
            </View>
            <View style={styles.postBox_cont}>
                <Text>{item}</Text>
            </View>
        </View>
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

    const [board, setBoard] = useState(0)
    const home = () => setBoard(0)
    const trade = () => setBoard(1)
    const used = () => setBoard(2)
    const free = () => setBoard(3)

    const showBoard = () => {
        if (board === 0)
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
            </View>
        )
        if (board === 1) return (
            <View>
                <FlatList
                    key={'trade'}
                    ref={flatListRef}
                    data={data}
                    renderItem={renderItem_Box}
                    keyExtractor={(item, index) => index.toString()}
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={onScrollEnd}
                    contentContainerStyle={styles.postList}
                    numColumns={3}
                />
                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: "lightyellow" }]}
                    onPress={() =>
                        navigation.navigate(strings.postGroupPurchaseScreenName)
                    }>
                    <Text style={styles.fabIcon}>+</Text>
                </TouchableOpacity>
            </View>
        )
        if (board === 2) return (
            <View>
                <FlatList
                    key={'used'}
                    ref={flatListRef}
                    data={data}
                    renderItem={renderItem_Box}
                    keyExtractor={(item, index) => index.toString()}
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={onScrollEnd}
                    contentContainerStyle={styles.postList}
                    numColumns={3}
                />
                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: "lightgreen" }]}
                    onPress={() =>
                        navigation.navigate(strings.postGroupPurchaseScreenName)
                    }>
                    <Text style={styles.fabIcon}>+</Text>
                </TouchableOpacity>
            </View>
        )
        if (board === 3) return (
            <View>
                <FlatList
                    key={'free'}
                    ref={flatListRef}
                    data={data}
                    renderItem={renderItem_Horz}
                    keyExtractor={(item, index) => index.toString()}
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={onScrollEnd}
                    contentContainerStyle={styles.postList}
                    numColumns={1}
                />
                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: "lightblue" }]}
                    onPress={() =>
                        navigation.navigate(strings.postGroupPurchaseScreenName)
                    }>
                    <Text style={styles.fabIcon}>+</Text>
                </TouchableOpacity>
            </View> 
        )
        return null;
    }

    return (
        <>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={styles.upperFrame}>
                        <TouchableOpacity onPress={home}>
                            <View style={{...styles.upperMenu, backgroundColor: board==0 ? "pink" : "white"}}>

                                <Text style={{color: "black"}}>홈</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={trade}>
                            <View style={{...styles.upperMenu, backgroundColor: board==1 ? "lightyellow" : "white"}}>
                                <Text style={{color: "black"}}>공동구매</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={used}>
                            <View style={{...styles.upperMenu, backgroundColor: board==2 ? "lightgreen" : "white"}}>
                                <Text style={{color: "black"}}>중고거래</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={free}>
                            <View style={{...styles.upperMenu, backgroundColor: board==3 ? "lightblue" : "white"}}>
                                <Text style={{color: "black"}}>자유게시판</Text>

                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>{showBoard()}</View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
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
    postList: {
        
    },
    postBox: {
        width: SCREEN_WIDTH / 3,
        height: (SCREEN_WIDTH / 3) * 1.3,
        alignItems: 'center',
    },
    postBox_thumbFrame: {
        width: SCREEN_WIDTH / 3,
        height: SCREEN_WIDTH / 3,
        justifyContent: "center",
        alignItems: "center",

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
        flexDirection: "row",

    },
    postHorz_cont: {
        height: SCREEN_HEIGHT / 8,
        width: (SCREEN_WIDTH) - (SCREEN_HEIGHT / 8),
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    postHorz_thumbFrame: {
        height: SCREEN_HEIGHT / 8,
        width: SCREEN_HEIGHT / 8,
        justifyContent: "center",
        alignItems: "center",

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
        color: 'black',
    },
})

export default Home
