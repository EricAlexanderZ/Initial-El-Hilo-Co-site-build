import Image from "next/image";
import { processSteps } from "@/lib/home-content";

export function ProcessSteps() {
  return (
    <section className="bg-[#ffd84d] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          <span className="text-black/40">Upload. Approve.</span>{" "}
          <span className="text-black">Receive.</span>
        </h2>

        <div className="mt-10 rounded-[2rem] bg-white px-6 py-10 shadow-lg sm:px-12 md:px-20 md:py-14">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            {processSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative mx-auto h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48">
                  <Image src={step.image} alt={step.title} fill className="object-contain" />
                </div>
                <div className="mx-auto mt-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#e5b43d] text-sm font-extrabold text-black">
                  {step.step}
                </div>
                <h3 className="mt-6 text-xl sm:text-2xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
