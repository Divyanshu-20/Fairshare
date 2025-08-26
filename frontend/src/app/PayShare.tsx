"use client";
import React, { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import FairshareABI from "../abi/Fairshare.json";

interface PayShareProps {
  onSuccess?: () => void;
}

export default function PayShare({ onSuccess }: PayShareProps) {
  const [expenseId, setExpenseId] = useState("");
  const [shareAmount, setShareAmount] = useState("");
  const [isPayingShare, setIsPayingShare] = useState(false);

  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  React.useEffect(() => {
    if (isSuccess) {
      handleSuccess();
    }
  }, [isSuccess]);

  const handlePayShare = async () => {
    try {
      setIsPayingShare(true);

      writeContract({
        address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        abi: FairshareABI.abi,
        functionName: "payShare",
        args: [BigInt(expenseId)],
        value: parseEther(shareAmount || "0"),
      });
    } catch (err) {
      console.error("Error paying share:", err);
    } finally {
      setIsPayingShare(false);
    }
  };

  const handleSuccess = () => {
    setExpenseId("");
    setShareAmount("");
    onSuccess?.();
  };

  return (
    <div className="card-elevated p-10 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">💳</div>
        <h2 className="text-4xl font-bold text-white mb-3">Pay Your Share</h2>
        <p className="text-slate-400">Contribute your portion to the group expense</p>
      </div>
      
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-base font-medium text-slate-300 mb-3">Expense ID</label>
            <input
              type="number"
              value={expenseId}
              onChange={(e) => setExpenseId(e.target.value)}
              placeholder="0"
              className="input-field w-full px-5 py-4 text-lg"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-slate-300 mb-3">Your Share Amount (ETH)</label>
            <input
              type="number"
              step="0.001"
              value={shareAmount}
              onChange={(e) => setShareAmount(e.target.value)}
              placeholder="0.033"
              className="input-field w-full px-5 py-4 text-lg"
            />
            <p className="text-sm text-slate-400 mt-2">💡 Must match your exact share amount</p>
          </div>
        </div>

        <button
          onClick={handlePayShare}
          disabled={isPending || isConfirming || isPayingShare || !expenseId || !shareAmount}
          className="btn-accent w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isPending || isPayingShare ? "⏳ Processing..." : isConfirming ? "⏳ Confirming..." : "💳 Pay Share"}
        </button>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">❌</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Payment Failed</h4>
                <p className="text-sm text-red-300">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        <div className="card-warning p-6">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-white mb-2">Important Note</h4>
              <p className="text-sm text-yellow-300">
                You must pay the exact share amount. The transaction will fail if the amount doesn't match your assigned share.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
