"use client";
import React, { useState } from "react";
import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import FairshareABI from "../abi/Fairshare.json";

interface ViewExpensesProps {
  onRefresh?: () => void;
}

export default function ViewExpenses({ onRefresh }: ViewExpensesProps) {
  const [expenseId, setExpenseId] = useState("");
  const [userAddress, setUserAddress] = useState("");

  // Read expense details
  const { data: expenseData, error: expenseError, refetch: refetchExpense } = useReadContract({
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi: FairshareABI.abi,
    functionName: "expenses",
    args: expenseId ? [BigInt(expenseId)] : undefined,
    query: {
      enabled: !!expenseId,
    },
  }) as { data: any, error: any, refetch: any };

  // Read user's share for specific expense
  const { data: userShare, error: shareError, refetch: refetchShare } = useReadContract({
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi: FairshareABI.abi,
    functionName: "shareOf",
    args: (expenseId && userAddress && expenseId !== "") ? [BigInt(expenseId), userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!(expenseId && userAddress && expenseId !== ""),
    },
  }) as { data: bigint, error: any, refetch: any };

  // Check if everyone has paid
  const { data: everyonePaid, error: paidError, refetch: refetchPaid } = useReadContract({
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi: FairshareABI.abi,
    functionName: "hasEveryonePaid",
    args: expenseId ? [BigInt(expenseId)] : undefined,
    query: {
      enabled: !!expenseId,
    },
  }) as { data: boolean, error: any, refetch: any };

  const handleRefresh = () => {
    refetchExpense();
    refetchShare();
    refetchPaid();
    onRefresh?.();
  };

  return (
    <div className="card-elevated p-10 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-4xl font-bold text-white mb-3">View Expenses</h2>
        <p className="text-slate-400">Track and monitor all your group expenses</p>
      </div>
      
      <div className="space-y-8 mb-12">
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
            <label className="block text-base font-medium text-slate-300 mb-3">Your Address (optional)</label>
            <input
              type="text"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              placeholder="0x123..."
              className="input-field w-full px-5 py-4 text-lg"
            />
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="btn-primary w-full py-4 font-semibold text-lg"
        >
          🔄 Load Expense Data
        </button>
      </div>

      {/* Error Messages */}
      {(expenseError || shareError || paidError) && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">❌</span>
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">Error Loading Data</h4>
              {expenseError && <p className="text-sm text-red-300">Expense: {expenseError.message}</p>}
              {shareError && <p className="text-sm text-red-300">Share: {shareError.message}</p>}
              {paidError && <p className="text-sm text-red-300">Payment Status: {paidError.message}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Expense Details */}
      {expenseData && (
        <div className="card-primary p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-3xl">💰</span>
            <h3 className="text-2xl font-bold text-white">Expense Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-slate-400 text-sm font-medium">Title</span>
                <p className="text-white text-lg font-semibold">{expenseData[0]}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm font-medium">Amount</span>
                <p className="text-white text-2xl font-bold font-mono">{formatEther(expenseData[1])} ETH</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm font-medium">Payer</span>
                <p className="text-slate-200 font-mono text-sm break-all">{expenseData[2]}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-slate-400 text-sm font-medium">Created</span>
                <p className="text-white">{new Date(Number(expenseData[3]) * 1000).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm font-medium">Status</span>
                <p className={`font-semibold ${expenseData[4] ? "text-green-400" : "text-yellow-400"}`}>
                  {expenseData[4] ? "✅ Settled" : "⏳ Pending"}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-sm font-medium">Split Type</span>
                <p className={`font-semibold ${expenseData[5] ? "text-blue-400" : "text-purple-400"}`}>
                  {expenseData[5] ? "⚖️ Equal Split" : "🎯 Custom Split"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Share Info */}
      {userShare !== undefined && userAddress && (
        <div className="card-accent p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-3xl">👤</span>
            <h3 className="text-2xl font-bold text-white">Your Share</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-slate-400 text-sm font-medium">Amount Owed</span>
              <p className="text-white text-2xl font-bold font-mono">{formatEther(userShare)} ETH</p>
            </div>
            <div>
              <span className="text-slate-400 text-sm font-medium">Payment Status</span>
              <p className={`text-lg font-semibold ${userShare === BigInt(0) ? "text-green-400" : "text-red-400"}`}>
                {userShare === BigInt(0) ? "✅ Paid" : "❌ Unpaid"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Status */}
      {everyonePaid !== undefined && (
        <div className={`${everyonePaid ? 'card-accent' : 'card-warning'} p-8 mb-8`}>
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl">{everyonePaid ? '✅' : '⏳'}</span>
            <h3 className="text-2xl font-bold text-white">Payment Status</h3>
          </div>
          <p className={`text-lg font-semibold ${everyonePaid ? "text-green-400" : "text-yellow-400"}`}>
            {everyonePaid ? "All participants have paid their shares" : "Waiting for payments from participants"}
          </p>
        </div>
      )}
    </div>
  );
}
