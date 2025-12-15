type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-200/70 dark:bg-slate-700/60 ${className}`}
      aria-hidden="true"
    />
  );
}
