export default function SocialButton({ provider }) {
  const isGoogle = provider === "google";
  const isFacebook = provider === "facebook";
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/30"
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {isGoogle && (
          <>
            <path
              fill="#4285F4"
              d="M22.54 10.12h-.01V9H12v6h5.72c-.36 2.12-1.72 3.87-3.62 4.65l-.01.01A7.94 7.94 0 0 0 12 23c3.22 0 6.14-1.54 7.89-3.89a11.34 11.34 0 0 0 2.65-7.99Z"
            />
            <path
              fill="#34A853"
              d="M12 2C8.28 2 5.25 4.58 4.25 8.49a8.94 8.94 0 0 0 0 7.02 8.82 8.82 0 0 0 2.73 3.34l.01-.01A7.92 7.92 0 0 0 12 22c1.87 0 3.63-.64 4.98-1.71l.01-.01-.67-.53A6.52 6.52 0 0 1 12 20a8 8 0 0 1-7.73-9.54 8.07 8.07 0 0 1 3.93-4.94l.01.01A7.92 7.92 0 0 1 12 4c1.86 0 3.6.66 4.95 1.72l.01-.01-.67.53A6.52 6.52 0 0 0 14.45 4z"
            />
          </>
        )}
        {isFacebook && (
          <path
            fill="#1877F2"
            d="M22.675 0h-21.35C.57 0 0 .59 0 1.326v21.348C0 23.41.57 24 1.325 24H12.82v-9.294H9.692V11.01h3.128V8.414c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.466.099 2.797.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.312h3.587l-.467 3.696h-3.12V24h6.116c.75 0 1.325-.59 1.325-1.326V1.326C24 .59 23.41 0 22.675 0Z"
          />
        )}
      </svg>
      {isGoogle && "Google"}
      {isFacebook && "Facebook"}
    </button>
  );
}
