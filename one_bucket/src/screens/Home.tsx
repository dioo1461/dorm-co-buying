import strings from '@/constants/strings'
import { AppContext } from '@/hooks/useContext/AppContext'
import { useNavigation } from '@react-navigation/native'
import React, { useContext, useRef, useState } from 'react'
import {
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const Home: React.FC = (): React.JSX.Element => {
    
    
    const navigation = useNavigation()
    const { themeColor } = useContext(AppContext)
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
    ])
    const flatListRef = useRef<FlatList>(null)

    const renderItem = ({ item }: { item: string }) => (
        <View style={styles.post}>
            <Text>{item}</Text>
        </View>
    )

    const onScrollEnd = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x
        const contentWidth = event.nativeEvent.contentSize.width
        if (offsetX >= contentWidth - SCREEN_WIDTH) {
            flatListRef.current?.scrollToOffset({ animated: false, offset: 0 })
        }
    }

    const [board, setBoard] = useState(0);
    const home = () => setBoard(0);
    const trade = () => setBoard(1);
    const used = () => setBoard(2);
    const free = () => setBoard(3);

    const showBoard = () => {
        if (board === 0) return (
            <View>
                <View style={styles.title}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            추천 거래글
                        </Text>
                    </View>
                    <FlatList
                        ref={flatListRef}
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={onScrollEnd}
                        contentContainerStyle={styles.post_list}
                    />
                    <View style={styles.title}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            내가 참여한 거래글
                        </Text>
                    </View>
                    <FlatList
                        ref={flatListRef}
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={onScrollEnd}
                        contentContainerStyle={styles.post_list}
                    />
                    <View style={styles.title}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                            내가 쓴 거래글
                        </Text>
                    </View>
                    <FlatList
                        ref={flatListRef}
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={onScrollEnd}
                        contentContainerStyle={styles.post_list}
                    />
            </View>
        )
        if (board === 1) return (
            <ScrollView pagingEnabled contentContainerStyle={styles.post_list_vert}>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post1</Text></View>
                <View style={styles.post_thumb}><Text>img1</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post2</Text></View>
                <View style={styles.post_thumb}><Text>img2</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post3</Text></View>
                <View style={styles.post_thumb}><Text>img3</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post4</Text></View>
                <View style={styles.post_thumb}><Text>img4</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post5</Text></View>
                <View style={styles.post_thumb}><Text>img5</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post6</Text></View>
                <View style={styles.post_thumb}><Text>img6</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post7</Text></View>
                <View style={styles.post_thumb}><Text>img7</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post8</Text></View>
                <View style={styles.post_thumb}><Text>img8</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post9</Text></View>
                <View style={styles.post_thumb}><Text>img9</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post10</Text></View>
                <View style={styles.post_thumb}><Text>img10</Text></View>
                </View>
            </ScrollView>
        )
        if (board === 2) return (
            <ScrollView pagingEnabled contentContainerStyle={styles.post_list_vert}>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post1</Text></View>
                <View style={styles.post_thumb}><Text>img1</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post2</Text></View>
                <View style={styles.post_thumb}><Text>img2</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post3</Text></View>
                <View style={styles.post_thumb}><Text>img3</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post4</Text></View>
                <View style={styles.post_thumb}><Text>img4</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post5</Text></View>
                <View style={styles.post_thumb}><Text>img5</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post6</Text></View>
                <View style={styles.post_thumb}><Text>img6</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post7</Text></View>
                <View style={styles.post_thumb}><Text>img7</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post8</Text></View>
                <View style={styles.post_thumb}><Text>img8</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post9</Text></View>
                <View style={styles.post_thumb}><Text>img9</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post10</Text></View>
                <View style={styles.post_thumb}><Text>img10</Text></View>
                </View>
            </ScrollView>
        )
        if (board === 3) return (
            <ScrollView pagingEnabled contentContainerStyle={styles.post_list_vert}>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post1</Text></View>
                <View style={styles.post_thumb}><Text>img1</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post2</Text></View>
                <View style={styles.post_thumb}><Text>img2</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post3</Text></View>
                <View style={styles.post_thumb}><Text>img3</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post4</Text></View>
                <View style={styles.post_thumb}><Text>img4</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post5</Text></View>
                <View style={styles.post_thumb}><Text>img5</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post6</Text></View>
                <View style={styles.post_thumb}><Text>img6</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post7</Text></View>
                <View style={styles.post_thumb}><Text>img7</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post8</Text></View>
                <View style={styles.post_thumb}><Text>img8</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post9</Text></View>
                <View style={styles.post_thumb}><Text>img9</Text></View>
                </View>
                <View style={styles.post_vert}>
                <View style={styles.post_cont}><Text>post10</Text></View>
                <View style={styles.post_thumb}><Text>img10</Text></View>
                </View>
            </ScrollView>
        )
        return null;
    }

    return (
        <>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={styles.menu}>
                        <TouchableOpacity onPress={home}>
                            <View style={{...styles.menu_S, backgroundColor: board==0 ? "yellow" : "white"}}>
                                <Text>홈</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={trade}>
                            <View style={{...styles.menu_S, backgroundColor: board==1 ? "yellow" : "white"}}>
                                <Text>거래게시판</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={used}>
                            <View style={{...styles.menu_S, backgroundColor: board==2 ? "yellow" : "white"}}>
                                <Text>중고게시판</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={free}>
                            <View style={{...styles.menu_S, backgroundColor: board==3 ? "yellow" : "white"}}>
                                <Text>자유게시판</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>{showBoard()}</View>
                </View>
            </View>
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: themeColor.ICON_BG }]}
                onPress={() =>
                    navigation.navigate(strings.postGroupPurchaseScreenName)
                }>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    menu: {
        height: 50,
        backgroundColor: 'gray',
        flexDirection: 'row',
    },
    menu_S: {
        height: 50,
        width: SCREEN_WIDTH / 4,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        height: 30,
        backgroundColor: 'white',
        marginStart: 14,
    },
    post_list: {
        backgroundColor: 'white',
    },
    post: {
        width: SCREEN_WIDTH / 3,
        height: (SCREEN_WIDTH / 3) * 1.3,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    post_list_vert:{
        backgroundColor: "white",
      },
      post_vert:{
        height: SCREEN_HEIGHT/8,
        backgroundColor: "blue",
        flexDirection: "row",
      },
      post_cont:{
        height: SCREEN_HEIGHT/8,
        width: (SCREEN_WIDTH)-(SCREEN_HEIGHT/8),
        backgroundColor: "white",
        justifyContent: "center",
      },
      post_thumb:{
        height: SCREEN_HEIGHT/8,
        width: SCREEN_HEIGHT/8,
        backgroundColor: "gray",
        justifyContent: "center",
        alignItems: "center",
      },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
        borderRadius: 30,
        elevation: 8,
    },
    fabIcon: {
        fontSize: 40,
        color: 'white',
    },
})

export default Home
