import { ReactNode, useEffect, useState } from "react";

interface Testimonial {
  quote: string;
  author: string;
  position: string;
  imageSrc: string;
}

interface AuthLayoutProps {
  children: ReactNode;
  testimonials?: Testimonial[];
  interval?: number;
}

export function AuthLayout({
  children,
  testimonials = [
    {
      quote:
        "“Setelah menggunakan HRIS cmlabs, administrasi karyawan jadi lebih efisien.”",
      author: "Diana Monroe",
      position: "HR di PT. Indonesia Sejahtera",
      imageSrc:
        "https://images.pexels.com/photos/10041267/pexels-photo-10041267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      quote: "“Sistem absensinya simpel, payroll jadi otomatis!”",
      author: "Andi Suganda",
      position: "HRD di PT. Maju Jaya",
      imageSrc:
        "https://images.pexels.com/photos/7693223/pexels-photo-7693223.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      quote: "“Saya rekomendasikan platform ini ke semua HR!”",
      author: "Siska Wulandari",
      position: "HR Manager di PT. Sumber Makmur",
      imageSrc:
        "https://images.pexels.com/photos/7552313/pexels-photo-7552313.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ],
  interval = 5000,
}: AuthLayoutProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    setStartAnimation(true);

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % testimonials.length;
        if (nextIndex === 0) {
          setResetKey((prev) => prev + 1);
        }
        return nextIndex;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [interval, testimonials.length]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="flex flex-col lg:flex-row max-w-[1408px] mx-auto gap-1">
      {/* Left */}
      <div className="hidden lg:block w-[621px] bg-white relative">
        <div className="p-4 h-screen">
          <img
            src={currentTestimonial.imageSrc}
            alt="Gambar testimonial"
            className="absolute inset-4 h-[calc(100%-32px)] w-[calc(100%-32px)] object-cover dark:brightness-[0.2] dark:grayscale rounded-xl"
          />
          {/* Gradient Overlay */}
          <div className="absolute rounded-xl left-4 right-4 bottom-4 h-[400px] bg-gradient-to-t from-black/80 to-transparent"></div>

          <div className="absolute inset-4 flex flex-col justify-between gap-2 p-4">
            {/* Progress Dots */}
            <div className="flex gap-2 w-full">
              {testimonials.map((_, index) => (
                <div
                  key={`${index}-${resetKey}`}
                  className="relative h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className={`
                      absolute left-0 top-0 h-full 
                      ${index < currentIndex ? "bg-white transition-none" : ""}
                      ${index === currentIndex ? "bg-white transition-all" : ""}
                    `}
                    style={{
                      width:
                        index < currentIndex
                          ? "100%"
                          : index === currentIndex
                          ? "100%"
                          : "0%",
                      transitionDuration:
                        index === currentIndex && startAnimation
                          ? `${interval}ms`
                          : "0ms",
                    }}
                  />
                </div>
              ))}
            </div>

            <div>
              <p className="text-xl text-white text-left">
                {currentTestimonial.quote}
              </p>
              <div className="flex gap-2 items-center mt-2">
                <p className="text-md text-muted text-left">
                  {currentTestimonial.author}
                </p>
                <div className="rounded-xl h-[6px] w-[6px] bg-muted"></div>
                <p className="text-md text-muted text-left">
                  {currentTestimonial.position}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="w-full lg:w-[783px] h-screen overflow-y-auto p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center min-h-full">
          <div className="w-full max-w-xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
