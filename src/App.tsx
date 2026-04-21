import { BrowserRouter as Router } from 'react-router-dom';
import { AuthGate } from './utils/AuthGate';
import { Layout } from './layout/Layout';
import AppRouter from './Router';
import { useAppSelector } from './store';
import { selectPlayerTheme } from './reducers/PlayerSlice';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';


export const App = () => {

  const theme = useAppSelector(selectPlayerTheme);
  dayjs.extend(utc);
  dayjs.extend(timezone);

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
