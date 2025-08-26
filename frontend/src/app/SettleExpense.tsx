"use client";
import React, { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import FairshareABI from "../abi/Fairshare.json";

interface SettleExpenseProps {
  onSuccess?: () => void;
}

export default function SettleExpense({ onSuccess }: SettleExpenseProps) {
  const [expenseId, setExpenseId] = useState("");
  const [isSettling, setIsSettling] = useState(false);

  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  React.useEffect(() => {
    if (isSuccess) {
      handleSuccess();
    }
  }, [isSuccess]);

  const handleSettleExpense = async () => {
    try {
      setIsSettling(true);

      writeContract({
        address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        abi: FairshareABI.abi,
        functionName: "settleExpense",
        args: [BigInt(expenseId)],
      });
    } catch (err) {
      console.error("Error settling expense:", err);
    } finally {
      setIsSettling(false);
    }
  };

  const handleSuccess = () => {
    setExpenseId("");
    onSuccess?.();
  };

  return (
    <div className="card-elevated p-10 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">⚖️</div>
        <h2 className="text-4xl font-bold text-white mb-3">Settle Expense</h2>
        <p className="text-slate-400">Finalize and close out a completed expense</p>
      </div>
      
      <div className="space-y-8">
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

        <button
          onClick={handleSettleExpense}
          disabled={isPending || isConfirming || isSettling || !expenseId}
          className="btn-secondary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isPending || isSettling ? "⏳ Processing..." : isConfirming ? "⏳ Confirming..." : "⚖️ Settle Expense"}
        </button>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">❌</span>
              <div>
                <h4 className="font-semibold text-lg mb-1">Settlement Failed</h4>
                <p className="text-sm text-red-300">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        <div className="card-warning p-6">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🔒</span>
            <div>
              <h4 className="font-semibold text-white mb-2">Payer Only</h4>
              <p className="text-sm text-yellow-300">
                Only the original payer can settle an expense. All participants must have paid their shares first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
