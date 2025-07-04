import React from "react";
import styles from "./Skeleton.module.scss";

interface SkeletonProps {
    height?: string;
    width?: string;
    borderRadius?: string;
}

interface SkeletonCircleProps {
    size: string;
}

interface SkeletonTextProps {
    noOfLines: number;
    spacing: string;
    skeletonHeight?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    height = "20px",
    width = "100%",
    borderRadius = "4px"
}) => {
    return (
        <div
            className={styles.skeleton}
            style={{ height, width, borderRadius }}
        />
    );
};

export const SkeletonCircle: React.FC<SkeletonCircleProps> = ({ size }) => {
    return (
        <div
            className={styles.skeleton}
            style={{ height: size, width: size, borderRadius: "50%" }}
        />
    );
};

export const SkeletonText: React.FC<SkeletonTextProps> = ({
    noOfLines,
    spacing,
    skeletonHeight = "10px"
}) => {
    return (
        <div className={styles.skeletonText} style={{ gap: spacing }}>
            {Array(noOfLines)
                .fill(0)
                .map((_, index) => (
                    <Skeleton key={index} height={skeletonHeight} width={index === 0 ? "80%" : "100%"} />
                ))}
        </div>
    );
};