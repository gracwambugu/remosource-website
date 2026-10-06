type RemoSourceMarkProps = {
  className?: string;
};

type RemoSourceLogoProps = {
  className?: string;
  size?: "default" | "compact";
  invert?: boolean;
};

export function RemoSourceMark({ className }: RemoSourceMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="9" r="6.5" fill="#4DA3DC" />
      <circle cx="15" cy="19" r="6.5" fill="#4DA3DC" />
      <circle cx="49" cy="19" r="6.5" fill="#4DA3DC" />
      <path
        d="M22.5 31C25 23.5 28.5 20.5 32 20.5S39 23.5 41.5 31"
        stroke="#4DA3DC"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M2.5 49c0-10.5 5.5-17.5 15-17.5 6.5 0 10.5 3.5 13.5 11-3-1.7-6-2.5-9.1-2.5-6.5 0-10.8 3.2-13.1 9.3C7.5 52.6 6 54 4.3 54c-1.2 0-1.8-1.7-1.8-5Z"
        fill="#4DA3DC"
      />
      <path
        d="M61.5 49c0-10.5-5.5-17.5-15-17.5-6.5 0-10.5 3.5-13.5 11 3-1.7 6-2.5 9.1-2.5 6.5 0 10.8 3.2 13.1 9.3 1.3 3.3 2.8 4.7 4.5 4.7 1.2 0 1.8-1.7 1.8-5Z"
        fill="#4DA3DC"
      />
      <circle cx="32" cy="34" r="8" fill="#174F78" />
      <path
        d="M19.5 54c1.5-8 6-12 12.5-12s11 4 12.5 12c.6 3-2.9 4.6-5.2 2.7-2.2-1.8-4.6-2.7-7.3-2.7s-5.1.9-7.3 2.7c-2.3 1.9-5.8.3-5.2-2.7Z"
        fill="#174F78"
      />
    </svg>
  );
}

export function RemoSourceLogo({
  className = "",
  size = "default",
  invert = false,
}: RemoSourceLogoProps) {
  const compact = size === "compact";

  return (
    <span className={`inline-flex min-w-0 items-center gap-2.5 ${className}`}>
      <RemoSourceMark className={compact ? "h-6 w-6 shrink-0" : "h-9 w-9 shrink-0"} />
      <span
        className={`whitespace-nowrap font-display font-bold leading-none ${compact ? "text-sm" : "text-lg"} ${invert ? "text-navy-foreground" : "text-navy"}`}
      >
        Remo<span className="text-[color:var(--sky)]">Source</span>
      </span>
    </span>
  );
}