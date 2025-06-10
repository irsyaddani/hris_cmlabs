"use client";

import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter(); // Move useRouter inside the component

  return (
    <div className="w-full py-12 lg:py-24">
      <div className="max-w-[1440px] mx-auto px-[140px]">
        <div className="flex flex-col gap-10 items-left">
          <div className="flex gap-7 flex-col">
            <div className="flex gap-4 flex-col">
              <h1 className="text-5xl md:text-6xl font-medium tracking-tighter text-left flex">
                Kelola sumber daya yang lebih cepat dan efisien.
              </h1>
              <p className="text-xl tracking-tighter text-muted-foreground text-left flex">
                Otomatisasi proses HR dari absensi hingga payroll dengan sistem
                terpadu yang dirancang untuk perusahaan modern.
              </p>
            </div>
            <div className="flex flex-row gap-3">
              <Button
                size="lg"
                className="gap-4 bg-primary-900 text-white hover:bg-primary-700 cursor-pointer"
                onClick={() => router.push("/auth/signup")}
              >
                Daftar Sekarang
              </Button>
              <Button
                size="lg"
                className="gap-4 cursor-pointer"
                variant="outline"
              >
                Pelajari
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-md">
            <img
              src="https://images.pexels.com/photos/4344860/pexels-photo-4344860.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Deskripsi gambar"
              className="w-full aspect-square lg:aspect-auto lg:h-[563px] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
