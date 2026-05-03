import type { OrderStatus } from "@/lib/types/orders";

const STYLES: Record<OrderStatus, { label: string; className: string }> = {
  new:            { label: "New",           className: "bg-blue-100   text-blue-700"   },
  proof_sent:     { label: "Proof Sent",    className: "bg-purple-100 text-purple-700" },
  proof_approved: { label: "Approved",      className: "bg-yellow-100 text-yellow-700" },
  in_production:  { label: "In Production", className: "bg-orange-100 text-orange-700" },
  shipped:        { label: "Shipped",       className: "bg-teal-100   text-teal-700"   },
  complete:       { label: "Complete",      className: "bg-green-100  text-green-700"  },
  cancelled:      { label: "Cancelled",     className: "bg-red-100    text-red-600"    },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = STYLES[status] ?? STYLES.new;
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {label}
    </span>
  );
}
