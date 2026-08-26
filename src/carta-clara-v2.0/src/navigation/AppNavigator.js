import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import ProcessingScreen from '../screens/ProcessingScreen';
import SummaryScreen from '../screens/SummaryScreen';
import DraftScreen from '../screens/DraftScreen';
import LetterDetailScreen from '../screens/LetterDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: colors.ivory },
          headerTintColor: colors.tealDark,
          headerTitleStyle: { fontFamily: 'Fraunces_600SemiBold' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.ivory },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Upload" component={UploadScreen} options={{ title: 'Nueva carta' }} />
        <Stack.Screen
          name="Processing"
          component={ProcessingScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="Summary" component={SummaryScreen} options={{ title: 'Resumen' }} />
        <Stack.Screen name="Draft" component={DraftScreen} options={{ title: 'Borrador' }} />
        <Stack.Screen
          name="LetterDetail"
          component={LetterDetailScreen}
          options={{ title: 'Detalle' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
