import { baseColors } from '@/constants/colors'
import { AppContext } from '@/hooks/contexts/AppContext'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useContext } from 'react'
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const Home: React.FC = (): React.JSX.Element => {
    const navigation = useNavigation()
    const { themeColor } = useContext(AppContext)

    return (
        <>
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
                        <View style={styles.post}>
                            <Text>post7</Text>
                        </View>
                        <View style={styles.post}>
                            <Text>post8</Text>
                        </View>
                        <View style={styles.post}>
                            <Text>post9</Text>
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
                        <View style={styles.post}>
                            <Text>post5</Text>
                        </View>
                        <View style={styles.post}>
                            <Text>post6</Text>
                        </View>
                        <View style={styles.post}>
                            <Text>post7</Text>
                        </View>
                        <View style={styles.post}>
                            <Text>post8</Text>
                        </View>
                        <View style={styles.post}>
                            <Text>post9</Text>
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
                        <View style={styles.post}>
                            <Text>post4</Text>
                        </View>
                        <View style={styles.post}>
                            <Text>post5</Text>
                        </View>
                        <View style={styles.post}>
                            <Text>post6</Text>
                        </View>
                        <View style={styles.post}>
                            <Text>post7</Text>
                        </View>
                        <View style={styles.post}>
                            <Text>post8</Text>
                        </View>
                        <View style={styles.post}>
                            <Text>post9</Text>
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: themeColor.ICON_BG }]}
                onPress={() => navigation.navigate('PostGroupPurchase')}>
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
