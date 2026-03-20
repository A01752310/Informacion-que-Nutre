export default function LoadingState({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <article
          key={i}
          className="bg-surface-container rounded-xl overflow-hidden animate-pulse"
        >
          <div className="h-64 bg-surface-container-highest" />
          <div className="p-8 space-y-6">
            <div className="flex gap-2">
              <div className="w-16 h-6 bg-surface-container-highest rounded-full" />
              <div className="w-16 h-6 bg-surface-container-highest rounded-full" />
            </div>
            <div className="space-y-3">
              <div className="w-3/4 h-8 bg-surface-container-highest rounded" />
              <div className="w-full h-4 bg-surface-container-highest rounded" />
              <div className="w-5/6 h-4 bg-surface-container-highest rounded" />
            </div>
          </div>
        </article>
      ))}
    </>
  );
}
