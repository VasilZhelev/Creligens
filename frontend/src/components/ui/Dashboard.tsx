import React, { useState } from "react";
import axios from "axios";

interface BrokenPart {
  partName: string;
  repairCost: number;
  confidence: number;
}

interface ListingResponse {
  carTitle: string;
  year: string;
  price: number;
  brokenParts: BrokenPart[];
  totalRepairCost: number;
}

const Dashboard: React.FC = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState<ListingResponse | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setListing(null);

    if (!url.trim()) {
      setError("Please enter a valid mobile.bg URL.");
      return;
    }

    setLoading(true);
    try {
      // Call the composite endpoint. (The base URL is set in your api.ts file :contentReference[oaicite:4]{index=4}.)
      const response = await axios.post<ListingResponse>(
        "/ListingProcessing/process-listing",
        { url },
      );
      setListing(response.data);
    } catch (err: any) {
      console.error(err);
      setError("An error occurred processing the listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Car Repair Estimator Dashboard
      </h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Enter mobile.bg listing URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Process Listing
        </button>
      </form>

      {loading && <div className="text-xl">Loading...</div>}

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {listing && (
        <div>
          <div className="bg-gray-100 p-4 rounded mb-4">
            <h2 className="text-2xl font-semibold">{listing.carTitle}</h2>
            <p className="text-lg">Year: {listing.year}</p>
            <p className="text-lg">Price: ${listing.price}</p>
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
                <h4 className="text-xl font-bold">
                  Total Estimated Repair Cost
                </h4>
                <p className="text-2xl font-semibold">
                  ${listing.totalRepairCost}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
