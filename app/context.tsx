import { calculateInvestmentDistribution } from "@/lib/calculator";
import { DEFAULT_ASSET_CLASSES, STEPS } from "@/lib/constants";
import { useSaveWalletData, useWalletData } from "@/lib/hooks";
import { Asset, AssetClass, Investment } from "@/lib/types";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

type ContextType = {
  assetClasses: AssetClass[];
  setAssetClasses: React.Dispatch<React.SetStateAction<AssetClass[]>>;
  completedSteps: Record<string, boolean>;
  setCompletedSteps: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  currentStep: string;
  setCurrentStep: React.Dispatch<React.SetStateAction<string>>;
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  contributionAmount: number;
  setContributionAmount: React.Dispatch<React.SetStateAction<number>>;
  investments: Investment[];
  setInvestments: React.Dispatch<React.SetStateAction<Investment[]>>;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  totalInvestment: number;
  setTotalInvestment: React.Dispatch<React.SetStateAction<number>>;
  onReset: () => void;
};

export const GlobalContext = createContext<ContextType>({} as ContextType);

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [assetClasses, setAssetClasses] = useState<AssetClass[]>(
    DEFAULT_ASSET_CLASSES
  );
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(
    {
      [STEPS.ASSET_CLASSES]: false,
      [STEPS.ASSETS]: false,
      [STEPS.CONTRIBUTION]: false,
      [STEPS.RESULTS]: false,
    }
  );
  const [currentStep, setCurrentStep] = useState(STEPS.ASSET_CLASSES);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [contributionAmount, setContributionAmount] = useState(0);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [code, setCode] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("cerrado-diagram-code") || ""
      : ""
  );
  const { data } = useWalletData(code);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const router = useRouter();
  const onSaveTimeout = useRef<NodeJS.Timeout | null>(null);
  const { mutateAsync: saveWalletDataMutation } = useSaveWalletData(code);

  const calculateSteps = useCallback(
    ({
      assetClassesFromStorage,
      assetsFromStorage,
      contributionAmount,
    }: {
      assetClassesFromStorage: AssetClass[];
      assetsFromStorage: Asset[];
      contributionAmount: number;
    }) => {
      let newCurrentStep = STEPS.ASSET_CLASSES;

      setCompletedSteps((prev) => {
        const updatedSteps = { ...prev };

        const totalClassPercentage = assetClassesFromStorage.reduce(
          (sum, cls) => sum + cls.percentage,
          0
        );

        if (
          assetClassesFromStorage.length > 0 &&
          totalClassPercentage === 100
        ) {
          updatedSteps[STEPS.ASSET_CLASSES] = true;

          if (newCurrentStep === STEPS.ASSET_CLASSES) {
            newCurrentStep = STEPS.ASSETS;
          }
        }

        if (assetsFromStorage.length > 0) {
          updatedSteps[STEPS.ASSETS] = true;

          if (newCurrentStep === STEPS.ASSETS) {
            newCurrentStep = STEPS.CONTRIBUTION;
          }
        }

        if (contributionAmount > 0) {
          updatedSteps[STEPS.CONTRIBUTION] = true;

          if (newCurrentStep === STEPS.CONTRIBUTION) {
            newCurrentStep = STEPS.RESULTS;
          }
        }

        return updatedSteps;
      });

      setTimeout(() => {
        setCurrentStep(newCurrentStep);
      }, 200);
    },
    [setCompletedSteps, setCurrentStep]
  );

  const onReset = () => {
    setCurrentStep(STEPS.CONTRIBUTION);
    setCompletedSteps((prev) => ({
      ...prev,
      [STEPS.CONTRIBUTION]: false,
      [STEPS.RESULTS]: false,
    }));
    setContributionAmount(0);
    router.push("#contribution");
  };

  function generateCode() {
    return Math.floor(0 + Math.random() * 900000)
      .toString()
      .padStart(6, "0");
  }

  useEffect(() => {
    if (contributionAmount > 0) {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.CONTRIBUTION]: true }));

      const calculatedInvestments = calculateInvestmentDistribution(
        assetClasses,
        assets,
        totalInvestment,
        contributionAmount
      );

      setInvestments(calculatedInvestments);
      setCurrentStep(STEPS.RESULTS);
    } else {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.CONTRIBUTION]: false }));
    }
  }, [assetClasses, assets, contributionAmount, totalInvestment]);

  useEffect(() => {
    calculateSteps({
      assetClassesFromStorage: assetClasses,
      assetsFromStorage: assets,
      contributionAmount: contributionAmount,
    });
  }, [assetClasses, assets, contributionAmount, calculateSteps]);

  useEffect(() => {
    const totalPercentage = assetClasses.reduce(
      (sum, cls) => sum + cls.percentage,
      0
    );

    if (assetClasses.length > 0 && totalPercentage === 100) {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.ASSET_CLASSES]: true }));
      setCurrentStep(STEPS.ASSETS);
    } else {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.ASSET_CLASSES]: false }));
    }
  }, [assetClasses]);

  useEffect(() => {
    if (assets.length > 0) {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.ASSETS]: true }));
      setCurrentStep(STEPS.CONTRIBUTION);
    } else {
      setCompletedSteps((prev) => ({ ...prev, [STEPS.ASSETS]: false }));
    }
  }, [assets]);

  useEffect(() => {
    console.log("Loaded data:", data);

    if (data) {
      const assetClassesFromStorage = Array.isArray(data.assetClasses)
        ? data.assetClasses
        : [];
      const assetsFromStorage = Array.isArray(data.assets) ? data.assets : [];
      const investmentsFromStorage = Array.isArray(data.investments)
        ? data.investments
        : [];

      setAssetClasses(assetClassesFromStorage);
      setAssets(assetsFromStorage);
      setContributionAmount(data.contributionAmount || 0);
      setInvestments(investmentsFromStorage);
      setTotalInvestment(data.totalInvestment || 0);
    }
  }, [data, setAssetClasses]);

  useEffect(() => {
    if (assets.length > 0) {
      const total = assets.reduce(
        (sum, asset) => sum + asset.price * asset.quantity,
        0
      );

      setTotalInvestment(total);
    }
  }, [assets]);

  useEffect(() => {
    if (onSaveTimeout.current) clearTimeout(onSaveTimeout.current);

    onSaveTimeout.current = setTimeout(() => {
      let newCode = code;

      if (newCode === "") {
        newCode = generateCode();
        setCode(newCode);
      }

      const newData = {
        assetClasses,
        assets,
        contributionAmount,
        investments,
      };

      const currentDataStr = JSON.stringify(data);
      const dataString = JSON.stringify(newData);

      if (currentDataStr === dataString) return;

      saveWalletDataMutation(dataString);
    }, 1000);
  }, [
    assetClasses,
    assets,
    code,
    contributionAmount,
    data,
    investments,
    saveWalletDataMutation,
  ]);

  useEffect(() => {
    localStorage.setItem("cerrado-diagram-code", code);
  }, [code]);

  return (
    <GlobalContext.Provider
      value={{
        assetClasses,
        setAssetClasses,
        completedSteps,
        setCompletedSteps,
        currentStep,
        setCurrentStep,
        assets,
        setAssets,
        contributionAmount,
        setContributionAmount,
        investments,
        setInvestments,
        code,
        setCode,
        totalInvestment,
        setTotalInvestment,
        onReset,
      }}
    >
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
