import React from "react";

export function SecurePaymentButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    >
      Secure Payment
    </button>
  );
}
