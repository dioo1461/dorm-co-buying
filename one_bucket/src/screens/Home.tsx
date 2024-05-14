import React from 'react'
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const Home = (): React.JSX.Element => {
    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.menu}>
                    <View style={styles.menu_S}>
                        <Text>홈</Text>
                    </View>
                    <View style={styles.menu_L}>
                        <Text>자유게시판</Text>
                    </View>
                    <View style={styles.menu_L}>
                        <Text>거래게시판</Text>
                    </View>
                    <View style={styles.menu_L}>
                        <Text>중고게시판</Text>
                    </View>
                    <View style={styles.menu_S}>
                        <Text>설정</Text>
                    </View>
                </View>
                <View style={styles.title}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                        추천 거래글
                    </Text>
                </View>
                <ScrollView
                    pagingEnabled
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.post_list}>
                    <View style={styles.post}>
                        <Text>post1</Text>
                    </View>
                    <View style={styles.post}>
                        <Text>post2</Text>
                    </View>
                    <View style={styles.post}>
                        <Text>post3</Text>
                    </View>
                    <View style={styles.post}>
                        <Text>post4</Text>
                    </View>
                    <View style={styles.post}>
                        <Text>post5</Text>
                    </View>
                    <View style={styles.post}>
                        <Text>post6</Text>
                    </View>
                </ScrollView>
                <View style={styles.title}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                        내가 쓴 거래글
                    </Text>
                </View>
                <ScrollView
                    pagingEnabled
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.post_list}>
                    <View style={styles.post}>
                        <Text>post1</Text>
                    </View>
                    <View style={styles.post}>
                        <Text>post2</Text>
                    </View>
                    <View style={styles.post}>
                        <Text>post3</Text>
                    </View>
                    <View style={styles.post}>
                        <Text>post4</Text>
                    </View>
                </ScrollView>
                <View style={styles.title}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                        내가 참여한 거래글
                    </Text>
                </View>
                <ScrollView
                    pagingEnabled
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.post_list}>
                    <View style={styles.post}>
                        <Text>post1</Text>
                    </View>
                    <View style={styles.post}>
                        <Text>post2</Text>
                    </View>
                    <View style={styles.post}>
                        <Text>post3</Text>
                    </View>
                </ScrollView>
            </View>
        </ScrollView>
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
        width: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menu_L: {
        height: 50,
        width: (SCREEN_WIDTH - 100) / 3,
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
})

export default Home
