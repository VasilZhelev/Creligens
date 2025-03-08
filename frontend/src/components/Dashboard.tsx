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
  photoUrls?: string[]; // Added photoUrls to the interface
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listingData, setListingData] = useState<ListingData | null>(null);
  const [correctedTotalCost, setCorrectedTotalCost] = useState<number>(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Update useEffect when fetching listing data
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

        // Add this logging to debug the response
        console.log("API Response:", response.data);

        setListingData(response.data);
      } catch (err: any) {
        setError(err.message || err.toString() || "Failed to process listing");
        console.error("Error processing listing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListingData();
  }, [location.search]);

  // Group duplicate parts and calculate the corrected total cost using only unique parts
  useEffect(() => {
    if (listingData?.brokenParts) {
      const groupedParts = listingData.brokenParts.reduce(
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

      // Calculate corrected total cost from only the unique parts
      const uniqueParts = Object.values(groupedParts);
      const totalCost = uniqueParts.reduce(
        (sum, part) => sum + part.repairCost,
        0,
      );
      setCorrectedTotalCost(totalCost);
    }
  }, [listingData]);

  // Use the corrected grouped parts
  const groupedParts =
    listingData?.brokenParts?.reduce(
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
    ) || {};

  const uniqueParts = Object.values(groupedParts);

  // Function to format part name for display
  const formatPartName = (name: string) => {
    return name
      .replace(/_/g, " ")
      .replace(/Broken /g, "")
      .toUpperCase();
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
            The vehicle is in perfect condition. No damage detected.
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

  // Get photo URLs from the response - using a placeholder if none available
  const photoUrls = listingData.photoUrls || [];
  const firstPhoto =
    photoUrls.length > 0 ? photoUrls[0] : "/api/placeholder/600/400";

  // Parse car price for calculations
  const parsedCarPrice =
    parseFloat(listingData.price.replace(/[^\d.-]/g, "")) || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar1 />

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Car Information Header with Image */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Car Image */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="aspect-video rounded-lg overflow-hidden shadow-md bg-gray-200 dark:bg-gray-700">
                <img
                  src={firstPhoto}
                  alt={listingData.carTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Car Details */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {listingData.carTitle}
              </h1>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400 block">
                    Year
                  </span>
                  <span className="font-semibold text-lg text-gray-900 dark:text-white">
                    {listingData.year}
                  </span>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400 block">
                    Price
                  </span>
                  <span className="font-semibold text-lg text-gray-900 dark:text-white">
                    {listingData.price} €
                  </span>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg col-span-2 md:col-span-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400 block">
                    Repair Cost
                  </span>
                  <span className="font-semibold text-lg text-red-600 dark:text-red-400">
                    {correctedTotalCost} €
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400 block">
                  Value After Repairs
                </span>
                <span className="font-semibold text-lg text-green-600 dark:text-green-400">
                  {parsedCarPrice - correctedTotalCost} €
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Damage Assessment Section with improved header */}
        <div className="flex items-center mb-6">
          <div className="h-1 flex-1 bg-blue-100 dark:bg-blue-900"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white px-4">
            Damage Assessment
          </h2>
          <div className="h-1 flex-1 bg-blue-100 dark:bg-blue-900"></div>
        </div>

        {/* Improved visualization of damage - only show when parts are available */}
        {uniqueParts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Damage Overview
            </h3>
            <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
              <div
                className="h-6 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full"
                style={{
                  width:
                    parsedCarPrice > 0
                      ? `${Math.min((correctedTotalCost / parsedCarPrice) * 100, 100)}%`
                      : "0%",
                }}
              ></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
              Repair costs are approximately{" "}
              <span className="font-bold text-red-500">
                {parsedCarPrice > 0
                  ? Math.round((correctedTotalCost / parsedCarPrice) * 100)
                  : 0}
                %
              </span>{" "}
              of the vehicle price
            </p>
          </div>
        )}

        {/* Broken Parts Grid with enhanced card design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {uniqueParts.map((part, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {formatPartName(part.partName)}
                  </h3>
                  <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-sm rounded-md">
                    {Math.round(part.confidence * 100)}%
                  </span>
                </div>
                <div className="mb-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${Math.round(part.confidence * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Confidence Level
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
                  <span className="block text-gray-600 dark:text-gray-400 text-sm">
                    Repair Cost
                  </span>
                  <span className="font-bold text-xl text-red-600 dark:text-red-400">
                    {part.repairCost} €
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Total Cost Summary with corrected total */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
              Total Estimated Repair Cost
            </h3>
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {correctedTotalCost} €
            </span>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="text-gray-600 dark:text-gray-400">
              This is the estimated total cost to repair all identified damaged
              parts. Consider this cost when negotiating the final purchase
              price.
            </p>
          </div>

          {/* Call to action */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
            >
              Analyze Another Vehicle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
