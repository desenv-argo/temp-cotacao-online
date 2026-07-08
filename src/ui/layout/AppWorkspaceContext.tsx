import React, { createContext, useContext } from 'react';

const AppWorkspaceContext = createContext(false);

interface AppWorkspaceProviderProps {
  children: React.ReactNode;
}

export const AppWorkspaceProvider: React.FC<AppWorkspaceProviderProps> = ({ children }) => (
  <AppWorkspaceContext.Provider value>{children}</AppWorkspaceContext.Provider>
);

export const useIsInsideAppWorkspace = () => useContext(AppWorkspaceContext);
