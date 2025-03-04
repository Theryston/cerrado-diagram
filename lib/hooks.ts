import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchAssetPrice, getWalletData, saveWalletData } from "./api";

export function useWalletData(code: string) {
  return useQuery({
    queryKey: ["walletData", code],
    queryFn: () => getWalletData(code),
    enabled: !!code,
  });
}

export function useSaveWalletData(code: string) {
  return useMutation({
    mutationFn: (data: string) => saveWalletData(code, data),
  });
}

export function useAssetPrice(ticker: string, isTesouroDireto: boolean) {
  return useQuery({
    queryKey: ["assetPrice", ticker],
    queryFn: () => fetchAssetPrice(ticker),
    enabled: !isTesouroDireto && !!ticker,
  });
}
