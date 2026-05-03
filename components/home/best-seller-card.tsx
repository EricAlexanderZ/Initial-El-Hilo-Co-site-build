import Image from "next/image";
import Link from "next/link";

type BestSellerCardProps = {
  title: string;
  image: string;
  href: string;
  imageScale?: string;
};

export default function BestSellerCard({
  title,
  image,
  href,
  imageScale = "scale-[2]",
}: BestSellerCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-[2rem] border border-black/10 bg-[#f3f3f1] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] sm:p-5"
    >
      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-[#d8dce3] bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#243b63] shadow-sm">
          {title}
        </div>
      </div>

      <div className="mt-4 flex min-h-[200px] sm:min-h-[260px] items-center justify-center rounded-[1.5rem] bg-[#f3f3f1] p-4">
        <div className="relative h-[220px] w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className={`${imageScale} object-contain p-0 drop-shadow-[0_10px_18px_rgba(0,0,0,0.10)] transition duration-300 group-hover:scale-[1.4]`}
          />
        </div>
      </div>
    </Link>
  );
}
