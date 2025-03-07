import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface BrokenPart {
  partName: string;
  repairCost: number;
  confidence: number;
}

interface ListingResponse {
  carTitle: string;
  year: string;
  price: string;
  brokenParts: BrokenPart[];
  totalRepairCost: number;
}

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const listing = (location.state as { listing: ListingResponse } | undefined)
    ?.listing;

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl">No listing data found.</h2>
        <button
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-2xl font-semibold">{listing.carTitle}</h2>
        <p className="text-lg">Year: {listing.year}</p>
        <p className="text-lg">Price: {listing.price}</p>
      </div>
      {listing.brokenParts.length === 0 ? (
        <div className="bg-green-100 p-4 rounded">
          <h3 className="text-xl font-semibold">
            This car appears to be in excellent condition!
          </h3>
          <p>No broken parts detected.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listing.brokenParts.map((part, idx) => (
            <div key={idx} className="border p-4 rounded shadow">
              <h4 className="text-xl font-bold">
                {part.partName.replace(/_/g, " ")}
              </h4>
              <p>Estimated Repair Cost: ${part.repairCost}</p>
              <p className="text-sm text-gray-500">
                Confidence: {(part.confidence * 100).toFixed(1)}%
              </p>
            </div>
          ))}
          <div className="border p-4 rounded shadow bg-yellow-100">
            <h4 className="text-xl font-bold">Total Estimated Repair Cost</h4>
            <p className="text-2xl font-semibold">${listing.totalRepairCost}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
