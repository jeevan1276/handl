export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        {/* Header Section Skeleton */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-muted border-4 border-background" />
          
          <div className="flex-1 space-y-4 w-full">
            <div>
              <div className="h-10 w-48 bg-muted rounded-md" />
              <div className="flex gap-3 mt-4">
                <div className="h-4 w-24 bg-muted rounded-md" />
                <div className="h-4 w-32 bg-muted rounded-md" />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <div className="h-6 w-20 bg-muted rounded-full" />
              <div className="h-6 w-32 bg-muted rounded-full" />
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="h-4 w-full bg-muted rounded-md" />
              <div className="h-4 w-5/6 bg-muted rounded-md" />
              <div className="h-4 w-4/6 bg-muted rounded-md" />
            </div>
          </div>
        </div>

        {/* Skills & Stats Section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4 bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="h-6 w-32 bg-muted rounded-md" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-24 bg-muted rounded-full" />
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="h-6 w-24 bg-muted rounded-md" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 w-20 bg-muted rounded-md" />
                  <div className="h-4 w-12 bg-muted rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
