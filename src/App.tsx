import { BrowserRouter as Router } from 'react-router-dom';
import { AuthGate } from './utils/AuthGate';
import { Layout } from './layout/Layout';
import AppRouter from './Router';


export const App = () => {
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
