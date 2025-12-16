"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRating } from "@/lib/utils"; // Pastikan utilitas ini ada atau hapus jika tidak perlu

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    pricingType?: string;
    deliveryTime: number;
    images: string[];
    avgRating: number;
    totalReviews: number;
    seller: {
      id: string;
      fullName: string;
      profilePicture: string | null;
      major: string | null;
      batch: string | null;
      avgRating: number;
    };
  };
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  // Helper untuk format mata uang IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Helper untuk inisial nama
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Link href={`/services/${service.id}`} className="block h-full">
      <div className="group cursor-pointer flex flex-col h-full ">
        {/* Image Section - Aspect Ratio 4/3 dengan Rounded-2xl */}
        <div className="relative border-primary border aspect-4/3 overflow-hidden rounded-2xl mb-4 bg-secondary">
          {service.images && service.images.length > 0 ? (
            <Image
              src={service.images[0]}
              alt={service.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gray-100 text-sm">
              No Image
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="space-y-1 flex flex-col flex-1">
          {/* Seller Info */}
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage
                src={service.seller.profilePicture || ""}
                alt={service.seller.fullName}
              />
              <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground">
                {getInitials(service.seller.fullName)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              {service.seller.fullName}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2"
            title={service.title}
          >
            {service.title}
          </h3>

          {/* Rating & Price - Push to bottom */}
          <div className="flex items-center justify-between mt-auto pt-1">
            <div className="flex items-center gap-1">
              {/* Menggunakan style fill-foreground agar bintang berwarna hitam/solid sesuai target */}
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {formatRating(service.avgRating)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({service.totalReviews})
              </span>
            </div>

            <p className="text-sm font-medium text-foreground">
              Dari {formatPrice(service.price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
