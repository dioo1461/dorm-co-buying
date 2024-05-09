import React from "react";
import {View, Text, Dimensions, StyleSheet, ScrollView} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");


const Home = (): React.JSX.Element => {
    return (
        <View style={{flex: 1}}>
            <View style={styles.logo}>
                <Text style={{fontSize: 30, fontWeight: 'bold', color: 'white'}}>한바구니</Text>
            </View>
        <View horizontal style={styles.menu}>
            <View style={styles.menu_S}><Text>홈</Text></View>
            <View style={styles.menu_L}><Text>자유게시판</Text></View>
            <View style={styles.menu_L}><Text>거래게시판</Text></View>
            <View style={styles.menu_L}><Text>중고게시판</Text></View>
            <View style={styles.menu_S}><Text>설정</Text></View>
        </View>
        <View style={styles.title}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>추천 거래글</Text>
        </View>
        <ScrollView pagingEnabled horizontal contentContainerStyle={styles.post_list}>
            <View style={styles.post}><Text>post1</Text></View>
            <View style={styles.post}><Text>post2</Text></View>
            <View style={styles.post}><Text>post3</Text></View>
            <View style={styles.post}><Text>post4</Text></View>
            <View style={styles.post}><Text>post5</Text></View>
        </ScrollView>
        <View style={styles.title}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>내가 쓴 거래글</Text>
        </View>
        <ScrollView pagingEnabled horizontal contentContainerStyle={styles.post_list}>
            <View style={styles.post}><Text>post1</Text></View>
            <View style={styles.post}><Text>post2</Text></View>
            <View style={styles.post}><Text>post3</Text></View>
            <View style={styles.post}><Text>post4</Text></View>
        </ScrollView>
        <View style={styles.title}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>내가 참여한 거래글</Text>
        </View>
        <ScrollView pagingEnabled horizontal contentContainerStyle={styles.post_list}>
            <View style={styles.post}><Text>post1</Text></View>
            <View style={styles.post}><Text>post2</Text></View>
            <View style={styles.post}><Text>post3</Text></View>
        </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    logo: {
      height: 100,
      backgroundColor: "navy", 
      justifyContent: "center",
    },
    menu:{
      height:50,
      backgroundColor: "gray",
      flexDirection: "row",
    },
    menu_S:{
      height: 50,
      width: 50,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
    },
    menu_L:{
      height: 50,
      width: (SCREEN_WIDTH-100)/3,
      backgroundColor: "gray",
      justifyContent: "center",
      alignItems: "center",
    },
    title:{
      height:30,
      backgroundColor: "white"
    },
    post_list:{
      backgroundColor: "white",
    },
    post:{
      width: SCREEN_WIDTH/2,
      backgroundColor: "white",
    },
  })
  
export default Home
