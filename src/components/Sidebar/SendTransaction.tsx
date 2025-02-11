import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import {ethers} from "ethers";

function SendTransaction() {
    const { sendTransaction, user } = usePrivy();

  const sendTx = async () => {
    const etherAmount = "0.01";
    const weiValue = ethers.parseEther(etherAmount);
    console.log(weiValue);
    const hexWeiValue = ethers.toBeHex(weiValue);
    const unsignedTx = {
      to: user?.wallet ? user.wallet.address : "",
      chainId: 146,
      value: hexWeiValue,
    };

    const txUiConfig = {
      header: "Send Transaction",
      description: "Send 0.01 ETH to yourself",
      buttonText: "Send",
    };

    if (user?.wallet) {
      await sendTransaction(unsignedTx);
    }
  };

  return (
    <button
      onClick={sendTx}
      disabled={!user?.wallet}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2 mt-4"
    >
      Send 0.01 ETH to Yourself
    </button>
  );
}

export default SendTransaction;