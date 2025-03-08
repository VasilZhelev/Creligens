"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { WavyBackground } from "@/components/ui/wavy-background"; // Import the WavyBackground component

export function TextLink() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const placeholders = [
    "https://www.mobile.bg/pcgi/mobile.cgi?act=4&adv=1111111111",
    "Place your listing URL here",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError(null);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic URL validation
    if (!inputValue.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!inputValue.includes("mobile.bg")) {
      setError("Please enter a valid mobile.bg listing URL");
      return;
    }

    setIsLoading(true);

    // Redirect to dashboard with the URL as a query parameter
    navigate(`/dashboard?url=${encodeURIComponent(inputValue)}`);
  };

  return (
    <WavyBackground>
      <div className="h-[40rem] flex flex-col justify-center items-center px-4">
        <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
          We can help you choose a car!
        </h2>
        <div className="w-full max-w-xl">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
            value={inputValue}
          />

          {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Paste a mobile.bg car listing URL and we'll analyze the car's
              condition and estimate repair costs.
            </p>
          </div>

          {isLoading && (
            <div className="mt-4 flex justify-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </WavyBackground>
  );
}