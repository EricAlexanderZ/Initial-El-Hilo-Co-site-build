import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/home-content";

export default function AddMoreCategories() {
  return (
    <section className="mt-16">
      <h2 className="text-center text-4xl font-extrabold tracking-tight">
        Add More to Your Order
      </h2>

      <div className="mt-8 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group flex flex-col items-center justify-center rounded-2xl p-4 text-center transition duration-300"
            >
              <div className="relative h-48 w-48 transition duration-300 group-hover:scale-110">
                <Image
                  src={category.image!}
                  alt={category.name}
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>
              <span className="mt-4 text-2xl font-bold transition duration-300 group-hover:text-[#13294b]">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
