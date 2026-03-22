import { NextResponse } from 'next/server'
import { getServerSupabase } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = getServerSupabase()
    const { data: categories, error } = await supabase
      .from('forum_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) throw error

    // Get post counts per category
    const { data: counts } = await supabase
      .from('forum_posts')
      .select('category_slug', { count: 'exact', head: true })
      .eq('is_deleted', false)

    const countMap: Record<string, number> = {}
    counts?.forEach((c: any) => {
      countMap[c.category_slug] = (countMap[c.category_slug] || 0) + 1
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
