"use client";

import { useState } from "react";
import { ImagePlaceholder } from "@/components/catalog/image-placeholder";
import type { ProductImage } from "@/types/catalog";

export function ProductGallery({
  images,
  name,
}: {
  images: ProductImage[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="space-y-3">
      {current ? (
        <div className="blueprint-grid aspect-[4/3] border border-border bg-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={current.alt || name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <ImagePlaceholder label={name} ratio="aspect-[4/3]" />
      )}
      {images.length > 1 ? (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={`size-16 border ${i === active ? "border-ink" : "border-border"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
