"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

// import catalan from "../../../public/flags/catalan.svg";
import spanish from "@/../public/language/spain.svg";
import english from "@/../public/language/english.svg";
// import arabic from "../../../public/flags/arabic.svg";

const LangBtn: React.FC = () => {
  // const router = useRouter();
  const pathname = usePathname();
  const locale: string | any = useLocale();
  // const [currentLang, setCurrentLang] = useState<string | any>("en"); // Default language
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languages: { code: string; label: string; flag: string }[] = [
    {
      code: "en",
      label: "English",
      flag: english,
    },

    {
      code: "es",
      label: "Spanish",
      flag: spanish,
    },
  ];

  const pathWithoutLocale = pathname && pathname.replace(`/${locale}`, "");

  const currentLanguage: any = languages.find((lang) => lang.code === locale);
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);
  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={toggleDropdown}>
        <span>{currentLanguage?.label}</span>
        <Image
          src={currentLanguage?.flag}
          alt={currentLanguage?.label}
          style={styles.flag}
          width={20}
          height={20}
        />
      </button>
      {isDropdownOpen && (
        <div style={styles.dropdown}>
          {languages
            .filter((lang) => lang.code !== locale)
            .map((lang) => (
              <Link
                href={`/${pathWithoutLocale}`}
                locale={lang.code}
                key={lang.code}
                style={styles.dropdownItem}
              >
                <span>{lang.label}</span>
                <Image
                  src={lang?.flag}
                  alt={lang.label}
                  style={styles.dropdownFlag}
                  width={10}
                  height={10}
                />
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

const styles: any = {
  container: {
    position: "relative",
    display: "inline-block",
  },
  button: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "transparent",
    border: "1px solid transparent",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  flag: {
    width: "20px",
    height: "20px",
    borderRadius: "2px",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: "0",
    border: "1px solid transparent",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    overflow: "hidden",
    marginTop: "5px",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    padding: "8px 0px",
    cursor: "pointer",
    gap: "8px",
    fontSize: "16px",
    transition: "background-color 0.2s",
  },
  
  dropdownItemHover: {
    backgroundColor: "#f0f0f0",
  },
  dropdownFlag: {
    width: "20px",
    height: "20px",
    borderRadius: "2px",
  },
};

export default LangBtn;
