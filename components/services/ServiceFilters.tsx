"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TbSearch, TbX } from "react-icons/tb";

interface ServiceFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onSearch: (query: string) => void;
}

export interface FilterState {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  ratingMin?: number;
  sortBy: string;
}

const categories = [
  { value: "DESIGN", label: "Desain" },
  { value: "DATA", label: "Data" },
  { value: "CODING", label: "Pemrograman" },
  { value: "WRITING", label: "Penulisan" },
  { value: "EVENT", label: "Acara" },
  { value: "TUTOR", label: "Tutor" },
  { value: "TECHNICAL", label: "Teknis" },
  { value: "OTHER", label: "Lainnya" },
];

const sortOptions = [
  { value: "newest", label: "Terbaru" },
  { value: "price_low", label: "Harga Terendah" },
  { value: "price_high", label: "Harga Tertinggi" },
  { value: "rating", label: "Rating Tertinggi" },
  { value: "popular", label: "Terpopuler" },
];

const ServiceFilters = ({ onFilterChange, onSearch }: ServiceFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    sortBy: "newest",
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | number | undefined
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setSearchQuery("");
    const resetFilters: FilterState = { sortBy: "newest" };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
    onSearch("");
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari jasa yang kamu butuhin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  onSearch("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <TbX className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filter</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-sm"
            >
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "category",
                  value === "all" ? undefined : value
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label>Rentang Harga</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "priceMin",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "priceMax",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <Label>Rating Minimal</Label>
            <Select
              value={filters.ratingMin?.toString() || "0"}
              onValueChange={(value) =>
                handleFilterChange(
                  "ratingMin",
                  value === "0" ? undefined : Number(value)
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Semua Rating</SelectItem>
                <SelectItem value="4">⭐ 4+</SelectItem>
                <SelectItem value="3">⭐ 3+</SelectItem>
                <SelectItem value="2">⭐ 2+</SelectItem>
                <SelectItem value="1">⭐ 1+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label>Urutkan</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange("sortBy", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceFilters;
