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

export const strategyFunctions = {
  beefy: {
    deposit: depositIchiLPBeefy,
    viewAPR: getBeefyIchiAPR,
    viewPosition: viewBeefyIchiLPPosition,
  },
  ichi: {
    deposit: depositIchi,
    viewAPR: getIchiAPR,
    viewPosition: viewIchiPosition,
  },
  LST: {
    deposit: depositLST,
    viewAPR: getLSTAPY,
    viewPosition: viewLSTPosition,
  },
  MachFi: {
    deposit: depositMachFi,
    viewAPR: getMachFiAPR,
    viewPosition: viewMachFiPosition,
  },
  rings: {
    deposit: depositRingsSC,
    viewAPR: viewRingsAPR,
    viewPosition: viewRingsPosition,
  },
  silo: {
    deposit: depositSilo,
    viewAPR: getSiloAPR,
    viewPosition: viewSiloPosition,
  },
  yel: {
    deposit: DepositLToken,
    viewAPR: getLTokenAPY,
    viewPosition: viewLTokenPosition,
  },
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
export const nameToConfigMapping: Record<string, { vault: Address, token: Address }> = {};

strategies.forEach((strat) => {
  strat.lists.forEach((item: { name: string, vault: string, token: string }) => {
    if (item.name) {
      nameToConfigMapping[item.name] = {
        vault: item.vault as Address,
        token: item.token as Address,
      }
    }
  });
});
