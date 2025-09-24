import React, { useState } from "react";

interface CommunityPoolProps {
  initialPool?: number;
  onPoolUpdate?: (pool: number) => void;
}

export function CommunityPool({
  initialPool = 1000,
  onPoolUpdate
}: CommunityPoolProps) {
  const [pool, setPool] = useState(initialPool);
  const [contributors, setContributors] = useState(12);

  const handlePoolUpdate = (newPool: number) => {
    setPool(newPool);
    onPoolUpdate?.(newPool);
  };

  const contributeToPool = () => {
    handlePoolUpdate(pool + 25);
    setContributors(contributors + 1);
  };

  const withdrawFromPool = () => {
    if (pool >= 50) {
      handlePoolUpdate(pool - 50);
    }
  };

  const resetPool = () => {
    handlePoolUpdate(initialPool);
    setContributors(12);
  };

  return (
    <div className="p-4 border rounded-lg bg-purple-50">
      <h3 className="text-lg font-semibold mb-3">Community Pool</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">${pool}</div>
          <div className="text-sm text-gray-600">total pool</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{contributors}</div>
          <div className="text-sm text-gray-600">contributors</div>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={contributeToPool}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm"
        >
          Contribute
        </button>
        <button
          onClick={withdrawFromPool}
          disabled={pool < 50}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-sm"
        >
          Withdraw
        </button>
      </div>

      <button
        onClick={resetPool}
        className="w-full px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition text-sm"
      >
        Reset Pool
      </button>
    </div>
  );
}
