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
  setCurrentDestination,
} from "@/store/features/communitySection/currentCommunity";

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

  const [selectedCityId, setSelectedCityId] = useState<number | undefined>(
    undefined
  );

  const [selectedCountryName, setSelectedCountryName] = useState<string>("");
  const [selectedCityName, setSelectedCityName] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [citySearchText, setCitySearchText] = useState<string>("");

  // Flag to track if we should update the map
  const shouldUpdateMap = useRef<boolean>(false);

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
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/common/cities?countryId=${countryId}&search=${citySearchText}&limit=5`,
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
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (!value) {
      setSelectedCityId(undefined);
      setSelectedCityName("");
      return;
    }

    const newCityId = parseInt(value);
    const selectedCity = cities.find((c) => c.id === newCityId);

    if (selectedCity) {
      // Update city state
      setSelectedCityId(newCityId);
      setSelectedCityName(selectedCity.name);

      // Update Redux state
      dispatch(setCurrentDestination({ selectedCity: newCityId }));

      // Set flag to update map on next render
      shouldUpdateMap.current = true;
    }
  };

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
            {/* CITY */}
            <div className={styles.formGroup}>
              <div className={styles.citySearchContainer}>
                <input
                  type="text"
                  placeholder="Search cities"
                  className={styles.input}
                  onChange={(e) => setCitySearchText(e.target.value)}
                  value={citySearchText}
                  disabled={!countryId}
                />
                <select
                  onChange={handleCityChange}
                  className={`${styles.select}`}
                  value={selectedCityId || ""}
                  disabled={!countryId}
                >
                  <option value="" disabled>
                    City
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {error && <div className={styles.error}>{error}</div>}
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
