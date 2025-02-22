"use client";
import style from "../content.module.scss"
import { useRef } from "react"
import useDragDrop from "./hooks/useDragDrop";
import classNames from 'classnames';


export function FileControl({
    label,
    handleFile,
    fileWatcher,
    children,
    ...props
}: {
    label: string,
    handleFile: (file: File | undefined) => void,
    fileWatcher: File | undefined,
    children?: React.ReactNode
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { fileDropRef, isDragging } = useDragDrop(handleFile);
    function uploadFile() {
        fileInputRef.current?.click();
    }
    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    }

    function handleClearValue() {
        handleFile(undefined)
    }

    return (
        <div>
            <div className={style.row}>
                <div className={style.text}>
                    <label>{label}</label>
                </div>
                <div className={style.control2}>
                    <div className={classNames(style.avatar, { [style.hasValue]: fileWatcher })}>
                        <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.6667 3.00033H8.4C6.15979 3.00033 5.03969 3.00033 4.18404 3.4363C3.43139 3.81979 2.81947 4.43172 2.43597 5.18436C2 6.04001 2 7.16012 2 9.40033V20.6003C2 22.8405 2 23.9606 2.43597 24.8163C2.81947 25.5689 3.43139 26.1809 4.18404 26.5644C5.03969 27.0003 6.15979 27.0003 8.4 27.0003H20.6667C21.9066 27.0003 22.5266 27.0003 23.0353 26.864C24.4156 26.4942 25.4938 25.416 25.8637 24.0356C26 23.5269 26 22.907 26 21.667M23.3333 9.66699V1.66699M19.3333 5.66699H27.3333M12 10.3337C12 11.8064 10.8061 13.0003 9.33333 13.0003C7.86057 13.0003 6.66667 11.8064 6.66667 10.3337C6.66667 8.8609 7.86057 7.66699 9.33333 7.66699C10.8061 7.66699 12 8.8609 12 10.3337ZM17.9867 14.8912L6.7082 25.1444C6.07382 25.7211 5.75663 26.0095 5.72857 26.2593C5.70425 26.4758 5.78727 26.6905 5.95091 26.8344C6.13971 27.0003 6.56837 27.0003 7.42571 27.0003H19.9413C21.8602 27.0003 22.8196 27.0003 23.5732 26.678C24.5193 26.2733 25.2729 25.5196 25.6776 24.5736C26 23.82 26 22.8605 26 20.9416C26 20.296 26 19.9732 25.9294 19.6725C25.8407 19.2947 25.6706 18.9408 25.431 18.6355C25.2403 18.3926 24.9883 18.1909 24.4841 17.7876L20.7544 14.8039C20.2499 14.4002 19.9976 14.1984 19.7197 14.1271C19.4748 14.0644 19.2172 14.0725 18.9767 14.1506C18.7039 14.2392 18.4648 14.4565 17.9867 14.8912Z" stroke="#535862" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className={style.clearValue} onClick={handleClearValue}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 1L1 13M1 1L13 13" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <div className={classNames(style.fileUpload, { [style.dragging]: isDragging })} ref={fileDropRef}>
                        <input {...props} type="file" ref={fileInputRef} onChange={handleFileChange} />
                        <button type="button" onClick={uploadFile} className={style.action}>Click to upload</button>
                        <label className={style.text}>or drag and drop SVG, PNG, JPG or GIF (max. 800x400px)</label>
                    </div>
                </div>
            </div>
            {children}
        </div>
    )
}