import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import BookForm from './src/screens/BookForm';
import BookDetail from './src/screens/BookDetail';
import { colors } from './src/colors';
import { RootStackParamList } from './src/types/book';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: 'bold' },
          }}>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: 'Quản lý thư viện' }}
          />
          <Stack.Screen
            name="BookForm"
            component={BookForm}
            options={({ route }) => ({
              title: route.params?.book ? 'Sửa sách' : 'Thêm sách mới',
            })}
          />
          <Stack.Screen
            name="BookDetail"
            component={BookDetail}
            options={{ title: 'Chi tiết sách' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
