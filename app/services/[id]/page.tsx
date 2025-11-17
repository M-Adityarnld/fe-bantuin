"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import {
  TbStar,
  TbClock,
  TbRefresh,
  TbShoppingCart,
  TbUser,
  TbMapPin,
  TbCalendar,
} from "react-icons/tb";

interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number;
  revisions: number;
  images: string[];
  avgRating: number;
  totalReviews: number;
  totalOrders: number;
  seller: {
    id: string;
    fullName: string;
    profilePicture: string | null;
    bio: string | null;
    major: string | null;
    batch: string | null;
    avgRating: number;
    totalReviews: number;
    totalOrdersCompleted: number;
    createdAt: string;
  };
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    sellerResponse: string | null;
    createdAt: string;
    author: {
      id: string;
      fullName: string;
      profilePicture: string | null;
      major: string | null;
    };
  }>;
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

const ServiceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setService(data.data);
        } else {
          router.push("/services");
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        router.push("/services");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params.id]);

  const handleOrder = () => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    // TODO: Navigate to order page
    router.push(`/orders/create?serviceId=${params.id}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </PublicLayout>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Images */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100">
                    {service.images.length > 0 ? (
                      <Image
                        src={service.images[selectedImage]}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-6xl">📦</span>
                      </div>
                    )}
                  </div>

                  {service.images.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto">
                      {service.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 ${
                            selectedImage === index
                              ? "border-primary"
                              : "border-transparent"
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`${service.title} ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Service Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Badge className={categoryColors[service.category]}>
                      {categoryNames[service.category]}
                    </Badge>
                  </div>

                  <h1 className="text-3xl font-bold text-foreground mb-4">
                    {service.title}
                  </h1>

                  <div className="flex items-center gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-1">
                      <TbStar className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {service.avgRating > 0
                          ? service.avgRating.toFixed(1)
                          : "Baru"}
                      </span>
                      {service.totalReviews > 0 && (
                        <span className="text-muted-foreground">
                          ({service.totalReviews} ulasan)
                        </span>
                      )}
                    </div>

                    <Separator orientation="vertical" className="h-4" />

                    <div className="text-muted-foreground">
                      {service.totalOrders} pesanan
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h2 className="text-xl font-semibold mb-4">Deskripsi</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {service.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Seller Info */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Tentang Penyedia Jasa
                  </h2>

                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={service.seller.profilePicture || ""}
                        alt={service.seller.fullName}
                      />
                      <AvatarFallback className="bg-primary text-white text-lg">
                        {getInitials(service.seller.fullName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {service.seller.fullName}
                      </h3>
                      {service.seller.major && (
                        <p className="text-sm text-muted-foreground">
                          {service.seller.major}
                          {service.seller.batch &&
                            ` • Angkatan ${service.seller.batch}`}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <TbStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {service.seller.avgRating.toFixed(1)}
                          </span>
                          <span className="text-muted-foreground">
                            ({service.seller.totalReviews})
                          </span>
                        </div>

                        <div className="text-muted-foreground">
                          {service.seller.totalOrdersCompleted} pesanan selesai
                        </div>
                      </div>

                      {service.seller.bio && (
                        <p className="mt-3 text-sm text-muted-foreground">
                          {service.seller.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              {service.reviews.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Ulasan ({service.totalReviews})
                    </h2>

                    <div className="space-y-6">
                      {service.reviews.map((review) => (
                        <div key={review.id} className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={review.author.profilePicture || ""}
                                alt={review.author.fullName}
                              />
                              <AvatarFallback className="bg-primary text-white text-sm">
                                {getInitials(review.author.fullName)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">
                                    {review.author.fullName}
                                  </p>
                                  {review.author.major && (
                                    <p className="text-xs text-muted-foreground">
                                      {review.author.major}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <TbStar
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>

                              <p className="mt-2 text-sm text-muted-foreground">
                                {review.comment}
                              </p>

                              <p className="mt-1 text-xs text-muted-foreground">
                                {formatDate(review.createdAt)}
                              </p>

                              {review.sellerResponse && (
                                <div className="mt-3 pl-4 border-l-2 border-primary">
                                  <p className="text-sm font-medium">
                                    Tanggapan Penyedia
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {review.sellerResponse}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <Separator />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                {/* Order Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <p className="text-sm text-muted-foreground mb-1">
                        Mulai dari
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        Rp {service.price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TbClock className="h-4 w-4" />
                          <span>Waktu Pengerjaan</span>
                        </div>
                        <span className="font-medium">
                          {service.deliveryTime} hari
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TbRefresh className="h-4 w-4" />
                          <span>Revisi</span>
                        </div>
                        <span className="font-medium">
                          {service.revisions}x
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleOrder}
                      className="w-full"
                      size="lg"
                      disabled={
                        isAuthenticated && user?.id === service.seller.id
                      }
                    >
                      <TbShoppingCart className="mr-2" />
                      {isAuthenticated && user?.id === service.seller.id
                        ? "Jasa Anda Sendiri"
                        : "Pesan Sekarang"}
                    </Button>

                    {!isAuthenticated && (
                      <p className="text-xs text-center text-muted-foreground mt-2">
                        Login untuk melakukan pemesanan
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ServiceDetailPage;
