import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

type ArtworkFile = {
  name: string;
  id: string;
  created_at: string | null;
  metadata: {
    size?: number;
    mimetype?: string;
  } | null;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "Unknown";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isImage(filename: string) {
  return /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(filename);
}

export default async function ArtworkPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Try listing files under the user's folder in the Artwork bucket
  const { data: files, error } = await supabase.storage
    .from("Artwork")
    .list(user.id, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  // Also try by email prefix as fallback
  const emailPrefix = user.email?.split("@")[0];
  let emailFiles: ArtworkFile[] = [];
  if (emailPrefix) {
    const { data: ef } = await supabase.storage
      .from("Artwork")
      .list(emailPrefix, {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });
    emailFiles = (ef ?? []) as ArtworkFile[];
  }

  const artworkFiles = [
    ...((files ?? []) as ArtworkFile[]),
    ...emailFiles,
  ].filter((f) => f.name !== ".emptyFolderPlaceholder");

  if (error && artworkFiles.length === 0) {
    console.error("Artwork fetch error:", error.message);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Artwork</h1>
        <p className="mt-1 text-sm text-gray-500">
          Files uploaded for your orders.
        </p>
      </div>

      {artworkFiles.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-12 text-center">
          <div className="mb-4 text-5xl">🎨</div>
          <h2 className="text-lg font-bold text-gray-900">No artwork yet</h2>
          <p className="mt-2 max-w-sm mx-auto text-sm text-gray-500">
            Your uploaded artwork will appear here after your first order. You
            can upload files during the order process.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {artworkFiles.map((file) => {
            const folder = files?.find((f) => f.name === file.name)
              ? user.id
              : emailFiles.find((f) => f.name === file.name)
                ? user.email?.split("@")[0]
                : user.id;

            const { data: urlData } = supabase.storage
              .from("Artwork")
              .getPublicUrl(`${folder}/${file.name}`);

            const publicUrl = urlData?.publicUrl;
            const isImg = isImage(file.name);

            return (
              <div
                key={file.id ?? file.name}
                className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4"
              >
                {/* Thumbnail or icon */}
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-gray-50 flex items-center justify-center">
                  {isImg && publicUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={publicUrl}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">📄</span>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {file.name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                    {file.metadata?.size !== undefined && (
                      <span>{formatBytes(file.metadata.size)}</span>
                    )}
                    {file.metadata?.size !== undefined && (
                      <span>·</span>
                    )}
                    <span>{formatDate(file.created_at)}</span>
                  </div>
                </div>

                {/* Download */}
                {publicUrl && (
                  <a
                    href={publicUrl}
                    download={file.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                  >
                    Download
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
