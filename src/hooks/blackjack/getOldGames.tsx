import axios from "axios";

export const getOldGames = async (address: string) => {
  const response = await axios.get(`/api/aws/blackjackGames?player=${address}`);

  const oldGames = response.data.data.map((item: any) => {
    if (item.playerId === address) {
      return {
        gameId: item.gameId,
      };
    }
  });

  return oldGames;
};
