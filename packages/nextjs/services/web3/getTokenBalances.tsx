// services/alchemyService.js

const url = `https://scroll-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

interface TokenBalancesResponse {
    jsonrpc: string;
    id: number;
    result: {
      tokenBalances: Array<{
        contractAddress: string;
        tokenBalance: string;
      }>
    }
}
  
export async function getTokenBalances(connectedAddress: string): Promise<TokenBalancesResponse> {
    const body = JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "alchemy_getTokenBalances",
      params: [
        connectedAddress,
        "erc20"
      ]
    });
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body
      });
      const data: TokenBalancesResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Para que puedas manejar el error en el componente si es necesario
    }
}