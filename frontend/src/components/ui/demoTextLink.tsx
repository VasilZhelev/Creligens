"use client";

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

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

export function TextLink() {
  const placeholders = ["https://www.mobile.bg/...", "Place your link here"];

  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a valid mobile.bg URL.");
      return;
    }

    try {
      const response = await axios.post<ListingResponse>(
        "/api/ListingProcessing/process-listing",
        { url },
      );
      // Navigate to the /dashboard route and pass the listing data via state.
      navigate("/dashboard", { state: { listing: response.data } });
    } catch (err: any) {
      console.error(err);
      setError("An error occurred processing the listing. Please try again.");
    }
  };

  return (
    <div className="h-[40rem] flex flex-col justify-center items-center px-4">
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        We can help you choose a car!
      </h2>
      <form onSubmit={onSubmit} className="w-full max-w-lg">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </form>

      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
}
