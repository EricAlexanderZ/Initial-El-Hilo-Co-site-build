type Category = {
  name: string;
  href: string;
  icon?: string;
  image?: string;
};

export const categories: Category[] = [
  {
    name: "Custom Hats",
    href: "/products/custom-hats",
    image: "/images/home/Home Content/PREMIUM_STITCH_ELHILOCO.svg"
  },
  {
    name: "Custom Polos",
    href: "/products/custom-polos",
    image: "/images/home/LeftChestLogo.png"
  },
  {
    name: "Custom Hoodies",
    href: "/products/custom-hoodies",
    image: "/images/home/Home Content/YELLOW_HOODIE (1).svg"
  },
  {
    name: "Custom Sweaters",
    href: "/products/custom-sweaters",
    image: "/images/home/Home Content/YELLOW_CREWNECK.svg"
  },
];

export const bestSellers = [
  {
    title: "Premium Stitched Hats",
    image: "/images/home/Home Content/PREMIUM_STITCH_ELHILOCO.svg",
    href: "/products/custom-hats",
    imageScale: "scale-[1]",
  },
 {
  title: "3D Puff Hats",
  image: "/images/home/Home Content/3D_Puff_ELHILOCO.svg",
  href: "/products/custom-hats",
  imageScale: "scale-[1]",
},
  {
    title: "Left Chest Logo Polos",
    image: "/images/home/LeftChestLogo.png",
    href: "/products/custom-polos",
    imageScale: "scale-[1]",
  },
  {
    title: "Stitched Hoodies",
    image: "/images/home/Home Content/YELLOW_HOODIE (1).svg",
    href: "/products/custom-hoodies",
    imageScale: "scale-[1]",
  },
];

export const processSteps = [
  {
    image: "/images/home/IPHONE_UPLOAD.png",
    step: 1,
    title: "Upload your artwork",
    description:
      "Send us your logo, design, or concept and we will prepare it for embroidery.",
  },
  {
    image: "/images/home/MONITOR_APPROVED.png",
    step: 2,
    title: "Review and Approve",
    description:
      "We send a proof, make any needed adjustments, and get approval before production begins.",
  },
  {
    image: "/images/home/BOX_TAPE_LOGO.png",
    step: 3,
    title: "Receive your Order",
    description:
      "We stitch, pack, and ship your order with a clean turnaround and premium finish.",
  },
];

export const logos = [
  { src: "/images/home/B2Z Engineering.png", alt: "B2Z Engineering" },
  { src: "/images/home/B2Z Enterprises Logo.png", alt: "B2Z Enterprises" },
  { src: "/images/home/Onyx Aesthetics Logo.png", alt: "Onyx Aesthetics" },
  { src: "/images/home/PEAK_ATHLETIC_CLUB.png", alt: "Peak Athletic Club" },
];