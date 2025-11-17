"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TbStar, TbClock } from "react-icons/tb";

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
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

const categoryColors: Record<string, string> = {
  DESIGN: "bg-blue-100 text-blue-700",
  DATA: "bg-green-100 text-green-700",
  CODING: "bg-purple-100 text-purple-700",
  WRITING: "bg-yellow-100 text-yellow-700",
  EVENT: "bg-pink-100 text-pink-700",
  TUTOR: "bg-indigo-100 text-indigo-700",
  TECHNICAL: "bg-red-100 text-red-700",
  OTHER: "bg-gray-100 text-gray-700",
};

const categoryNames: Record<string, string> = {
  DESIGN: "Desain",
  DATA: "Data",
  CODING: "Pemrograman",
  WRITING: "Penulisan",
  EVENT: "Acara",
  TUTOR: "Tutor",
  TECHNICAL: "Teknis",
  OTHER: "Lainnya",
};

const ServiceCard = ({ service }: ServiceCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Link href={`/services/${service.id}`}>
      <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg border-border">
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          {service.images && service.images.length > 0 ? (
            <Image
              src={service.images[0]}
              alt={service.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <span className="text-4xl text-muted-foreground">📦</span>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <Badge className={`${categoryColors[service.category]} border-0`}>
              {categoryNames[service.category]}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={service.seller.profilePicture || ""}
                alt={service.seller.fullName}
              />
              <AvatarFallback className="bg-primary text-white text-xs">
                {getInitials(service.seller.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {service.seller.fullName}
              </p>
              {service.seller.major && (
                <p className="text-xs text-muted-foreground truncate">
                  {service.seller.major}{" "}
                  {service.seller.batch && `• ${service.seller.batch}`}
                </p>
              )}
            </div>
          </div>

          <h3 className="mb-2 line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
            {service.title}
          </h3>

          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {service.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <TbStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground">
                  {service.avgRating > 0
                    ? service.avgRating.toFixed(1)
                    : "Baru"}
                </span>
                {service.totalReviews > 0 && (
                  <span className="text-muted-foreground">
                    ({service.totalReviews})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-muted-foreground">
                <TbClock className="h-4 w-4" />
                <span>{service.deliveryTime} hari</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">Mulai dari</p>
              <p className="text-lg font-bold text-primary">
                Rp {service.price.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ServiceCard;
