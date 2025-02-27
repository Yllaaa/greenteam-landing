import { useRef, useEffect, useState } from "react";

const useDragDrop = (
    handleFile: (file: File) => void
) => {
    const fileDropRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (fileDropRef.current) {
            fileDropRef.current.addEventListener("dragenter", () => {
                setIsDragging(true);
            })
            fileDropRef.current.addEventListener("dragover", (event: DragEvent) => {
                event.preventDefault();
                event.stopPropagation();
            });
            fileDropRef.current.addEventListener("drop", (event: DragEvent) => {
                event.preventDefault();
                event.stopPropagation();
                const file = event.dataTransfer?.files[0];
                if (file) {
                    handleFile(file);
                }
                setIsDragging(false);
            })
            fileDropRef.current.addEventListener("dragleave", (event) => {
                if(!fileDropRef.current?.contains(event.relatedTarget as Node)){
                    setIsDragging(false);
                }
            })
        }
    }, [fileDropRef, handleFile]);

    return { fileDropRef, isDragging }
}

export default useDragDrop