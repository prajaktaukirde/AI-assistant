export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div
      className="grid place-items-center rounded-xl shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        background:
          'linear-gradient(135deg, #b45309 0%, #7c2d12 55%, #1c1917 100%)',
      }}
    >
      <svg
        viewBox="0 0 32 32"
        width={size * 0.62}
        height={size * 0.62}
        fill="none"
      >
        <path
          d="M5 7 L16 26 L27 7"
          stroke="white"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
