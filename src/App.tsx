import { BrowserRouter as Router } from 'react-router-dom';
import { AuthGate } from './utils/AuthGate';
import { Layout } from './layout/Layout';
import AppRouter from './Router';
import { useAppSelector } from './store';
import { selectPlayerTheme } from './reducers/PlayerSlice';
import { useEffect } from 'react';


export const App = () => {

  const theme = useAppSelector(selectPlayerTheme);

  useEffect(() => {
    document.documentElement.setAttribute('colortheme', theme.color);
    document.documentElement.setAttribute('patterntheme', theme.pattern);
  }, [theme]);

  return (
    <Router>
      <AuthGate>
        <Layout>
          <AppRouter />
        </Layout>
      </AuthGate>
    </Router>
  );
};

export default App;
