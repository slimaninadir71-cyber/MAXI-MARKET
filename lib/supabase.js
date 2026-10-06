import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost',
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'missing-key'
);

export async function getProducts({ featuredOnly = false } = {}) {
  let q = supabase.from('products').select('*').order('sort_order', { ascending: true }).order('id', { ascending: true });
  if (featuredOnly) q = q.eq('featured', true);
  const { data, error } = await q;
  if (error) { console.error(error.message); return []; }
  return data || [];
}

export async function getProduct(slug) {
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
  if (error) { console.error(error.message); return null; }
  return data;
}
