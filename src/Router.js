import React from 'react';
import { Stack, Router, Scene } from 'react-native-router-flux';
import LoginPage from './components/LoginPage';
import AbsenPage from './components/AbsenPage';

const RouterComponent = () => {
  return (
    <Router navigationBarStyle={{ backgroundColor: '#4aa3f2' }} titleStyle={{ color: '#fff' }}>
      <Stack key="root" hideNavBar>
        <Scene key="auth">
          <Scene key="login" component={LoginPage} title="Login" initial />
        </Scene>
        <Scene key="main">
          <Scene key="absen" component={AbsenPage} title="Absen" />
        </Scene>
      </Stack>
    </Router>
  );
};

export default RouterComponent;
