import React from "react";

export default function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl glass border border-white/[0.06] overflow-hidden p-4 space-y-4">
      {/* Image Skeleton */}
      <div className="aspect-square w-full rounded-xl skeleton" />

      {/* Info Skeleton */}
      <div className="space-y-2.5">
        {/* Category badge */}
        <div className="h-3.5 w-1/3 skeleton" />

        {/* Title */}
        <div className="h-5 w-3/4 skeleton" />

        {/* Price & button */}
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-1/4 skeleton" />
          <div className="h-8 w-1/2 rounded-lg skeleton" />
        </div>
      </div>
    </div>
  );
}
