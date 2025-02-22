// src/types.ts
export interface Token {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
    tags: string[];
    eip2612: boolean;
    balance?: number; // optional – you can simulate or update this later
  }
  
  export interface Chain {
    id: string;
    name: string;
    icon: string;
    deBridgeId: number;
  }
  