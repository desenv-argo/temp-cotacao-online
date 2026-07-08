import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import '../theme/prime-theme.css';

interface AppUIProviderProps {
  children: React.ReactNode;
}

const primeReactConfig = {
  ripple: true,
  inputStyle: 'outlined' as const,
  cssTransition: true,
  /** Acima da topbar fixa (1100) e de camadas MUI comuns; evita painel de dropdown “atrás” da UI. */
  zIndex: {
    modal: 1200,
    overlay: 12000,
    menu: 12000,
    tooltip: 1700,
    toast: 1300,
  },
};

const AppUIProvider: React.FC<AppUIProviderProps> = ({ children }) => {
  return (
    <PrimeReactProvider value={primeReactConfig}>
      {children}
    </PrimeReactProvider>
  );
};

export default AppUIProvider;
