export default function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.5rem] p-6 shadow-sm ${
        accent ? "bg-[#13294b] text-white" : "bg-white text-black"
      }`}
    >
      <p className={`text-xs font-bold uppercase tracking-wider ${accent ? "text-white/50" : "text-gray-400"}`}>
        {label}
      </p>
      <p className="mt-3 text-4xl font-extrabold">{value}</p>
      {sub && (
        <p className={`mt-1 text-xs ${accent ? "text-white/40" : "text-gray-400"}`}>{sub}</p>
      )}
    </div>
  );
}
