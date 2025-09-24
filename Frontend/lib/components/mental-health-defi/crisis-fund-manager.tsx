import React, { useState } from "react";

interface CrisisFundManagerProps {
  initialFund?: number;
  onFundUpdate?: (fund: number) => void;
}

export function CrisisFundManager({
  initialFund = 500,
  onFundUpdate
}: CrisisFundManagerProps) {
  const [fund, setFund] = useState(initialFund);
  const [isEmergency, setIsEmergency] = useState(false);

  const handleFundUpdate = (newFund: number) => {
    setFund(newFund);
    onFundUpdate?.(newFund);
  };

  const contributeToFund = () => {
    handleFundUpdate(fund + 50);
  };

  const withdrawFromFund = () => {
    if (fund >= 100) {
      handleFundUpdate(fund - 100);
    }
  };

  const activateEmergency = () => {
    setIsEmergency(true);
  };

  const deactivateEmergency = () => {
    setIsEmergency(false);
  };

  return (
    <div className={`p-4 border rounded-lg ${isEmergency ? 'bg-red-50 border-red-200' : 'bg-yellow-50'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Crisis Fund</h3>
        {isEmergency && (
          <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">
            EMERGENCY ACTIVE
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold text-yellow-600">${fund}</span>
        <span className="text-sm text-gray-600">available</span>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={contributeToFund}
          className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition text-sm"
        >
          Contribute
        </button>
        <button
          onClick={withdrawFromFund}
          disabled={fund < 100}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-sm"
        >
          Withdraw
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={activateEmergency}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
        >
          Activate Emergency
        </button>
        <button
          onClick={deactivateEmergency}
          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition text-sm"
        >
          Deactivate
        </button>
      </div>
    </div>
  );
}
