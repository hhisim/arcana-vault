import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: categories, error } = await supabase
      .from('forum_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) throw error

    // Get post counts per category using raw SQL to avoid API complexity
    const { data: counts } = await supabase
      .from('forum_posts')
      .select('category_slug')

    const countMap: Record<string, number> = {}
    ;(counts || [])
      .filter((p: any) => !p.is_deleted)
      .forEach((p: any) => {
        countMap[p.category_slug] = (countMap[p.category_slug] || 0) + 1
      })

    const result = (categories || []).map((cat: any) => ({
      ...cat,
      post_count: countMap[cat.slug] || 0,
    }))

    return NextResponse.json(result)
  } catch (err) {
    console.error('[API forum/categories]', err)
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 })
  }
}
