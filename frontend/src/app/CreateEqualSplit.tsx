"use client";
import React, { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import FairshareABI from "../abi/Fairshare.json";

interface CreateEqualSplitProps {
  onSuccess?: () => void;
}

export default function CreateEqualSplit({ onSuccess }: CreateEqualSplitProps) {
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState("");
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  React.useEffect(() => {
    if (isSuccess) {
      handleSuccess();
    }
  }, [isSuccess]);

  const handleCreateExpense = async () => {
    try {
      setIsCreating(true);
      const participantAddresses = participants.split(',').map(addr => addr.trim()).filter(addr => addr.length > 0);

      writeContract({
        address: "0x5FbDB2315678afecb367f032d93F642f64180aa3", //FairShare Contract Deployed Address
        abi: FairshareABI.abi,
        functionName: "createExpenseWithEqualSplit",
        args: [title, participantAddresses, parseEther(amount || "0"), payer],
      });
    } catch (err) {
      console.error("Error creating expense:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSuccess = () => {
    setTitle("");
    setParticipants("");
    setAmount("");
    setPayer("");
    onSuccess?.();
  };

  return (
    <div className="card-elevated p-10 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">⚖️</div>
        <h2 className="text-4xl font-bold text-white mb-3">Equal Split</h2>
        <p className="text-slate-400">Divide expenses equally among all participants</p>
      </div>
      
      <div className="space-y-8">
        <div>
          <label className="block text-base font-medium text-slate-300 mb-3">Expense Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Dinner at restaurant"
            className="input-field w-full px-5 py-4 text-lg"
          />
        </div>

        <div>
          <label className="block text-base font-medium text-slate-300 mb-3">Participants</label>
          <textarea
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            placeholder="0x123..., 0x456..., 0x789..."
            className="input-field w-full px-5 py-4 text-lg resize-none"
            rows={4}
          />
          <p className="text-sm text-slate-400 mt-2">💡 Enter wallet addresses separated by commas</p>
        </div>

        <div>
          <label className="block text-base font-medium text-slate-300 mb-3">Total Amount (ETH)</label>
          <input
            type="number"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.1"
            className="input-field w-full px-5 py-4 text-lg"
          />
        </div>

        <div>
          <label className="block text-base font-medium text-slate-300 mb-3">Payer Address</label>
          <input
            type="text"
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
            placeholder="0x123..."
            className="input-field w-full px-5 py-4 text-lg"
          />
          <p className="text-sm text-slate-400 mt-2">💳 Who paid for this expense initially</p>
        </div>

        <button
          onClick={handleCreateExpense}
          disabled={isPending || isConfirming || isCreating}
          className="btn-accent w-full py-5 font-semibold text-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none mt-8"
        >
          {isPending || isCreating ? "⏳ Creating..." : isConfirming ? "⏳ Confirming..." : "✨ Create Equal Split"}
        </button>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl">
            <div className="flex items-start space-x-3">
              <span className="text-xl">❌</span>
              <div>
                <h4 className="font-semibold mb-1">Transaction Failed</h4>
                <p className="text-sm text-red-300">{error.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
