import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar1 } from "@/components/ui/Navbar1";
import api from "@/lib/api";

interface BrokenPart {
  partName: string;
  repairCost: number;
  confidence: number;
}

interface ListingData {
  carTitle: string;
  year: string;
  price: string;
  brokenParts: BrokenPart[];
  totalRepairCost: number;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listingData, setListingData] = useState<ListingData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListingData = async () => {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams(location.search);
      const url = queryParams.get("url");

      if (!url) {
        setError("No URL provided");
        setLoading(false);
        return;
      }

      try {
        const response = await api.post("/ListingProcessing/process-listing", {
          url,
        });
        setListingData(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to process listing");
        console.error("Error processing listing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListingData();
  }, [location.search]);

  // Group duplicate parts and sum their repair costs
  const groupedParts = listingData?.brokenParts.reduce(
    (acc: Record<string, BrokenPart>, part) => {
      if (!acc[part.partName]) {
        acc[part.partName] = { ...part };
      } else {
        // Keep the highest confidence score
        if (part.confidence > acc[part.partName].confidence) {
          acc[part.partName].confidence = part.confidence;
        }
      }
      return acc;
    },
    {},
  );

  const uniqueParts = groupedParts ? Object.values(groupedParts) : [];

  // Function to format part name for display
  const formatPartName = (name: string) => {
    return name.replace(/_/g, " ").replace(/Broken /g, "");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar1 />
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            Processing your car listing...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar1 />
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Error
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!listingData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar1 />
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            No data available
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar1 />

      <div className="container mx-auto px-4 py-8">
        {/* Car Information Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {listingData.carTitle}
          </h1>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="text-gray-600 dark:text-gray-400 mr-2">
                Year:
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {listingData.year}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 dark:text-gray-400 mr-2">
                Price:
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {listingData.price} €
              </span>
            </div>
          </div>
        </div>

        {/* Damage Assessment Section */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Damage Assessment
        </h2>

        {/* Broken Parts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {uniqueParts.map((part, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {formatPartName(part.partName)}
                </h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Repair Cost:
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {part.repairCost} €
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Confidence:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.round(part.confidence * 100)}%
                  </span>
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 px-6 py-3">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${Math.round(part.confidence * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Cost Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
              Total Estimated Repair Cost
            </h3>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {listingData.totalRepairCost} €
            </span>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            This is the estimated total cost to repair all identified damaged
            parts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
