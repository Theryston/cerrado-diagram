import { Checklist } from "./types";

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
    percentage: 0,
    color: "#1E90FF",
  },
  {
    id: DEFAULT_ASSET_CLASSES_IDS.FIIS,
    name: "FIIs",
    percentage: 0,
    color: "#32CD32",
  },
  {
    id: DEFAULT_ASSET_CLASSES_IDS.ACAO,
    name: "Ações",
    percentage: 0,
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
    id: "SELIC",
    name: "Selic",
  },
  {
    id: "PREFIXADO",
    name: "Prefixado",
  },
];

export const STEPS = {
  ASSET_CLASSES: "asset-classes",
  ASSETS: "assets",
  CONTRIBUTION: "contribution",
  RESULTS: "results",
};

export const WALLET_SETUP_STEPS = [STEPS.ASSET_CLASSES, STEPS.ASSETS];

export const CHECKLIST_ITEMS: Checklist = {
  [DEFAULT_ASSET_CLASSES_IDS.ACAO]: [
    {
      label: "Ações",
      items: [
        {
          label: "Empresa com mais de 5 anos de Bolsa",
          description:
            "Demonstra certa estabilidade e maturidade no mercado, pois já passou por diferentes condições econômicas e desafios de mercado ao longo desse tempo.",
          points: 1,
        },
        {
          label: "Empresa com lucro nos últimos 20 trimestres (5 anos)",
          description:
            "Consistência de lucros ao longo do tempo pode indicar estabilidade financeira e gestão eficiente.",
          points: 1,
        },
        {
          label: "Empresa possui ROE acima de 10%",
          description:
            "Pode indicar que a empresa está eficientemente utilizando seus recursos e gerando lucros para os acionistas.",
          points: 1,
        },
        {
          label: "Empresa apresentou crescimento de receita nos últimos 5 anos",
          description:
            "Pode indicar que a empresa está expandindo seus negócios. Neste critério, utilizamos o CAGR RECEITAS 5 ANOS acima de 10%.",
          points: 1,
        },
        {
          label: "Empresa possui liquidez diária acima de US$ 2M",
          description:
            "Significa que o ativo pode ser comprado ou vendido mais facilmente no mercado de ações, pois indica uma alta demanda por ele. Neste critério, utilizamos uma liquidez diária acima de US$ 2 milhões.",
          points: 1,
        },
        {
          label: "Empresa nunca deu prejuízo (ano fiscal)",
          description:
            "Geralmente indica saúde financeira e eficiência operacional do negócio.",
          points: 1,
        },
        {
          label: "Empresa pagou +5% de dividendos/ano nos últimos 5 anos",
          description:
            "Geralmente indica que a empresa possui um histórico de distribuir proventos de forma regular. Neste critério, considera-se uma média acima de 5% ao ano, nos últimos 5 anos.",
          points: 1,
        },
        {
          label: "Empresa possui dívida menor que patrimônio",
          description:
            "Pode indicar que a empresa é financeiramente saudável e corra menor risco de inadimplência. Neste critério, consideramos que a dívida bruta / patrimônio seja menor que 1.",
          points: 1,
        },
        {
          label: "Empresa apresentou crescimento de lucros nos últimos 5 anos",
          description:
            "Significa que empresa está aumentando seus ganhos ao longo do tempo, o que pode ser um indicativo de sua eficiência operacional. Neste critério, utilizamos o CAGR LUCROS 5 ANOS acima de 10%.",
          points: 1,
        },
        {
          label: "Empresa possui Tag Along de 100%",
          description:
            "Um tag along de 100% significa que o acionista receberá 100% do valor por ação, no caso de venda da empresa.",
          points: 1,
        },
      ],
    },
  ],
  [DEFAULT_ASSET_CLASSES_IDS.FIIS]: [
    {
      label: "FII de Tijolo",
      items: [
        {
          label: "Imóveis em localizações privilegiadas",
          description:
            "Propriedades em áreas de alta demanda e valorização comprovada.",
          points: 1,
        },
        {
          label: "Contratos de locação de longo prazo",
          description:
            "Garantia de receita estável por períodos prolongados (mínimo 5 anos).",
          points: 1,
        },
        {
          label: "Diversificação de inquilinos",
          description:
            "Nenhum inquilino responsável por mais de 15% da receita total.",
          points: 1,
        },
        {
          label: "Taxa de ocupação acima de 90%",
          description: "Indicador de boa gestão e demanda pelos imóveis.",
          points: 1,
        },
        {
          label: "Endividamento inferior a 30% do patrimônio",
          description: "Saúde financeira e menor risco de insolvência.",
          points: 1,
        },
        {
          label: "Taxa de administração abaixo de 1% ao ano",
          description:
            "Custos operacionais que não comprometem os rendimentos.",
          points: 1,
        },
        {
          label: "Diversificação geográfica",
          description: "Imóveis distribuídos em diferentes regiões/estados.",
          points: 1,
        },
        {
          label: "Histórico de valorização do patrimônio",
          description:
            "Crescimento consistente do valor dos imóveis nos últimos 5 anos.",
          points: 1,
        },
        {
          label: "Dividend yield médio acima de 6% ao ano",
          description: "Retorno consistente para os cotistas.",
          points: 1,
        },
        {
          label: "Patrimônio líquido acima de R$ 1 bilhão",
          description:
            "Tamanho que proporciona economia de escala e estabilidade.",
          points: 1,
        },
      ],
    },
    {
      label: "FII de Papel",
      items: [
        {
          label: "Ativos de crédito com rating AA+ ou superior",
          description:
            "Risco creditório baixo segundo agências classificadoras.",
          points: 1,
        },
        {
          label: "Diversificação de emissoras",
          description:
            "Nenhuma emissora responsável por mais de 10% da carteira.",
          points: 1,
        },
        {
          label: "Duração média abaixo de 3 anos",
          description:
            "Menor exposição a riscos de longo prazo e variações de juros.",
          points: 1,
        },
        {
          label: "Histórico de inadimplência abaixo de 1%",
          description: "Gestão eficiente do risco de crédito.",
          points: 1,
        },
        {
          label: "Cláusula de proteção contra inflação",
          description:
            "Indexação a índices como IPCA ou IGP-M para preservar valor real.",
          points: 1,
        },
        {
          label: "Liquidez diária média acima de R$ 500 mil",
          description: "Facilidade de negociação no mercado secundário.",
          points: 1,
        },
        {
          label: "Gestora com mais de 5 anos de experiência",
          description:
            "Competência comprovada na administração de ativos financeiros.",
          points: 1,
        },
        {
          label: "Exposição máxima de 20% a setor único",
          description: "Proteção contra concentração de risco setorial.",
          points: 1,
        },
        {
          label: "ROE médio acima de 12% nos últimos 5 anos",
          description: "Eficiência na geração de retorno sobre o patrimônio.",
          points: 1,
        },
        {
          label: "Distribuição mensal consistente de dividendos",
          description: "Histórico de pagamentos regulares sem interrupções.",
          points: 1,
        },
      ],
    },
  ],
};
