"use client";

import { useState } from "react";

type FAQItem = { q: string; a: string };
type FAQSection = { category: string; items: FAQItem[] };

const FAQS: FAQSection[] = [
  {
    category: "Ordering & Process",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse our product catalog, select your style, color, placement, and quantity, then upload your artwork. Once you add items to your cart and complete checkout, our team gets to work preparing your digital proof.",
      },
      {
        q: "What is the minimum order quantity?",
        a: "Minimum order quantities vary by product. Custom Hats and Custom Polos require a minimum of 5 pieces. Custom Hoodies and Custom Sweaters can be ordered as a single item.",
      },
      {
        q: "How long does it take to receive my order?",
        a: "Most orders are completed and shipped within 7–14 business days after you approve your proof. Turnaround depends on order size and complexity.",
      },
      {
        q: "What happens after I place my order?",
        a: "Our team reviews your artwork and prepares a digital proof, which we send to your email for approval. Production begins only after you give the green light — we never stitch without your approval.",
      },
      {
        q: "Can I cancel or make changes to my order?",
        a: "You may cancel or request changes any time before approving your proof. Once you approve and production begins, changes cannot be made. If you haven't responded within 5 days, your proof auto-approves to keep your timeline on track.",
      },
      {
        q: "Do you accept rush orders?",
        a: "Reach out to us at orders@elhiloco.com before placing your order and we'll do our best to accommodate tight timelines.",
      },
    ],
  },
  {
    category: "Artwork & Design",
    items: [
      {
        q: "What file formats do you accept?",
        a: "We accept PNG, JPG, PDF, AI, EPS, and SVG files up to 10 MB. For the best embroidery quality, vector files (AI, EPS, SVG) are preferred.",
      },
      {
        q: "What is a proof and do I have to approve it?",
        a: "A proof is a digital mockup showing exactly how your embroidery will look — including placement, size, and thread colors. You must approve your proof before we begin production. This ensures everything looks exactly right.",
      },
      {
        q: "What if my artwork isn't print-ready?",
        a: "Not a problem. Send us what you have and our team will work with you to clean it up or digitize it for embroidery at no extra charge.",
      },
      {
        q: "How many thread colors can my design have?",
        a: "Standard embroidery supports up to 15 thread colors. Complex multi-color designs may affect production time.",
      },
      {
        q: "What size can my embroidered logo be?",
        a: "Left chest logos are typically 3–4 inches wide. Larger placements like back logos can go up to 9 inches wide. During the proof stage we'll confirm sizing before production.",
      },
      {
        q: "Can I embroider on both the front and back?",
        a: "Yes — many of our products offer dual placement options. Select both placements when configuring your order, and the price will adjust accordingly.",
      },
      {
        q: "Will my colors match my artwork exactly?",
        a: "We match as closely as possible using industry-standard thread color charts. Due to the nature of embroidery thread, exact color matching cannot be guaranteed, but we will always communicate with you if there's a significant difference.",
      },
    ],
  },
  {
    category: "Pricing & Payment",
    items: [
      {
        q: "How is pricing determined?",
        a: "Pricing depends on the product type, quantity ordered, and placement options selected. All prices are shown transparently on each product page before you add anything to your cart.",
      },
      {
        q: "Do prices go down with larger quantities?",
        a: "Yes. We offer tiered pricing — the more you order, the lower the per-unit price. You'll see the breakdown clearly on each product page.",
      },
      {
        q: "Is there a digitizing or setup fee?",
        a: "No. Digitizing and artwork setup are included in your order price. What you see at checkout is what you pay.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards, including Visa, Mastercard, American Express, and Discover — securely processed through Square.",
      },
      {
        q: "Are there any hidden fees?",
        a: "None. Your order total shown at checkout is your final price, including any placement or size upcharges.",
      },
    ],
  },
  {
    category: "Products",
    items: [
      {
        q: "What hat styles do you offer?",
        a: "We carry OTTO Hats, Performance Rope Hats, Richardson 112 Trucker Hats, and New Era Snapbacks. Each is available in multiple color options.",
      },
      {
        q: "What is 3D Puff embroidery?",
        a: "3D Puff embroidery uses a foam underlay beneath the stitching to create a raised, dimensional effect. It gives logos and text a bold, premium look — especially popular on hats.",
      },
      {
        q: "What's the difference between Regular and 3D Puff embroidery?",
        a: "Regular embroidery lies flat against the fabric for a clean, classic finish. 3D Puff is raised and dimensional for a more standout, streetwear-inspired look. Both are high quality — it's just a style preference.",
      },
      {
        q: "Can I order samples before a large order?",
        a: "Contact us at orders@elhiloco.com to discuss sample options for large bulk orders.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    items: [
      {
        q: "How much does shipping cost?",
        a: "Shipping is calculated at checkout based on your delivery address and order size. We provide live shipping rates from USPS so you always get accurate pricing.",
      },
      {
        q: "Do you ship internationally?",
        a: "We currently ship within the United States only. For international inquiries, please contact us directly.",
      },
      {
        q: "How long does shipping take after production?",
        a: "Shipping typically takes 2–5 business days depending on your location and the shipping method selected at checkout.",
      },
      {
        q: "Will I receive a tracking number?",
        a: "Yes. Once your order ships, you'll receive an email with your tracking information so you can follow your package every step of the way.",
      },
    ],
  },
  {
    category: "Care & Quality",
    items: [
      {
        q: "How do I care for embroidered items?",
        a: "Machine wash cold, inside out, on a gentle cycle. Hang dry or tumble dry on low heat. Avoid bleach and high-heat drying to preserve the quality and longevity of the embroidery.",
      },
      {
        q: "Will the embroidery fade or fray over time?",
        a: "Our embroidery uses colorfast, commercial-grade thread designed to last. With proper care, your embroidered items will hold up through regular use and washing.",
      },
      {
        q: "What if there's a defect in my order?",
        a: "Your satisfaction is our priority. If you receive an item with a production defect, contact us within 7 days of delivery at orders@elhiloco.com and we'll make it right.",
      },
    ],
  },
];

function FAQItem({ q, a }: FAQItem) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/5 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold transition hover:text-[#13294b]"
      >
        <span>{q}</span>
        <span className={`shrink-0 text-lg text-gray-400 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <p className="pb-5 text-sm leading-7 text-gray-600">{a}</p>
      )}
    </div>
  );
}

export default function FAQAccordion() {
  return (
    <div className="space-y-10">
      {FAQS.map((section) => (
        <div key={section.category}>
          <h2 className="mb-4 text-xl font-extrabold">{section.category}</h2>
          <div className="rounded-[1.75rem] bg-white px-6 shadow-sm">
            {section.items.map((item) => (
              <FAQItem key={item.q} {...item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
