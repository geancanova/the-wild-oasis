import { createContext, useContext } from "react";
import { useSettings as useSettingsApi } from "../features/settings/useSettings";
import Spinner from "../ui/Spinner";

const SettingsContext = createContext();

function SettingsProvider({ children }) {
  const { isLoading, error, settings } = useSettingsApi();

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    console.error(error);
  }

  return (
    <SettingsContext.Provider value={{ ...settings }}>
      {children}
    </SettingsContext.Provider>
  );
}

function useSettings() {
  const context = useContext(SettingsContext);

  if (context === undefined) {
    throw new Error(
      "SettingsContext was used outside of SettingsContextProvider"
    );
  }

  return context;
}

export { SettingsProvider, useSettings };
