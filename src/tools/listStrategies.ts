import { Address } from 'viem';
import { depositIchiLPBeefy } from './beefy/depositIchiLPBeefy';
import { getBeefyIchiAPR } from './beefy/getBeefyIchiAPR';
import { viewBeefyIchiLPPosition } from './beefy/viewBeefyIchiLPPosition';
import { depositIchi } from './ichi/depositIchi';
import { getIchiAPR } from './ichi/getIchiAPR';
import { viewIchiPosition } from './ichi/viewIchiPosition';
import { depositLST } from './lst/DepositLST';
import { getLSTAPY } from './lst/getLSTAPY';
import { viewLSTPosition } from './lst/viewLSTPosition';
import { depositMachFi } from './machfi/depositMachFi';
import { getMachFiAPR } from './machfi/getMachFiAPR';
import { viewMachFiPosition } from './machfi/viewMachFiPosition';
import { depositRingsSC } from './rings/depositRings';
import { viewRingsPosition } from './rings/viewRingsPosition';
import { depositSilo } from './silo/depositSilo';
import { getSiloAPR } from './silo/getSiloAPR';
import { viewSiloPosition } from './silo/viewSiloPosition';
import strategies from './strategies.json';
import { DepositLToken } from './yel/depositLToken';
import { getLTokenAPY } from './yel/getLTokenAPY';
import { viewLTokenPosition } from './yel/viewLTokenPosition';
import { viewRingsAPR } from './rings/viewRingsAPR';
import { getBeefyIchiFuncSelector, getBeefyIchiWithdrawFuncSelector } from './beefy/getBeefyIchiFuncSelector';
import { getIchiFuncSelector, getIchiWithdrawFuncSelector } from './ichi/getIchiFuncSelector';
import { getLSTFuncSelector } from './lst/getLSTFuncSelector';
import { getMachFiFuncSelector, getMachFiWithdrawFuncSelector } from './machfi/getMachFiFuncSelector';
import { getRingsFuncSelector } from './rings/getRingsFuncSelector';
import { getSiloFuncSelector, getSiloWithdrawFuncSelector } from './silo/getSiloFuncSelector';
import { getLTokenFuncSelector, getLTokenWithdrawFuncSelector } from './yel/getLTokenFuncSelector';
import { depositDogBone_Bone1 } from './dogbone/dogbone_silo_st_s_st_looping/Deposit_DogBone_Bone1';
import { NATIVE_TOKEN } from './constants';
import { depositDogBone_Bone2 } from './dogbone/dogbone_silo_wos_s_wos_looping/deposit_DogBone_Bone2';
import { getBone1APY } from './dogbone/dogbone_silo_st_s_st_looping/getBone1APY';
import { getBone2APY } from './dogbone/dogbone_silo_wos_s_wos_looping/getBone2APY';
import { depositPendle } from './pendle/depositPendle';
import { viewPendleAPY } from './pendle/viewPendleAPR';
import { viewPendlePosition } from './pendle/viewPendlePosition';
import { depositAave } from './aave/depositAave';
import { getAaveAPY } from './aave/getAaveAPY';
import { viewAavePosition } from './aave/viewAavePosition';
import { depositVicuna } from './vicuna/depositVicuna';
import { getVicunaAPY } from './vicuna/getVicunaAPY';
import { viewVicunaPosition } from './vicuna/viewVicunaPosition';
import { withdrawPendle } from './pendle/withdrawPendle';
import { withdrawMachFi } from './machfi/withdrawMachFi';
import { withdrawSilo } from './silo/withdrawSilo';
import { withdrawAave } from './aave/withdrawAave';
import { withdrawVicuna } from './vicuna/withdrawVicuna';
import { getVicunaFuncSelector, getVicunaWithdrawFuncSelector } from './vicuna/getVicunaFuncSelector';
import { getAaveFuncSelector, getAaveWithdrawFuncSelector } from './aave/getAaveFuncSelector';
import { getPendleFuncSelector } from './pendle/getPendleFuncSelector';
import { depositDogBone_Bone3 } from './dogbone/dogbone_silo_ptwstkscUSD_fraxUSD_looping/Deposit_DogBone3';
import { getBone3APY } from './dogbone/dogbone_silo_ptwstkscUSD_fraxUSD_looping/getBone3APY';
import { depositDogBone_Bone4 } from './dogbone/dogbone4/Deposit_DogBone4';
import { getBone4APY } from './dogbone/dogbone4/getBone4APY';
import { depositDogBone_Bone5 } from './dogbone/dogbone5/Deposit_DogBone5';
import { getBone5APY } from './dogbone/dogbone5/getBone5APY';
import { depositDogBone_Bone6 } from './dogbone/dogbone6/Deposit_DogBone6';
import { getBone6APY } from './dogbone/dogbone6/getBone6APY';
import { getDogBoneWithdrawFuncSelector } from './dogbone/getDogBoneFuncSelector';

export const notLeveraged = (strategy: string, amount: string) => {
  return {
    leverage: BigInt(0),
    flashAmount: BigInt(0),
    isProtected: false,
    swapFlashloan: {
      fromToken: NATIVE_TOKEN,
      fromAmount: BigInt(0),
      router: NATIVE_TOKEN,
      data: NATIVE_TOKEN,
      value: BigInt(0)
    }
  };
}

export async function noneWithdrawFuncSelector(vaultAddress: Address) {
  return '';
}

export const strategyFunctions = {
  beefy: {
    deposit: depositIchiLPBeefy,
    viewAPR: getBeefyIchiAPR,
    viewPosition: viewBeefyIchiLPPosition,
    funcSelector: getBeefyIchiFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawPendle,
    withdrawFuncSelector: getBeefyIchiWithdrawFuncSelector
  },
  ichi: {
    deposit: depositIchi,
    viewAPR: getIchiAPR,
    viewPosition: viewIchiPosition,
    funcSelector: getIchiFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawPendle,
    withdrawFuncSelector: getIchiWithdrawFuncSelector
  },
  beets: {
    deposit: depositLST,
    viewAPR: getLSTAPY,
    viewPosition: viewLSTPosition,
    funcSelector: getLSTFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawPendle,
    withdrawFuncSelector: noneWithdrawFuncSelector
  },
  origin: {
    deposit: depositLST,
    viewAPR: getLSTAPY,
    viewPosition: viewLSTPosition,
    funcSelector: getLSTFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawPendle,
    withdrawFuncSelector: noneWithdrawFuncSelector
  },
  ans: {
    deposit: depositLST,
    viewAPR: getLSTAPY,
    viewPosition: viewLSTPosition,
    funcSelector: getLSTFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawPendle,
    withdrawFuncSelector: noneWithdrawFuncSelector
  },
  MachFi: {
    deposit: depositMachFi,
    viewAPR: getMachFiAPR,
    viewPosition: viewMachFiPosition,
    funcSelector: getMachFiFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawMachFi,
    withdrawFuncSelector: getMachFiWithdrawFuncSelector,
  },
  rings: {
    deposit: depositRingsSC,
    viewAPR: viewRingsAPR,
    viewPosition: viewRingsPosition,
    funcSelector: getRingsFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawPendle,
    withdrawFuncSelector: noneWithdrawFuncSelector
  },
  silo: {
    deposit: depositSilo,
    viewAPR: getSiloAPR,
    viewPosition: viewSiloPosition,
    funcSelector: getSiloFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawSilo,
    withdrawFuncSelector: getSiloWithdrawFuncSelector
  },
  yel: {
    deposit: DepositLToken,
    viewAPR: getLTokenAPY,
    viewPosition: viewLTokenPosition,
    funcSelector: getLTokenFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawPendle,
    withdrawFuncSelector: getLTokenWithdrawFuncSelector
  },
  Bone1: {
    deposit: depositDogBone_Bone1,
    viewAPR: getBone1APY,
    viewPosition: viewSiloPosition,
    funcSelector: getSiloFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawPendle,
    withdrawFuncSelector: getDogBoneWithdrawFuncSelector
  },
  Bone2: {
    deposit: depositDogBone_Bone2,
    viewAPR: getBone2APY,
    viewPosition: viewSiloPosition,
    funcSelector: getSiloFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawPendle,
    withdrawFuncSelector: getDogBoneWithdrawFuncSelector
  },
  Bone3: {
    deposit: depositDogBone_Bone3,
    viewAPR: getBone3APY,
    viewPosition: viewSiloPosition,
    funcSelector: getSiloFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawPendle,
    withdrawFuncSelector: getDogBoneWithdrawFuncSelector
  },
  Bone4: {
    deposit: depositDogBone_Bone4,
    viewAPR: getBone4APY,
    viewPosition: viewSiloPosition,
    funcSelector: getSiloFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawPendle,
    withdrawFuncSelector: getDogBoneWithdrawFuncSelector
  },
  Bone5: {
    deposit: depositDogBone_Bone5,
    viewAPR: getBone5APY,
    viewPosition: viewSiloPosition,
    funcSelector: getSiloFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawPendle,
    withdrawFuncSelector: getDogBoneWithdrawFuncSelector
  },
  Bone6: {
    deposit: depositDogBone_Bone6,
    viewAPR: getBone6APY,
    viewPosition: viewSiloPosition,
    funcSelector: getSiloFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawPendle,
    withdrawFuncSelector: getDogBoneWithdrawFuncSelector
  },
  pendle: {
    deposit: depositPendle,
    viewAPR: viewPendleAPY,
    viewPosition: viewPendlePosition,
    funcSelector: getPendleFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawPendle,
    withdrawFuncSelector: noneWithdrawFuncSelector
  },
  aave: {
    deposit: depositAave,
    viewAPR: getAaveAPY,
    viewPosition: viewAavePosition,
    funcSelector: getAaveFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawAave,
    withdrawFuncSelector: getAaveWithdrawFuncSelector
  },
  vicuna: {
    deposit: depositVicuna,
    viewAPR: getVicunaAPY,
    viewPosition: viewVicunaPosition,
    funcSelector: getVicunaFuncSelector,
    leverage: notLeveraged,
    withdraw: withdrawVicuna,
    withdrawFuncSelector: getVicunaWithdrawFuncSelector
  }
};

export const nameToTypeMapping: Record<string, string> = {};

strategies.forEach((strat) => {
  strat.lists.forEach((item: { name?: string }) => {
    if (item.name) {
      nameToTypeMapping[item.name] = strat.type;
    }
  });
});

// Also add name to strategy config mapping
export const nameToConfigMapping: Record<
  string,
  { vault: Address; token: Address, points: number, lpTokens: Address[] }
> = {};

strategies.forEach((strat) => {
  strat.lists.forEach(
    (item: { name: string; vault: string; token: string; points: number, lpTokens: Address[] }) => {
      if (item.name) {
        nameToConfigMapping[item.name] = {
          vault: item.vault as Address,
          token: item.token as Address,
          points: item.points,
          lpTokens: item.lpTokens
        };
      }
    }
  );
});
