import { TopBanner, SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

interface AuthCardProps {
  subtitle: string;
  children: React.ReactNode;
}

/**
 * Shared wrapper for all auth pages (login, signup, forgot-password,
 * update-password). Renders the site chrome + centered card with the
 * El Hilo Co branding block above it.
 */
export function AuthCard({ subtitle, children }: AuthCardProps) {
  return (
    <>
      <TopBanner />
      <SiteHeader />
      <main className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-[#f6f6f4] px-4 py-16">
        <div className="w-full max-w-md">
          {/* Branding */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#13294b] text-lg font-extrabold text-white"
            >
              EH
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#13294b]">
              El Hilo Co
            </h1>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
            {children}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
