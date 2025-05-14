/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./MapHeader.module.scss";
import axios from "axios";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { getToken } from "@/Utils/userToken/LocalToken";
import { useLocale } from "next-intl";
import { useAppDispatch } from "@/store/hooks";
import {
  clearSelectedCity,
  clearSelectedCategory,
  resetDestination,
  setCurrentDestination,
} from "@/store/features/communitySection/currentCommunity";
import { FaSearch, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

interface CountryData {
  lat: number;
  lon: number;
  displayName: string;
  boundingBox?: [string, string, string, string];
}

interface Country {
  id: number;
  name: string;
  iso: string;
}
interface City {
  id: number;
  name: string;
}
export default function MapHeader() {
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  const locale = useLocale();
  const dispatch = useAppDispatch();

  const [countries, setCountries] = useState<Country[]>([]);
  const [countryId, setCountryId] = useState<number | undefined>(undefined);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const [selectedCityId, setSelectedCityId] = useState<number | undefined>(undefined);
  const [selectedCountryName, setSelectedCountryName] = useState<string>("");
  const [selectedCityName, setSelectedCityName] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [citySearchText, setCitySearchText] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Flag to track if we should update the map
  const shouldUpdateMap = useRef<boolean>(false);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dismissError = () => {
    setError(null);
  };

  const searchLocation = async () => {
    if (!selectedCountryName) return;

    setError(null);

    try {
      const searchParams = selectedCityName
        ? { country: selectedCountryName, city: selectedCityName }
        : { country: selectedCountryName };

      const queryString = Object.entries(searchParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${queryString}&format=json&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setCountryData({
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          displayName: data[0].display_name,
          boundingBox: data[0].boundingbox,
        });
      } else {
        setError("Location not found. Please try another selection.");
        setCountryData(null);
      }
    } catch (err) {
      setError("Error fetching location data. Please try again later.");
      console.error(err);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    // Reset local state
    setCountryId(undefined);
    setSelectedCountryName("");
    setSelectedCityId(undefined);
    setSelectedCityName("");
    setCitySearchText("");
    setSelectedCategory(undefined);
    setError(null);

    // Reset Redux state
    dispatch(resetDestination());

    // Reset the map view to world view
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([0, 0], 2);

      // Remove any existing marker
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }

    // Clear the country data
    setCountryData(null);
  };

  useEffect(() => {
    // Initialize map when component mounts
    if (typeof window !== "undefined") {
      // Dynamic import for Leaflet
      import("leaflet").then((L) => {
        if (!mapInstanceRef.current && mapRef.current) {
          mapInstanceRef.current = L.map(mapRef.current).setView([0, 0], 2);

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(mapInstanceRef.current);
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map when country data changes
  useEffect(() => {
    if (countryData && mapInstanceRef.current) {
      import("leaflet").then((L) => {
        // Remove existing marker if any
        if (markerRef.current) {
          markerRef.current.remove();
        }

        // Add marker at the location
        markerRef.current = L.marker([countryData.lat, countryData.lon])
          .addTo(mapInstanceRef.current)
          .bindPopup(countryData.displayName)
          .openPopup();

        // Set view to the location
        if (countryData.boundingBox) {
          const southWest = L.latLng(
            parseFloat(countryData.boundingBox[0]),
            parseFloat(countryData.boundingBox[2])
          );
          const northEast = L.latLng(
            parseFloat(countryData.boundingBox[1]),
            parseFloat(countryData.boundingBox[3])
          );
          const bounds = L.latLngBounds(southWest, northEast);
          mapInstanceRef.current.fitBounds(bounds);
        } else {
          mapInstanceRef.current.setView([countryData.lat, countryData.lon], 5);
        }
      });
    }
  }, [countryData]);

  // Watch for changes to country or city name and update map if needed
  useEffect(() => {
    if (shouldUpdateMap.current) {
      searchLocation();
      shouldUpdateMap.current = false;
    }
  }, [selectedCountryName, selectedCityName]);

  // Fetch countries on component mount
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/common/countries?locale=${locale}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        setCountries(res.data);
      })
      .catch((err) => {
        console.log(err);
        ToastNot("Error fetching countries");
      });
  }, [accessToken, locale]);

  // Fetch cities when country changes or search text changes
  useEffect(() => {
    if (countryId === undefined) {
      setCities([]);
      return;
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/common/cities?countryId=${countryId}&search=${citySearchText}&limit=10`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        setCities(res.data);
      })
      .catch((err) => {
        console.log(err);
        ToastNot("Error fetching cities");
      });
  }, [accessToken, countryId, citySearchText]);

  // Handle country selection
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (!value) {
      setCountryId(undefined);
      setSelectedCountryName("");
      return;
    }

    const newCountryId = parseInt(value);
    const selectedCountry = countries.find((c) => c.id === newCountryId);

    if (selectedCountry) {
      // Reset city state first
      setSelectedCityId(undefined);
      setSelectedCityName("");
      setCitySearchText("");

      // Update Redux state
      dispatch(setCurrentDestination({ selectedCountry: newCountryId }));
      dispatch(clearSelectedCity());

      // Update country state
      setCountryId(newCountryId);
      setSelectedCountryName(selectedCountry.name);

      // Set flag to update map on next render
      shouldUpdateMap.current = true;
    }
  };

  // Handle city selection
  const handleCitySelect = (cityId: number, cityName: string) => {
    setSelectedCityId(cityId);
    setSelectedCityName(cityName);
    setCitySearchText(cityName);
    setIsDropdownOpen(false);

    // Update Redux state
    dispatch(setCurrentDestination({ selectedCity: cityId }));

    // Set flag to update map on next render
    shouldUpdateMap.current = true;
  };

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (!value) {
      setSelectedCategory(undefined);
      dispatch(clearSelectedCategory());
      return;
    }

    setSelectedCategory(value);
    dispatch(setCurrentDestination({ selectedCategory: value }));
  };

  // Check if any filters are applied
  const hasActiveFilters = countryId !== undefined || selectedCategory !== undefined;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.searchContainer}>
          <p>Filter</p>
          <div className={styles.searchBox}>
            {/* COUNTRY */}
            <div className={styles.formGroup}>
              <select
                className={`${styles.select}`}
                onChange={handleCountryChange}
                value={countryId || ""}
              >
                <option value="" disabled>
                  Country
                </option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* CITY - With dropdown and search */}
            <div className={styles.formGroup}>
              <div className={styles.citySearchWrapper} ref={dropdownRef}>
                <div
                  className={styles.cityInputContainer}
                  onClick={() => countryId && setIsDropdownOpen(!isDropdownOpen)}
                >
                  <input
                    type="text"
                    placeholder={countryId ? "Search cities..." : "Select a country first"}
                    className={styles.cityInput}
                    value={citySearchText}
                    onChange={(e) => {
                      setCitySearchText(e.target.value);
                      if (!isDropdownOpen) setIsDropdownOpen(true);
                    }}
                    disabled={!countryId}
                  />
                  <div className={styles.inputIcon}>
                    {isDropdownOpen ? (
                      <FaSearch className={styles.icon} />
                    ) : (
                      <IoMdArrowDropdown className={styles.icon} />
                    )}
                  </div>
                </div>

                {isDropdownOpen && countryId && (
                  <div className={styles.cityDropdown}>
                    {cities.length > 0 ? (
                      cities.map((city) => (
                        <div
                          key={city.id}
                          className={`${styles.cityOption} ${selectedCityId === city.id ? styles.selectedOption : ""
                            }`}
                          onClick={() => handleCitySelect(city.id, city.name)}
                        >
                          {city.name}
                        </div>
                      ))
                    ) : (
                      <div className={styles.noResults}>
                        {citySearchText ? "No cities found" : "Type to search cities"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* CATEGORY */}
            <div className={styles.formGroup}>
              <select
                className={`${styles.select}`}
                onChange={handleCategoryChange}
                value={selectedCategory || ""}
              >
                <option value="" disabled>
                  Category
                </option>
                <option value="local">Local</option>
                <option value="online">Online</option>
              </select>
            </div>

            {/* RESET FILTERS BUTTON */}
            {hasActiveFilters && (
              <button
                className={styles.resetButton}
                onClick={handleResetFilters}
                title="Reset all filters"
              >
                <FaTimesCircle className={styles.resetIcon} />
                <span>Reset Filters</span>
              </button>
            )}

            {/* Styled Error Message */}
            {error && (
              <div className={styles.errorContainer}>
                <div className={styles.errorContent}>
                  <FaExclamationTriangle className={styles.errorIcon} />
                  <span className={styles.errorText}>{error}</span>
                </div>
                <button
                  className={styles.errorDismiss}
                  onClick={dismissError}
                  title="Dismiss"
                >
                  <FaTimesCircle />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.allMapContainer}>
          <div className={styles.mapOverlay}></div>
          <div ref={mapRef} className={styles.mapContainer}></div>
        </div>
      </main>
    </div>
  );
}