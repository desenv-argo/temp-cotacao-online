import { AppUIProvider } from './ui';
import { CotacaoDemoProvider } from './context/CotacaoDemoContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AppUIProvider>
      <CotacaoDemoProvider>
        <AppRoutes />
      </CotacaoDemoProvider>
    </AppUIProvider>
  );
}

export default App;
