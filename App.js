import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Walkthrough, PhoneNumber, ViewNotification} from './screens';
import BottomTabNavigation from './navigation/BottomTabNavigation';
import SplashScreen from 'react-native-splash-screen';
import {useEffect} from 'react';
const Stack = createNativeStackNavigator();
export default function App() {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 300);
  });
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="Walkthrough">
          <Stack.Screen
            name="BottomTabNavigation"
            component={BottomTabNavigation}
          />
          <Stack.Screen name="Walkthrough" component={Walkthrough} />
          <Stack.Screen name="PhoneNumber" component={PhoneNumber} />
          <Stack.Screen name="ViewNotification" component={ViewNotification} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
