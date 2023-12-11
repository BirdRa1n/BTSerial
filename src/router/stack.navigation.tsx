// In App.js in a new project

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//telas
import Home from '../screens/home';
import Splash from '../screens/splash';
import {useColorMode} from '@gluestack-style/react';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  const colormode = useColorMode();
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="splash"
          screenOptions={{
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: colormode === 'dark' ? 'black' : 'white', // Cor de fundo do header
            },
            contentStyle: {
              backgroundColor: colormode === 'dark' ? '#171717' : 'white',
            },
            headerTintColor: colormode === 'dark' ? 'white' : 'black', // Cor do título
            headerTitleStyle: {
              fontWeight: 'bold', // Peso da fonte do título
            },
          }}>
          <Stack.Screen
            name="splash"
            component={Splash}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="home"
            component={Home}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
export default StackNavigation;
