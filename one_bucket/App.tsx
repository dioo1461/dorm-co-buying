/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Home from 'screens/Home';
import { mainRoutes } from 'screens/navigation/mainRoutes';


// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;
// 
// function Section({ children, title }: SectionProps): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const MainScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
    // screenOptions={({ route }) => ({
    //   tabBarLabel: route.name,
    //   tabBarActiveBackgroundColor: 'skyblue',
    //   tabBarInactiveBackgroundColor: '#c6cbef',
    //   tabBarActiveTintColor: 'blue',
    //   tabBarInactiveTintColor: '#fff',
    //   // tabBarLabelPosition: 'beside-icon',
    //   tabBarLabelPosition: 'below-icon',
    //   headerShown: false
    // })}
    >
      {mainRoutes.map(route => (
        <Tab.Screen
          key={`screen-${route.name}`}
          name={route.name}
          component={route.component}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <Image
                  source={focused ? route.activeIcon : route.inactiveIcon}
                  style={{width:20, height:20}}
                />
              )
            }
          }}
        />
      ))}
    </Tab.Navigator>
  )
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name='Main' 
          component={MainScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
