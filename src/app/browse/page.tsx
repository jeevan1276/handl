import { createClient } from '@/lib/supabase/server'
import { CraftCard } from '@/components/shared/glass-card'
import { CategoryBadge } from '@/components/shared/category-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { TrustBadge } from '@/components/shared/trust-badge'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, X } from 'lucide-react'
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
                className="pl-9 bg-card border-border"
              />
            </div>
            {searchParams.category && <input type="hidden" name="category" value={searchParams.category} />}
            <Button type="submit">Search</Button>
          </form>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <Link href="/browse" className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${!searchParams.category ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted hover:bg-muted/80 text-foreground border border-border'}`}>
            All
          </Link>
          {CATEGORIES.map(cat => (
            <Link 
              key={cat} 
              href={`/browse?category=${cat}${searchParams.q ? `&q=${searchParams.q}` : ''}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${searchParams.category === cat ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted hover:bg-muted/80 text-foreground border border-border'}`}
            >
              {cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </Link>
          ))}
        </div>

        {/* Active Filters */}
        {(searchParams.q || searchParams.category) && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Filters:</span>
            {searchParams.q && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full border border-border">
                <span>"{searchParams.q}"</span>
                <button type="button" onClick={() => window.location.href = searchParams.category ? `/browse?category=${searchParams.category}` : '/browse'} className="hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {searchParams.category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full border border-border">
                <span>{searchParams.category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                <button type="button" onClick={() => window.location.href = searchParams.q ? `/browse?q=${searchParams.q}` : '/browse'} className="hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            <a href="/browse" className="text-primary hover:underline text-sm">Clear all</a>
          </div>
        )}

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings && listings.length > 0 ? (
            listings.map((listing: { id: string, title: string, category: string, price: number, pricing_type: string, image_urls: string[] | null, provider: { name: string, avatar_url: string | null, verification_tier: number | null } }) => (
              <Link key={listing.id} href={`/listing/${listing.id}`}>
                <CraftCard variant="default" interactive className="h-full flex flex-col p-0 overflow-hidden" padding="none">
                  <div className="relative h-48 w-full bg-muted">
                    {listing.image_urls && listing.image_urls[0] ? (
                      <Image src={listing.image_urls[0]} alt={listing.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <CategoryBadge category={listing.category} size="sm" variant="filled" />
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col gap-3">
                    <h3 className="font-semibold text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">{listing.title}</h3>
                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/50">
                      <div className="flex items-center gap-2 min-w-0">
                        <UserAvatar url={listing.provider.avatar_url} name={listing.provider.name} size="sm" />
                        <span className="text-sm font-medium text-muted-foreground truncate max-w-[120px]">{listing.provider.name}</span>
                        {listing.provider.verification_tier != null && listing.provider.verification_tier > 0 && <TrustBadge tier={listing.provider.verification_tier} size="sm" />}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg text-foreground">₹{listing.price}</div>
                        <div className="text-[10px] text-muted-foreground uppercase">{listing.pricing_type}</div>
                      </div>
                    </div>
                  </div>
                </CraftCard>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-24 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center text-muted-foreground">
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
