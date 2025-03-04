export const DEFAULT_ASSET_CLASSES_IDS = {
  TESOURO_DIRETO: "1",
  FIIS: "2",
  ACAO: "3",
  CRIPTO: "4",
  BDR: "5",
  ETF: "6",
  ETF_INTERNACIONAL: "7",
  FUNDO_DE_INVESTIMENTO: "8",
  REIT: "9",
  RENDA_FIXA: "10",
  STOCKS: "11",
  OUTROS: "12",
};

export const DEFAULT_ASSET_CLASSES = [
  {
    id: DEFAULT_ASSET_CLASSES_IDS.TESOURO_DIRETO,
    name: "Tesouro Direto",
    percentage: 50,
    color: "#1E90FF",
  },
  {
    id: DEFAULT_ASSET_CLASSES_IDS.FIIS,
    name: "FIIs",
    percentage: 30,
    color: "#32CD32",
  },
  {
    id: DEFAULT_ASSET_CLASSES_IDS.ACAO,
    name: "Ações",
    percentage: 10,
    color: "#FF4500",
  },
  {
    id: DEFAULT_ASSET_CLASSES_IDS.CRIPTO,
    name: "Criptomoedas",
    percentage: 0,
    color: "#FFD700",
  },
  {
    id: DEFAULT_ASSET_CLASSES_IDS.BDR,
    name: "BDRs",
    percentage: 0,
    color: "#8A2BE2",
  },
  {
    id: DEFAULT_ASSET_CLASSES_IDS.ETF,
    name: "ETFs",
    percentage: 0,
    color: "#00CED1",
  },
  {
    id: DEFAULT_ASSET_CLASSES_IDS.ETF_INTERNACIONAL,
    name: "ETFs internacionais",
    percentage: 0,
    color: "#DC143C",
  },
  {
    id: DEFAULT_ASSET_CLASSES_IDS.FUNDO_DE_INVESTIMENTO,
    name: "Fundos de investimento",
    percentage: 0,
    color: "#FF8C00",
  },
  {
    id: DEFAULT_ASSET_CLASSES_IDS.REIT,
    name: "REITs",
    percentage: 0,
    color: "#8B0000",
  },
  {
    id: DEFAULT_ASSET_CLASSES_IDS.RENDA_FIXA,
    name: "Renda Fixa",
    percentage: 0,
    color: "#4682B4",
  },
  {
    id: DEFAULT_ASSET_CLASSES_IDS.STOCKS,
    name: "Stocks",
    percentage: 0,
    color: "#2E8B57",
  },
  {
    id: DEFAULT_ASSET_CLASSES_IDS.OUTROS,
    name: "Outros",
    percentage: 0,
    color: "#808080",
  },
];

export const DEFAULT_TESOURO_TYPES = [
  {
    id: "selic",
    name: "Selic",
  },
  {
    id: "prefixado",
    name: "Prefixado",
  },
];
