// components/map/address-auto-complete.tsx
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

interface AddressAutocompleteProps {
  onSelect: (address: string, coordinates: [number, number]) => void;
}

interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number];
  properties: {
    [key: string]: any;
  };
}

export function AddressAutocomplete({ onSelect }: AddressAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      setError(null);
      return;
    }

    const fetchSuggestions = async () => {
      if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
        setError("Mapbox token not configured");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json`,
          {
            params: {
              access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
              autocomplete: true,
              country: "ID", // Restrict to Indonesia
              limit: 5,
              types: "address,poi,place",
            },
          }
        );

        setSuggestions(response.data.features || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setError("Failed to fetch address suggestions");
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (suggestion: MapboxFeature) => {
    const [longitude, latitude] = suggestion.center;
    onSelect(suggestion.place_name, [longitude, latitude]);
    setQuery(suggestion.place_name);
    setSuggestions([]);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const clearInput = () => {
    setQuery("");
    setSuggestions([]);
    setError(null);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search office address..."
          className="w-full p-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary border-gray-300"
        />
        {query && (
          <button
            onClick={clearInput}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            type="button"
          >
            ✕
          </button>
        )}
        {isLoading && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="absolute z-10 w-full mt-1 bg-red-50 border border-red-200 rounded-md p-2">
          <div className="text-red-600 text-sm">{error}</div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSelect(suggestion)}
              className="w-full text-left p-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
              type="button"
            >
              <div className="font-medium text-gray-900 truncate">
                {suggestion.place_name}
              </div>
            </button>
          ))}
        </div>
      )}

      {query.length >= 3 &&
        !isLoading &&
        suggestions.length === 0 &&
        !error && (
          <div className="absolute z-10 w-full mt-1 bg-gray-50 border border-gray-300 rounded-md p-3">
            <div className="text-gray-600 text-sm">No addresses found</div>
          </div>
        )}
    </div>
  );
}
