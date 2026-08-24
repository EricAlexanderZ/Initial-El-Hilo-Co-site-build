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
    <Link prefetch={false}
      href={href}
      className="group rounded-[2rem] border border-black/10 bg-[#f3f3f1] p-3 shadow-[0_16px_48px_rgba(0,0,0,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(0,0,0,0.14)] sm:p-5"
    >
      {/* Mobile: plain centered title | Desktop: pill badge */}
      <div className="flex justify-center">
        <div className="sm:inline-flex sm:rounded-full sm:border sm:border-[#d8dce3] sm:bg-white sm:px-4 sm:py-1.5 sm:shadow-sm text-center text-[11px] font-semibold uppercase tracking-wide text-[#243b63] whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
          {title}
        </div>
      </div>

      <div className="mt-2 sm:mt-4 flex min-h-[140px] sm:min-h-[260px] items-center justify-center rounded-[1.5rem] bg-[#f3f3f1] p-2 sm:p-4">
        <div className="relative h-[130px] sm:h-[220px] w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className={`${imageScale} object-contain p-0 drop-shadow-[0_10px_18px_rgba(0,0,0,0.10)] transition duration-300 group-hover:scale-[1.4]`}
          />
        </div>
      </div>
    </Link>
  );
}
