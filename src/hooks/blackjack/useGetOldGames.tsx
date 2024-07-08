import { useQuery } from "@tanstack/react-query";
import { getOldGames } from "@/hooks/blackjack/getOldGames";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";

const REFETCH_SEC = 60;

export const useGetOldGames = () => {
  const auth = useAuth();

  const [address, setAddress] = useState<string>(auth?.address || "");

  // Obtain address and store dynamically in state
  // to trigger query on address change
  useEffect(() => {
    setAddress(auth?.address || "");
  }, [auth]);

  const {
    data: oldGames,
    refetch: refetchOldGames,
    isLoading: loadingOldGames,
    isSuccess: successOldGames,
    isRefetching: isRefetchOldGames,
  } = useQuery({
    queryKey: ["getOldGames", address],
    queryFn: () => getOldGames(address),
    refetchInterval: REFETCH_SEC * 1000,
    enabled: !!address,
  });

  return {
    oldGames,
    refetchOldGames,
    loadingOldGames,
    successOldGames,
    isRefetchOldGames,
  };
};
