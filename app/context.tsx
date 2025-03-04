import { AssetClass } from "@/lib/types";
import { createContext, useContext, useState } from "react";

type ContextType = {
  assetClasses: AssetClass[];
  setAssetClasses: (assetClasses: AssetClass[]) => void;
};

export const GlobalContext = createContext<ContextType>({} as ContextType);

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [assetClasses, setAssetClasses] = useState<AssetClass[]>([]);

  return (
    <GlobalContext.Provider value={{ assetClasses, setAssetClasses }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobal must be used within a GlobalContextProvider");
  }

  return context;
};
