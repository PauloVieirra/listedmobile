// src/Routes/auth.routes.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Signin from '../Screens/Signin';
import Signup from '../Screens/Signup';
import Onboard from '../Screens/Onboarding';
import { useGlobalContext } from '../Context/Contexto';


const Stack = createStackNavigator();

const AuthRoutes = () => {
  const { themeStyle } = useGlobalContext();
  return (
 <> 
    <Stack.Navigator>
     
       <Stack.Screen name='Onboard' component={Onboard} options={{
        headerShown: false
       }}
       />

      <Stack.Screen name="Signin" component={Signin}  options={{
          headerShown: false, 
        }}
        />
      <Stack.Screen name='Signup' component={Signup} 
      options={{
          headerShown: false, 
        }}
      />
    </Stack.Navigator> 
</>
  );
};

export default AuthRoutes;
