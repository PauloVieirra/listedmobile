// App.js
import React from 'react';
import Routes from './src/Routes'; 
import 'react-native-gesture-handler';
import { GlobalProvider } from './src/Context/Contexto';


export default function App() {
  return (
    
      <GlobalProvider>
      <Routes/> 
     </GlobalProvider>
   
  ) 
}
