import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar, X } from "lucide-react";
import styles from "./AddNewEvent.module.css";
import useOutsideClick from "@/hooks/clickoutside/useOutsideClick";
import { preventBackgroundScroll } from "@/hooks/preventScroll/preventBackroundScroll";
import addlogo from "@/../public/ZPLATFORM/event/addLogo.svg";
import Image from "next/image";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import axios from "axios";
import { getToken } from "@/Utils/userToken/LocalToken";
import { useLocale } from "next-intl";
import { useRouter } from 'next/navigation';

interface FormData {
  creatorType: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  category: string;
  topicId: string | number;
  countryId: string | number;
  cityId: string | number;
  poster: File | null;
  eventMode: string; // Add this new field
}
interface DateSelection {
  start: Date | null;
  end: Date | null;
}

interface Category {
  value: string;
  name: string;
}
type addEventProps = {
  setAddNew: React.Dispatch<React.SetStateAction<boolean>>;
  userType: string;
};

interface Country {
  id: number;
  name: string;
  iso: string;
}
interface City {
  id: number;
  name: string;
}
// Sample topics for the dropdown
const category: Category[] = [
  { value: "volunteering&work", name: "Volunteering & Work" },
  { value: "social", name: "Social" },
  { value: "talks&workshops", name: "Talks & Workshops" },
];

const AddNewEvent = (props: addEventProps) => {
  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  const locale = useLocale();
  const router = useRouter()

  const { setAddNew, userType } = props;
  const closeModal = useCallback(() => {
    setAddNew(false);
  }, [setAddNew]);

  const modalRef = useOutsideClick(closeModal);

  useEffect(() => {
    preventBackgroundScroll(true);

    return () => {
      preventBackgroundScroll(false);
    };
  }, []);
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      creatorType: userType,
      title: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      category: "",
      poster: null,
      countryId: "",
      cityId: "",
      eventMode: "",
    },
  });

  // Date picker state
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [selectedDates, setSelectedDates] = useState<DateSelection>({
    start: null,
    end: null,
  });
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Form submission handler
  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    // check all fields are filled
    if (
      !data.title ||
      !data.description ||
      !data.location ||
      !data.startDate ||
      !data.endDate ||
      !data.category ||
      !data.cityId ||
      !data.countryId
    ) {
      ToastNot("Please fill all fields");
    }
    // check if dates are valid
    if (!selectedDates.start || !selectedDates.end) {
      ToastNot("Please select a start and end date");
    }
    try {
      // send data to server
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/events/create-event`,
          {
            creatorType: data.creatorType,
            title: data.title,
            description: data.description,
            location: data.location,
            startDate: data.startDate,
            endDate: data.endDate,
            category: data.category,
            poster: data.poster,
            countryId: Number(data.countryId),
            cityId: Number(data.cityId),
            eventMode: data.eventMode
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((res) => {
          router.push(`/${locale}/events/${res.data[0].id}`);
          ToastNot("Event added successfully");
          reset();
        })
        .catch((err) => {
          console.log(err);
          ToastNot("Error adding event");
        });
    } catch (err) {
      console.log(err);
    }
  };

  // Date handling
  const handleDateClick = (date: Date) => {
    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      setSelectedDates({ start: date, end: null });
    } else {
      if (date < selectedDates.start) {
        setSelectedDates({ start: date, end: selectedDates.start });
      } else {
        setSelectedDates({ start: selectedDates.start, end: date });
      }

      // Update form data with selected dates
      const formattedStartDate = format(
        selectedDates.start || date,
        "yyyy-MM-dd"
      );
      const formattedEndDate = format(
        date < selectedDates.start ? selectedDates.start : date,
        "yyyy-MM-dd"
      );

      setValue("startDate", formattedStartDate);
      setValue("endDate", formattedEndDate);

      // Close date picker after selection
      setDatePickerOpen(false);
    }
  };

  const toggleDatePicker = () => {
    setDatePickerOpen(!datePickerOpen);
  };

  const generateDays = (): (Date | null)[] => {
    const days: (Date | null)[] = [];
    const firstDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const lastDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    // Fill in days from previous month to align grid
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Fill in days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        i
      );
      days.push(date);
    }

    return days;
  };

  const isDateSelected = (date: Date | null): boolean => {
    if (!date || !selectedDates.start) return false;

    if (selectedDates.end) {
      return date >= selectedDates.start && date <= selectedDates.end;
    }

    return date.getTime() === selectedDates.start.getTime();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const [country, setCountry] = useState<Country[]>();
  const [countryId, setCountryId] = useState<number | undefined>(undefined);
  const [city, setCity] = useState<City[]>();

  const [search, setSearch] = useState<string>("");

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
        setCountry(res.data);
      })
      .catch((err) => {
        console.log(err);
        ToastNot("Error fetching countries");
      });
  }, [accessToken, locale]);

  useEffect(() => {
    if (countryId === undefined) return;

    axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/common/cities?countryId=${countryId}&search=${search}&limit=5`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        setCity(res.data);
      })
      .catch((err) => {
        console.log(err);
        ToastNot("Error fetching cities");
      });
  }, [accessToken, countryId, search]);

  // Updated image upload state and refs
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Handle image selection - updated to handle the file properly
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  // Process the selected file (either from input or drag)
  const processSelectedFile = (file: File) => {
    // Set the file in the form
    setValue("poster", file);

    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  // Clean up object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Modified to prevent event bubbling issues
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering the parent onClick
    setValue("poster", null);

    // Clean up the object URL if it exists
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(null);

    // Clear the input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if it's an image file
      if (file.type.startsWith("image/")) {
        processSelectedFile(file);
      }
    }
  };

  return (
    <div className={styles.modal}>
      <div ref={modalRef} className={styles.formContainer}>
        <div className={styles.formTitleContainer}>
          <div className={styles.titleIcon}>
            <Image src={addlogo} alt="addlogo" />
          </div>
          <div className={styles.titleText}>
            <h2 className={styles.formTitle}>Host Your Event</h2>
            <p className={styles.formDescription}>
              Plan and promote your upcoming event. Share details to help
              attendees find and join your event
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formSection}>
            {/* TITLE */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Event Name</label>
              <input
                type="text"
                className={`${styles.input} ${errors.title ? styles.inputError : ""
                  }`}
                {...register("title", {
                  required: "Title is required",
                  maxLength: {
                    value: 100,
                    message: "Title cannot exceed 100 characters",
                  },
                })}
              />
              {errors.title && (
                <p className={styles.errorText}>{errors.title.message}</p>
              )}
            </div>
            {/* DATE */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Date Range</label>
              <div
                className={`${styles.datePickerInput} ${errors.startDate || errors.endDate ? styles.inputError : ""
                  }`}
                onClick={toggleDatePicker}
              >
                <span>
                  {selectedDates.start
                    ? selectedDates.end
                      ? `${format(
                        selectedDates.start,
                        "MMM dd, yyyy"
                      )} - ${format(selectedDates.end, "MMM dd, yyyy")}`
                      : format(selectedDates.start, "MMM dd, yyyy")
                    : "Select date range"}
                </span>
                <Calendar className={styles.calendarIcon} />
              </div>

              {/* Hidden inputs for storing date values */}
              <input
                type="hidden"
                {...register("startDate", {
                  required: "Start date is required",
                })}
              />
              <input
                type="hidden"
                {...register("endDate", { required: "End date is required" })}
              />

              {(errors.startDate || errors.endDate) && (
                <p className={styles.errorText}>Date range is required</p>
              )}

              {datePickerOpen && (
                <div className={styles.datePickerContainer}>
                  <div className={styles.datePickerHeader}>
                    <button
                      type="button"
                      onClick={goToPreviousMonth}
                      className={styles.monthNavButton}
                    >
                      &lt;
                    </button>
                    <div>{format(currentMonth, "MMMM yyyy")}</div>
                    <button
                      type="button"
                      onClick={goToNextMonth}
                      className={styles.monthNavButton}
                    >
                      &gt;
                    </button>
                  </div>

                  <div className={styles.weekdaysGrid}>
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                      <div key={day} className={styles.weekday}>
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className={styles.daysGrid}>
                    {generateDays().map((date, index) => (
                      <div
                        key={index}
                        className={`
                      ${styles.dayCell}
                      ${date ? styles.activeDay : ""}
                      ${date && isDateSelected(date) ? styles.selectedDay : ""}
                    `}
                        onClick={() => date && handleDateClick(date)}
                      >
                        {date ? date.getDate() : ""}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* IMAGE */}
          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Event Image</label>
              <div
                ref={dropAreaRef}
                className={`${styles.imageUploadContainer} ${errors.poster ? styles.inputError : ""
                  } ${isDragging ? styles.dragging : ""}`}
                onClick={handleImageClick}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className={styles.imagePreviewWrapper}>
                    <div
                      className={styles.imagePreview}
                      onClick={handleImageClick} // Add onClick handler here
                    >
                      <Image
                        src={imagePreview}
                        alt="Event preview"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <button
                      type="button"
                      className={styles.removeImageButton}
                      onClick={removeImage}
                    >
                      <X className={styles.removeIcon} />
                    </button>
                  </div>
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <p>
                      {isDragging
                        ? "Drop image here"
                        : "Click or drag image here"}
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef} // Add the ref here
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={handleImageChange}
                  style={{ display: "none" }} // Hide the actual input
                />
              </div>
              {errors.poster && (
                <p className={styles.errorText}>{errors.poster.message}</p>
              )}
            </div>
          </div>
          {/* EVENT TYPE */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Event Type</label>
            <div className={styles.toggleContainer}>
              <div
                className={`${styles.toggleOption} ${watch("eventMode") === "local" ? styles.toggleActive : ""}`}
                onClick={() => setValue("eventMode", "local")}
              >
                <input
                  type="radio"
                  id="eventMode-local"
                  value="local"
                  className={styles.toggleInput}
                  {...register("eventMode", { required: "Event type is required" })}
                />
                <label htmlFor="eventMode-local" className={styles.toggleLabel}>

                  Local
                </label>
              </div>
              <div
                className={`${styles.toggleOption} ${watch("eventMode") === "online" ? styles.toggleActive : ""}`}
                onClick={() => setValue("eventMode", "online")}
              >
                <input
                  type="radio"
                  id="eventMode-online"
                  value="online"
                  className={styles.toggleInput}
                  {...register("eventMode", { required: "Event type is required" })}
                />
                <label htmlFor="eventMode-online" className={styles.toggleLabel}>

                  Online
                </label>
              </div>
            </div>
            {errors.eventMode && (
              <p className={styles.errorText}>{errors.eventMode.message}</p>
            )}
          </div>
          {/* COUNTRY */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Country</label>
            <select
              className={`${styles.select} ${errors.countryId ? styles.inputError : ""
                }`}
              {...register("countryId", { required: "Country is required" })}
              onChange={(e) => setCountryId(parseInt(e.target.value))}
            >
              <option value="" disabled>
                Select Country
              </option>
              {country?.map((country, index) => (
                <option key={index} value={country.id}>
                  {country.iso}_{country.name}
                </option>
              ))}
            </select>
            {errors.countryId && (
              <p className={styles.errorText}>{errors.countryId.message}</p>
            )}
          </div>
          {/* CITY */}

          <div className={styles.formGroup}>
            <label className={styles.label}>City</label>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Enter city"
                className={styles.input}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className={`${styles.select} ${errors.cityId ? styles.inputError : ""
                  }`}
                {...register("cityId", { required: "city is required" })}
              >
                <option value="" disabled>
                  Select city
                </option>
                {/* <option value=""> */}
                {/* </option> */}
                {city?.map((city, index) => (
                  <option key={index} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.cityId && (
              <p className={styles.errorText}>{errors.cityId.message}</p>
            )}
          </div>

          <div className={styles.formSection}>
            {/* LOCATION */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Location</label>
              <input
                type="text"
                className={`${styles.input} ${errors.location ? styles.inputError : ""
                  }`}
                {...register("location", { required: "Location is required" })}
              />
              {errors.location && (
                <p className={styles.errorText}>{errors.location.message}</p>
              )}
            </div>
            {/* DESCRIPTION */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                rows={4}
                className={`${styles.textarea} ${errors.description ? styles.inputError : ""
                  }`}
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                })}
              ></textarea>
              {errors.description && (
                <p className={styles.errorText}>{errors.description.message}</p>
              )}
            </div>
            {/* CATEGORY */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select
                className={`${styles.select} ${errors.category ? styles.inputError : ""
                  }`}
                {...register("category", { required: "Category is required" })}
              >
                <option value="" disabled>
                  Select category
                </option>
                {category.map((category, index) => (
                  <option key={index} value={category.value}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className={styles.errorText}>{errors.category.message}</p>
              )}
            </div>
          </div>
          <div className={styles.submitContainer}>
            <button
              onClick={() => setAddNew(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewEvent;
