export default function BrowseLoading() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="h-10 w-48 bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-64 bg-muted animate-pulse rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse">
              <div className="w-full aspect-video bg-muted rounded-md mb-4" />
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-muted rounded-md" />
                <div className="h-4 w-1/2 bg-muted rounded-md" />
                <div className="h-4 w-full bg-muted rounded-md mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
