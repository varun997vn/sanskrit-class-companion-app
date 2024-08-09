import React, { createContext, useState, ReactNode, useContext } from "react";

// Define the shape of the context state
interface SelectedWordsContextType {
  sharedState: { [key: string]: string[] };
  setSharedState: React.Dispatch<
    React.SetStateAction<{ [key: string]: string[] }>
  >;
}

// Create a Context with a default value
const SelectedWordsContext = createContext<
  SelectedWordsContextType | undefined
>(undefined);

// Create a provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sharedState, setSharedState] = useState<{ [key: string]: string[] }>(
    {}
  );

  return (
    <SelectedWordsContext.Provider value={{ sharedState, setSharedState }}>
      {children}
    </SelectedWordsContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useSelectedWordsContext = (): SelectedWordsContextType => {
  const context = useContext(SelectedWordsContext);
  if (!context) {
    throw new Error(
      "useSelectedWordsContext must be used within an AppProvider"
    );
  }
  return context;
};
