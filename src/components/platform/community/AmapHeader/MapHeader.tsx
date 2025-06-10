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
import {
  FaSearch, FaTimesCircle, FaExclamationTriangle, FaFilter,
  FaCheck, FaMapMarkerAlt, FaGlobe, FaTag, FaShieldAlt,
  FaChevronUp, FaChevronDown, FaSpinner, FaInfoCircle
} from "react-icons/fa";
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

  const [verificationFilter, setVerificationFilter] = useState<string>("all");

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [citySearchText, setCitySearchText] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // New state variables for enhanced UX
  const [mobileFiltersVisible, setMobileFiltersVisible] = useState<boolean>(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState<boolean>(false);
  const [isLoadingCities, setIsLoadingCities] = useState<boolean>(false);
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true);

  // Flag to track if we should update the map
  const shouldUpdateMap = useRef<boolean>(false);

  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setMobileFiltersVisible(!mobileFiltersVisible);
  };

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
    setVerificationFilter("all");

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

  // Initialize map
  // Update the map initialization in your useEffect hook
  useEffect(() => {
    // Initialize map when component mounts
    if (typeof window !== "undefined") {
      setIsMapLoading(true);
      // Dynamic import for Leaflet
      import("leaflet").then((L) => {
        if (!mapInstanceRef.current && mapRef.current) {
          // Create the map with dragging and other interactions disabled
          mapInstanceRef.current = L.map(mapRef.current, {
            dragging: false,      // Disable dragging
            touchZoom: false,     // Disable touch zoom
            scrollWheelZoom: false, // Disable scroll wheel zoom
            doubleClickZoom: false, // Disable double click zoom
            boxZoom: false,       // Disable box zooming
            keyboard: false,      // Disable keyboard navigation
            zoomControl: false,   // Remove zoom control
            attributionControl: true // Keep attribution
          }).setView([0, 0], 2);

          // Use OpenStreetMap tiles which don't require authentication
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
          }).addTo(mapInstanceRef.current);

          // Apply dark mode styling to the map
          const mapContainer = mapRef.current;
          if (mapContainer) {
            // Add a class to help with styling
            mapContainer.classList.add(styles.darkModeMap);
          }

          // Add event listener for when map is ready
          mapInstanceRef.current.on('load', () => {
            setIsMapLoading(false);
          });

          // Fallback in case 'load' event doesn't fire
          setTimeout(() => {
            setIsMapLoading(false);
          }, 2000);
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
    setIsLoadingCountries(true);
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/common/countries?locale=${locale}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
            "Accept-Language": `${locale}`,
          },
        }
      )
      .then((res) => {
        setCountries(res.data);
        setIsLoadingCountries(false);
      })
      .catch((err) => {
        console.log(err);
        ToastNot("Error fetching countries");
        setIsLoadingCountries(false);
      });
  }, [accessToken, locale]);

  // Fetch cities when country changes or search text changes
  useEffect(() => {
    if (countryId === undefined) {
      setCities([]);
      return;
    }

    setIsLoadingCities(true);
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
        setIsLoadingCities(false);
      })
      .catch((err) => {
        console.log(err);
        ToastNot("Error fetching cities");
        setIsLoadingCities(false);
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

  // Handle verification filter change
  const handleVerificationFilterChange = (value: string) => {
    setVerificationFilter(value);
    dispatch(setCurrentDestination({ verificationStatus: value }));
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
  const hasActiveFilters =
    countryId !== undefined ||
    selectedCategory !== undefined ||
    verificationFilter !== "all";

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Mobile Filter Toggle */}
        <button
          className={styles.mobileFilterToggle}
          onClick={toggleMobileFilters}
          aria-label="Toggle filters"
        >
          <FaFilter className={styles.filterIcon} />
          <span>Filters</span>
          {hasActiveFilters && (
            <div className={styles.activeFiltersCount}>
              {(countryId ? 1 : 0) +
                (selectedCityId ? 1 : 0) +
                (selectedCategory ? 1 : 0) +
                (verificationFilter !== "all" ? 1 : 0)}
            </div>
          )}
          {mobileFiltersVisible ?
            <FaChevronUp className={styles.chevronIcon} /> :
            <FaChevronDown className={styles.chevronIcon} />
          }
        </button>

        {/* Search Container with conditional class for mobile */}
        <div className={`${styles.searchContainer} ${mobileFiltersVisible ? styles.mobileVisible : styles.mobileHidden}`}>
          <div className={styles.filterHeader}>
            <FaFilter className={styles.filterIcon} />
            <h2>Filters</h2>
            {hasActiveFilters && (
              <div className={styles.activeFiltersCount}>
                {(countryId ? 1 : 0) +
                  (selectedCityId ? 1 : 0) +
                  (selectedCategory ? 1 : 0) +
                  (verificationFilter !== "all" ? 1 : 0)}
              </div>
            )}
          </div>

          <div className={styles.searchBox}>
            {/* COUNTRY */}
            <div className={styles.formGroup}>
              <label className={styles.filterLabel}>
                <FaGlobe className={styles.labelIcon} />
                <span>Country</span>
              </label>
              <div className={styles.selectWrapper}>
                {isLoadingCountries ? (
                  <div className={styles.loadingSelect}>
                    <FaSpinner className={styles.spinnerIcon} />
                    <span>Loading countries...</span>
                  </div>
                ) : (
                  <select
                    className={`${styles.select} ${countryId ? styles.activeSelect : ''}`}
                    onChange={handleCountryChange}
                    value={countryId || ""}
                    aria-label="Select country"
                  >
                    <option value="" disabled>Select a country</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* CITY - With dropdown and search */}
            <div className={styles.formGroup}>
              <label className={styles.filterLabel}>
                <FaMapMarkerAlt className={styles.labelIcon} />
                <span>City</span>
              </label>
              <div className={styles.citySearchWrapper} ref={dropdownRef}>
                <div
                  className={`${styles.cityInputContainer} ${selectedCityId ? styles.activeInput : ''} ${!countryId ? styles.disabledInput : ''}`}
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
                    aria-label="Search for a city"
                  />
                  <div className={styles.inputIcon}>
                    {isLoadingCities ? (
                      <FaSpinner className={`${styles.icon} ${styles.spinnerIcon}`} />
                    ) : isDropdownOpen ? (
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
                          className={`${styles.cityOption} ${selectedCityId === city.id ? styles.selectedOption : ""}`}
                          onClick={() => handleCitySelect(city.id, city.name)}
                          role="option"
                          aria-selected={selectedCityId === city.id}
                        >
                          {city.name}
                          {selectedCityId === city.id && <FaCheck className={styles.checkIcon} />}
                        </div>
                      ))
                    ) : (
                      <div className={styles.noResults}>
                        {isLoadingCities ? (
                          <>
                            <FaSpinner className={`${styles.spinnerIcon} ${styles.dropdownSpinner}`} />
                            <span>Loading cities...</span>
                          </>
                        ) : citySearchText ? (
                          "No cities found"
                        ) : (
                          "Type to search cities"
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* CATEGORY */}
            <div className={styles.formGroup}>
              <label className={styles.filterLabel}>
                <FaTag className={styles.labelIcon} />
                <span>Category</span>
              </label>
              <select
                className={`${styles.select} ${selectedCategory ? styles.activeSelect : ''}`}
                onChange={handleCategoryChange}
                value={selectedCategory || ""}
                aria-label="Select category"
              >
                <option value="" disabled>Select a category</option>
                <option value="local">Local</option>
                <option value="online">Online</option>
              </select>
            </div>

            {/* VERIFICATION FILTER */}
            <div className={styles.formGroup}>
              <label className={styles.filterLabel}>
                <FaShieldAlt className={styles.labelIcon} />
                <span>Verification</span>
                <FaInfoCircle
                  className={styles.infoIcon}
                  title="Filter content by verification status"
                />
              </label>
              <div className={styles.toggleFilter}>
                <button
                  className={`${styles.toggleButton} ${verificationFilter === "all" ? styles.activeToggle : ''}`}
                  onClick={() => handleVerificationFilterChange("all")}
                  aria-pressed={verificationFilter === "all"}
                >
                  All Content
                </button>
                <button
                  className={`${styles.toggleButton} ${verificationFilter === "verified" ? styles.activeToggle : ''}`}
                  onClick={() => handleVerificationFilterChange("verified")}
                  aria-pressed={verificationFilter === "verified"}
                >
                  Verified Only
                </button>
              </div>
            </div>

            {/* RESET FILTERS BUTTON */}
            {hasActiveFilters && (
              <button
                className={styles.resetButton}
                onClick={handleResetFilters}
                title="Reset all filters"
                aria-label="Clear all filters"
              >
                <FaTimesCircle className={styles.resetIcon} />
                <span>Clear All Filters</span>
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
                  aria-label="Dismiss error"
                >
                  <FaTimesCircle />
                </button>
              </div>
            )}

            {/* Apply Filters Button (Mobile) */}
            <button
              className={styles.applyFiltersButton}
              onClick={() => setMobileFiltersVisible(false)}
              aria-label="Apply filters and close filter panel"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Map Container with Loading State */}
        <div className={styles.allMapContainer}>
          {isMapLoading && (
            <div className={styles.mapLoadingOverlay}>
              <FaSpinner className={styles.mapLoadingSpinner} />
              <span>Loading map...</span>
            </div>
          )}

          {/* This overlay prevents all map interactions */}
          <div className={styles.mapInteractionBlocker}>
            <div className={styles.mapMessage}>
              <FaMapMarkerAlt className={styles.mapIcon} />
              <span>Map view only - Use filters to navigate</span>
            </div>
          </div>

          <div className={styles.mapOverlay}></div>
          <div ref={mapRef} className={styles.mapContainer}></div>
        </div>
      </main>
    </div>
  );
}
