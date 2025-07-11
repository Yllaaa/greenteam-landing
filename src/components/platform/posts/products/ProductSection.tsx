/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ProductCard from "./Card/ProductCard";
import styles from "./ProductSection.module.css";
import ProductsFilter from "./filterComponent/ProductsFilter";
import { Products, ProductsCategory } from "./types/productsTypes.data";
import { fetchProducts } from "./functions/productsService";
import { getToken } from "@/Utils/userToken/LocalToken";
import LoadingTree from "@/components/zaLoader/LoadingTree";
import Image from "next/image";
import toRight from "@/../public/ZPLATFORM/A-iconsAndBtns/ToRights.svg";
import AddNewProduct from "./modal/AddNewProduct";
import MessageModal from "./modal/MessageModal";
import ContactModal from "@/components/platform/modals/contactModal/ContactModal";
import ConfirmationModal from "@/components/platform/modals/confirmModal/ConfirmationModal"; // Import reusable modal
import ReportModal from "@/components/platform/modals/reportModal/ReportModal"; // Import reusable modal
import axios from "axios";
import ToastNot from "@/Utils/ToastNotification/ToastNot";
import { useTranslations } from "next-intl";

function ProductSection() {
  const t = useTranslations("web.products");
  const [section, setSection] = useState<ProductsCategory>(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [addNew, setAddNew] = useState(false);
  const [sendMessage, setSendMessage] = useState(false);
  const [sellerId, setSellerId] = useState("");
  const [sellerType, setSellerType] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [products, setProducts] = useState<Products[]>([]);
  const [endOfResults, setEndOfResults] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  // const [contacts, setContacts] = useState<any>();
console.log("ProductSection rendered", products);
  // Enhanced modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [productId, setProductId] = useState<string>("");

  const token = getToken();
  const accessToken = token ? token.accessToken : null;
  // Constants
  const LIMIT = 5;
  const bodyRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Client-side only effects
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to handle product deletion
  const handleDeleteProduct = useCallback(async () => {
    if (!productId || !accessToken) return;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKENDAPI}/api/v1/marketplace/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Accessss-Control-Allow-Origin": "*",
          },
        }
      );

      if (response) {
        ToastNot("Product deleted successfully");
        // Refresh product list
        loadProducts(1, true);
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      ToastNot("Error occurred while deleting product");
    }
  }, [productId, accessToken]);

  // Handle successful report submission
  const handleReportSuccess = useCallback(() => {
    ToastNot("Thank you for your report. Our team will review it.");
  }, []);

  // Fetch events data
  const loadProducts = useCallback(
    async (pageNum: number, replace: boolean = false) => {
      try {
        // Use different loading state for initial vs pagination loading
        if (replace) {
          setIsLoading(true);
          setEndOfResults(false);
        } else {
          setIsPaginationLoading(true);
        }

        const data = await fetchProducts({
          page: pageNum,
          limit: LIMIT,
          accessToken,
          topicId: section,
        });

        // Check if we've reached the end of available products
        if (data.length < LIMIT) {
          setHasMore(false);
          if (data.length === 0 && pageNum > 1) {
            setEndOfResults(true);
          }
        } else {
          setHasMore(true);
        }

        setProducts((prev) => {
          if (replace) {
            return data;
          }
          return [...prev, ...data];
        });
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setErrorMessage("An Error Occurred");
      } finally {
        setIsLoading(false);
        setIsPaginationLoading(false);
      }
    },
    [section, LIMIT, accessToken]
  );

  // Initial load and section change handler
  useEffect(() => {
    setPage(1);
    loadProducts(1, true);
  }, [section, loadProducts]);

  // Scroll event handler for infinite scrolling and scroll button state
  const handleScroll = useCallback(() => {
    if (!bodyRef.current || !hasMore || isLoading || isPaginationLoading)
      return;

    const container = bodyRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;

    // Update scroll button states
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);

    // Load more when user has scrolled to 80% of the content
    if (scrollLeft + clientWidth >= scrollWidth * 0.8) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, isLoading, isPaginationLoading]);

  // Load more events when page changes
  useEffect(() => {
    if (page > 1) {
      loadProducts(page, false);
    }
  }, [page, loadProducts]);

  // Add scroll event listener
  useEffect(() => {
    const currentRef = bodyRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);

      // Initial scroll state check
      const scrollWidth = currentRef.scrollWidth;
      const clientWidth = currentRef.clientWidth;
      setCanScrollRight(scrollWidth > clientWidth);

      return () => {
        currentRef.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  // Manual scroll handlers for arrow buttons
  const handleManualScroll = (direction: "left" | "right") => {
    if (!bodyRef.current) return;

    const container = bodyRef.current;
    container.scrollBy({
      left: direction === "left" ? -340 : +340,
      behavior: "smooth",
    });
  };

  // Render loading state
  const renderLoading = () => {
    return (
      <div className={styles.noPosts}>
        <LoadingTree />
      </div>
    );
  };

  // Render content based on state
  const renderContent = () => {
    if (isLoading && products.length === 0) {
      return renderLoading();
    }

    if (errorMessage && products.length === 0) {
      return (
        <div className={styles.noProducts}>
          <p>{errorMessage}</p>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className={styles.noProducts}>
          <p>{t("list.noProducts")}</p>
        </div>
      );
    }

    return (
      <>
        <Suspense fallback={renderLoading()}>
          {isMounted &&
            products.map((product, index) => (
              <div key={product.id || index} className={styles.postContainer}>
                <ProductCard
                  limit={LIMIT}
                  products={products}
                  product={product}
                  index={index}
                  page={page}
                  setPage={setPage}
                  setSendMessage={setSendMessage}
                  setSellerId={setSellerId}
                  setSellerType={setSellerType}
                  setShowContacts={setShowContacts}
                  deleteModal={isDeleteModalOpen}
                  setDeleteModal={setIsDeleteModalOpen}
                  reportModal={isReportModalOpen}
                  setReportModal={setIsReportModalOpen}
                  setPostId={setProductId}
                />
              </div>
            ))}

          {/* Pagination loading indicator */}
          {isPaginationLoading && (
            <div className={styles.paginationLoading}>
              <LoadingTree />
            </div>
          )}

          {/* End of results message */}
          {endOfResults && (
            <div className={styles.endOfResults}>
              <p>{t("list.noMoreProducts")}</p>
            </div>
          )}

          {/* Message when there are no more products but not showing loading */}
          {!hasMore &&
            !isPaginationLoading &&
            !endOfResults &&
            products.length > 0 && (
              <div className={styles.endOfResults}>
                <p>{t("list.endOfList")}</p>
              </div>
            )}
        </Suspense>
      </>
    );
  };

  return (
    <>
      <div data-tour="products" className={styles.container}>
        <ProductsFilter
          section={section}
          setPage={setPage}
          setSection={setSection}
          setAddNew={setAddNew}
        />
        {products.length > 0 && (
          <div className={styles.sliderBtns}>
            <div
              className={`${styles.arrow} ${!canScrollLeft ? styles.disabled : ""}`}
              onClick={() => handleManualScroll("left")}
              aria-label={t("list.navigation.leftArrow")}
            >
              <Image
                src={toRight}
                alt={t("list.navigation.leftArrow")}
                width={100}
                height={100}
                style={{ transform: "rotateY(180deg)" }}
              />
            </div>
            <div
              className={`${styles.arrow} ${!canScrollRight ? styles.disabled : ""}`}
              onClick={() => handleManualScroll("right")}
              aria-label={t("list.navigation.rightArrow")}
            >
              <Image
                src={toRight}
                alt={t("list.navigation.rightArrow")}
                width={100}
                height={100}
              />
            </div>
          </div>
        )}

        <div ref={bodyRef} className={styles.posts}>
          {renderContent()}
        </div>
      </div>

      {/* Modals */}
      {addNew && <AddNewProduct setAddNew={setAddNew} userType="user" />}

      {sendMessage && (
        <MessageModal
          sellerId={sellerId}
          sellerType={sellerType}
          setMessage={setSendMessage}
        />
      )}

      {showContacts && (
        <ContactModal
          isOpen={showContacts}
          onClose={() => setShowContacts(false)}
          sellerId={sellerId}
          accessToken={accessToken}
        />
      )}

      {/* Enhanced Delete Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => loadProducts(1, true)}
        title={t("modals.delete.title")}
        confirmButtonText={t("modals.delete.confirmButton")}
        cancelButtonText={t("modals.delete.cancelButton")}
        customAction={handleDeleteProduct}
        successMessage={t("modals.delete.successMessage")}
        errorMessage={t("modals.delete.errorMessage")}
      />

      {/* Enhanced Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportedId={productId}
        reportedType="product"
        title={t("modals.report.title")}
        successCallback={handleReportSuccess}
      />
    </>
  )
}

export default ProductSection;