import Image from "next/image";
import { processSteps } from "@/lib/home-content";

export function ProcessSteps() {
  return (
    <section className="bg-gradient-to-t from-[#ffd84d] to-[#ffd84d]/[0.07] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center font-extrabold tracking-tight">
          <span className="block text-6xl text-black/40 sm:inline sm:text-4xl md:text-5xl lg:text-6xl">Upload.</span>
          <span className="block text-6xl text-black/40 sm:inline sm:text-4xl md:text-5xl lg:text-6xl"> Approve.</span>
          <span className="block text-6xl text-black sm:inline sm:text-4xl md:text-5xl lg:text-6xl"> Receive.</span>
        </h2>

        <div className="mt-10 rounded-[2rem] bg-white px-6 py-10 shadow-lg sm:px-12 md:px-20 md:py-14">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            {processSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative mx-auto h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48">
                  <Image src={step.image} alt={step.title} fill sizes="(max-width: 640px) 25vw, 120px" className="object-contain" />
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
