// src/availableChains.ts
import { Chain } from "./types";

export const availableChains: Chain[] = [
  { id: "eth", name: "Ethereum", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=014", deBridgeId: 1 },
  { id: "base", name: "Base", icon: "https://raw.githubusercontent.com/base/brand-kit/a3b352afcc0839a0a355ccc2ae3279442fa56343/logo/symbol/Base_Symbol_Blue.svg", deBridgeId: 8453 },
  { id: "polygon", name: "Polygon", icon: "https://cryptologos.cc/logos/polygon-matic-logo.png?v=014", deBridgeId: 137 },
  { id: "arb", name: "Arbitrum", icon: "https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=014", deBridgeId: 42161 },
];
