import { createClient } from '@/lib/supabase/server'
import { GlassCard } from '@/components/shared/glass-card'
import { CategoryBadge } from '@/components/shared/category-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { TrustBadge } from '@/components/shared/trust-badge'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const CATEGORIES = [
  "tutoring", "design", "photography", "coding",
  "moving", "cleaning", "errands", "beauty",
  "tech_support", "events", "other"
]

export default async function BrowsePage(props: { searchParams: Promise<{ q?: string, category?: string }> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  
  let query = supabase
    .from('listings')
    .select('*, provider:profiles(name, avatar_url, verification_tier)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }
  if (searchParams.q) {
    // Basic ilike search if fts isn't working perfectly, but let's try tsvector
    // Actually ilike is safer for partial words in a hackathon, but schema has fts.
    // Let's use ilike on title for simplicity and robustness with partial matches.
    query = query.ilike('title', `%${searchParams.q}%`)
  }

  const { data: listings } = await query

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Browse Services</h1>
            <p className="text-muted-foreground mt-2">Find exactly what you need on campus.</p>
          </div>
          <form className="w-full md:w-96 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                name="q" 
                defaultValue={searchParams.q}
                placeholder="Search services..." 
                className="pl-9 glass-card bg-white/5 border-white/10"
              />
            </div>
            {searchParams.category && <input type="hidden" name="category" value={searchParams.category} />}
            <Button type="submit">Search</Button>
          </form>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <Link href="/browse" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!searchParams.category ? 'bg-primary text-primary-foreground' : 'bg-muted/50 hover:bg-muted text-muted-foreground'}`}>
            All
          </Link>
          {CATEGORIES.map(cat => (
            <Link 
              key={cat} 
              href={`/browse?category=${cat}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${searchParams.category === cat ? 'bg-primary text-primary-foreground' : 'bg-muted/50 hover:bg-muted text-muted-foreground'}`}
            >
              {cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </Link>
          ))}
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings && listings.length > 0 ? (
            listings.map((listing: { id: string, title: string, category: string, price: number, pricing_type: string, image_urls: string[] | null, provider: { name: string, avatar_url: string | null, verification_tier: number | null } }) => (
              <Link key={listing.id} href={`/listing/${listing.id}`}>
                <GlassCard animated className="h-full flex flex-col p-0 overflow-hidden bg-white/[0.02] border-white/5 group">
                  <div className="relative h-48 w-full bg-muted/20">
                    {listing.image_urls && listing.image_urls[0] ? (
                      <Image src={listing.image_urls[0]} alt={listing.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-accent/5">No Image</div>
                    )}
                    <div className="absolute top-3 left-3">
                      <CategoryBadge category={listing.category} className="bg-background/80 backdrop-blur-md" />
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">{listing.title}</h3>
                    </div>
                    <div className="mt-auto pt-2 flex items-center justify-between border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <UserAvatar url={listing.provider.avatar_url} name={listing.provider.name} className="h-6 w-6" />
                        <span className="text-sm font-medium text-muted-foreground truncate max-w-[100px]">{listing.provider.name}</span>
                        {listing.provider.verification_tier != null && listing.provider.verification_tier > 0 && <TrustBadge tier={listing.provider.verification_tier} className="px-1 py-0 h-4 border-none bg-transparent [&>svg]:w-3 [&>svg]:h-3" />}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${listing.price}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{listing.pricing_type}</div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-24 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center text-muted-foreground">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold">No listings found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
              <Link href="/browse">
                <Button variant="outline" className="mt-2">Clear Filters</Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
