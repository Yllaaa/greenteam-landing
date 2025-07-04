export async function downloadPDF(url: string, filename: string | null) {
  try {
    // Validate URL
    if (!url) {
      throw new Error("URL is required");
    }

    // Show loading indicator to user
    console.log("Downloading PDF...");

    // Fetch the PDF file
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "multipart/pdf",
        Accept: "application/pdf",
        "access-control-allow-origin": "*",
      },
      mode: "cors", // Ensure CORS is enabled if the PDF is hosted on a different domain
      credentials: "include", // Include credentials if needed (e.g., for authentication)
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(
        `Failed to download PDF: ${response.status} ${response.statusText}`
      );
    }

    // Get the PDF file as a blob
    const pdfBlob = await response.blob();

    // Create a URL for the blob
    const blobUrl = URL.createObjectURL(pdfBlob);

    // If no filename provided, try to extract it from the URL or use a default
    if (!filename) {
      const urlParts = url.split("/");
      filename = urlParts[urlParts.length - 1];

      // If filename extraction fails, use a default
      if (!filename || filename.trim() === "") {
        filename = "downloaded-document.pdf";
      }

      // Make sure the filename ends with .pdf
      if (!filename.toLowerCase().endsWith(".pdf")) {
        filename += ".pdf";
      }
    }

    // Create a temporary anchor element
    const downloadLink = document.createElement("a");
    downloadLink.href = blobUrl;
    downloadLink.download = filename;
    downloadLink.style.display = "none";

    // Add to document, click it, and remove it
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Clean up the blob URL
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
      console.log(`PDF downloaded as ${filename}`);
    }, 100);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw error;
  }
}
