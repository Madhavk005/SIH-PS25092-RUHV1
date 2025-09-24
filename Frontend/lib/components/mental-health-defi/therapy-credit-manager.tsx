import React, { useState } from "react";

interface TherapyCreditManagerProps {
  initialCredits?: number;
  onCreditUpdate?: (credits: number) => void;
}

export function TherapyCreditManager({
  initialCredits = 100,
  onCreditUpdate
}: TherapyCreditManagerProps) {
  const [credits, setCredits] = useState(initialCredits);

  const handleCreditUpdate = (newCredits: number) => {
    setCredits(newCredits);
    onCreditUpdate?.(newCredits);
  };

  const addCredits = () => {
    handleCreditUpdate(credits + 10);
  };

  const spendCredits = () => {
    if (credits >= 10) {
      handleCreditUpdate(credits - 10);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-blue-50">
      <h3 className="text-lg font-semibold mb-3">Therapy Credits</h3>
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold text-blue-600">{credits}</span>
        <span className="text-sm text-gray-600">credits available</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={addCredits}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
        >
          Add Credits
        </button>
        <button
          onClick={spendCredits}
          disabled={credits < 10}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-sm"
        >
          Spend Credits
        </button>
      </div>
    </div>
  );
}
