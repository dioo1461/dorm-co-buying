import { baseColors } from '@/constants/colors'
import strings from '@/constants/strings'
import { AppContext } from '@/hooks/contexts/AppContext'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useContext, useState, useRef } from 'react'
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
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

    return (
        <>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={styles.menu}>
                        <View style={styles.menu_S}>
                            <Text>홈</Text>
                        </View>
                        <TouchableOpacity>
                            <View style={styles.menu_S}>
                                <Text>거래게시판</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.menu_S}>
                                <Text>중고게시판</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.menu_S}>
                                <Text>자유게시판</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
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
            </ScrollView>
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
