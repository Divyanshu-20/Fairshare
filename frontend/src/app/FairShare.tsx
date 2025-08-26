"use client";
import React, { useState } from "react";
import CreateEqualSplit from "./CreateEqualSplit";
import CreateCustomSplit from "./CreateCustomSplit";
import PayShare from "./PayShare";
import SettleExpense from "./SettleExpense";
import ViewExpenses from "./ViewExpenses";

type ActiveComponent = 'home' | 'equalSplit' | 'customSplit' | 'payShare' | 'settle' | 'view';

export default function FairShare() {
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>('home');

  const handleSuccess = () => {
    setActiveComponent('view');
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'equalSplit':
        return <CreateEqualSplit onSuccess={handleSuccess} />;
      case 'customSplit':
        return <CreateCustomSplit onSuccess={handleSuccess} />;
      case 'payShare':
        return <PayShare onSuccess={handleSuccess} />;
      case 'settle':
        return <SettleExpense onSuccess={handleSuccess} />;
      case 'view':
        return <ViewExpenses onRefresh={() => {}} />;
      default:
        return (
          <div className="text-center max-w-7xl mx-auto px-6">
            <div className="mb-16 animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-sky-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  FairShare
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-4 leading-relaxed">
                Split expenses effortlessly with blockchain transparency
              </p>
              <p className="text-base text-slate-400 max-w-2xl mx-auto">
                Create, track, and settle group expenses with smart contracts. No more awkward money conversations.
              </p>
            </div>
            
            {/* Modern Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <button
                onClick={() => setActiveComponent('equalSplit')}
                className="btn-action card-primary p-8 text-left animate-fade-in-up-delay-1 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl group-hover:scale-110 transition-all duration-300">⚖️</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Equal Split</h3>
                    <p className="text-sm text-slate-300">Divide expenses equally among all participants</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveComponent('customSplit')}
                className="btn-action card-secondary p-8 text-left animate-fade-in-up-delay-2 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl group-hover:scale-110 transition-all duration-300">🎯</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Custom Split</h3>
                    <p className="text-sm text-slate-300">Set specific amounts for each person</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveComponent('payShare')}
                className="btn-action card-accent p-8 text-left animate-fade-in-up-delay-3 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl group-hover:scale-110 transition-all duration-300">💳</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Pay Share</h3>
                    <p className="text-sm text-slate-300">Send your portion of an expense</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveComponent('settle')}
                className="btn-action card-warning p-8 text-left animate-fade-in-up-delay-4 group md:col-span-2 lg:col-span-1"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl group-hover:scale-110 transition-all duration-300">✅</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Settle</h3>
                    <p className="text-sm text-slate-300">Mark expense as fully paid</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveComponent('view')}
                className="btn-action card-primary p-8 text-left animate-fade-in-up-delay-5 group md:col-span-2 lg:col-span-2"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl group-hover:scale-110 transition-all duration-300">📊</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">View Expenses</h3>
                    <p className="text-sm text-slate-300">Track and monitor all your group expenses</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-8 py-20">
      {activeComponent !== 'home' && (
        <button
          onClick={() => setActiveComponent('home')}
          className="mb-12 btn-outline py-4 px-8 font-medium transition-all duration-300 flex items-center space-x-2"
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </button>
      )}
      
      {renderActiveComponent()}
    </div>
  );
}