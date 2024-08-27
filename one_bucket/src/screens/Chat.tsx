import IcAngleLeft from '@/assets/drawable/ic-angle-left.svg'
import { baseColors } from '@/constants/colors'
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

const Chat: React.FC = (): React.JSX.Element => {
    
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
        'post10'
    ])
    const flatListRef = useRef<FlatList>(null)

    const renderItem_Horz = ({ item }: { item: string }) => (
        <View style={styles.chatRoom}>
            <View style={styles.chatRoom_thumbFrame}>
                <View style={styles.chatRoom_thumb}>
                    <Text>{item}</Text>
                </View>
                <View style={styles.chatRoom_part}>
                    <Text style={{color: "black"}}>10</Text>
                </View>
            </View>
            <TouchableOpacity onPress={room}>
                <View style={styles.chatRoom_subj}>
                    <Text style={{fontWeight: 'bold'}}>{item}</Text>
                </View>
                <View style={styles.chatRoom_recnt}>
                    <Text>어쩌구저쩌구</Text>
                </View>
                <View style={styles.chatRoom_newmsgFrame}>
                    <View style={styles.chatRoom_newmsg}>
                        <Text style={{color: "white"}}>1</Text>
                    </View>
                </View>
            </TouchableOpacity>
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
    const room = () => setBoard(1);

    const showRoom = () => {
        if (board === 0) return (
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
        )
        if (board === 1) return (
            <View>
                <View style={styles.upperFrame}>
                    <TouchableOpacity onPress={home}>
                        <IcAngleLeft
                            style={styles.upperMenu}
                            fill={baseColors.GRAY_1}
                        />
                    </TouchableOpacity>
                    <Text>item name</Text>
                </View>
                <Text>chat</Text>
            </View>
        )
        return null;
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View>{showRoom()}</View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    upperFrame: {
        height: 50,
        backgroundColor: 'lightblue',
        flexDirection: 'row',
        borderBottomWidth: 0.5,
    },
    upperMenu: {
        height: 50,
        width: 50,
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 0.5,
    },
    postList: {
        backgroundColor: 'white',
    },
    chatRoom:{
        height: SCREEN_HEIGHT / 8,
        backgroundColor: "white",
        flexDirection: "row",
    },
    chatRoom_subj:{
        height: 30,
        width: (SCREEN_WIDTH) - (SCREEN_HEIGHT / 8) - 50,
        backgroundColor: "white",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    chatRoom_recnt:{
        height: (SCREEN_HEIGHT / 8) - 30,
        width: (SCREEN_WIDTH) - (SCREEN_HEIGHT / 8) - 50,
        backgroundColor: "white",
        justifyContent: "center",
        paddingHorizontal: 20,

    },
    chatRoom_newmsgFrame:{
        height: SCREEN_HEIGHT / 8,
        width: 50,
        marginTop: -(SCREEN_HEIGHT / 8),
        marginLeft: (SCREEN_WIDTH) - (SCREEN_HEIGHT / 8) - 50,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    chatRoom_newmsg:{
        height: 25,
        width: 30,
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
    },
    chatRoom_thumbFrame:{
        height: SCREEN_HEIGHT / 8,
        width: SCREEN_HEIGHT / 8,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    chatRoom_thumb:{
        height: (SCREEN_HEIGHT / 8) - 5,
        width: (SCREEN_HEIGHT / 8) - 5,
        backgroundColor: "lightgray",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 0,
    },
    chatRoom_part:{
        width: 40,
        height: 20,
        marginTop: -20,
        marginLeft: (SCREEN_WIDTH / 16) + 25,
        backgroundColor: "lightblue",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        borderWidth: 0.3,
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

export default Chat
