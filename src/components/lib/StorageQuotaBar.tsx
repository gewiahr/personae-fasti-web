interface StorageQuotaBarProps {
  usedBytes: number;
  maxBytes: number;
  reservedBytes?: number;
  label?: string;
  className?: string;
}

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} КБ`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} МБ`;
  return `${(bytes / 1024 ** 3).toFixed(1)} ГБ`;
};

export const StorageQuotaBar = ({
  usedBytes,
  maxBytes,
  reservedBytes = 0,
  label = 'Хранилище',
  className = '',
}: StorageQuotaBarProps) => {
  const occupiedBytes = Math.max(0, usedBytes + reservedBytes);
  const percentage = maxBytes > 0 ? Math.min(100, occupiedBytes / maxBytes * 100) : 0;

  return (
    <div className={className}>
      <div className="mb-1.5 flex justify-between gap-3 text-sm text-(--color-gray)">
        <span>{label}</span>
        <span>{formatBytes(occupiedBytes)} / {formatBytes(maxBytes)}</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={Math.max(1, maxBytes)}
        aria-valuenow={Math.min(occupiedBytes, Math.max(1, maxBytes))}
        className="h-2 overflow-hidden rounded-full bg-black/25"
      >
        <div
          className="h-full rounded-full bg-(--color-accent) transition-[width] duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default StorageQuotaBar;
