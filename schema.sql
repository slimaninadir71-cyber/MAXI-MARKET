-- MAXI MARKET : base de données complète
-- À coller dans Supabase > SQL Editor (nouveau projet), puis "Run". Une seule fois.

-- 1) Produits (des ensembles, avec tailles, couleurs et plusieurs photos)
create table if not exists public.products (
  id bigint generated always as identity primary key,
  slug text unique not null,
  name text not null,
  category text default 'Ensembles',
  price numeric(8,2) not null,
  compare_at_price numeric(8,2),
  description text,
  composition text,
  care text,
  sizes text[] not null default '{S,M,L,XL}',
  colors text[] not null default '{}',
  images text[] not null default '{/placeholder.svg}',
  featured boolean default false,
  in_stock boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);
alter table public.products enable row level security;
drop policy if exists "Lecture publique des produits" on public.products;
create policy "Lecture publique des produits" on public.products for select to anon using (true);

-- 2) Commandes
create sequence if not exists public.order_seq start 1;

create table if not exists public.orders (
  id bigint generated always as identity primary key,
  reference text unique default ('MM-' || lpad(nextval('public.order_seq')::text, 5, '0')),
  status text default 'nouvelle',
  tracking_number text,
  total_price numeric(8,2),
  admin_notes text,
  items jsonb,
  quantity int,
  full_name text, phone text, email text,
  address text, postal_code text, city text, notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.orders enable row level security;
-- Aucune lecture ni écriture directe pour le public : seule la fonction create_order() enregistre une commande.
drop policy if exists "Envoi de commande public" on public.orders;

create table if not exists public.order_events (
  id bigint generated always as identity primary key,
  order_id bigint references public.orders(id) on delete cascade,
  event text not null,
  created_at timestamptz default now()
);
alter table public.order_events enable row level security;

-- 3) Calcul du total côté serveur : le client ne peut jamais fixer son prix
create or replace function public.orders_before_insert() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_total numeric(10,2); v_clean jsonb;
begin
  new.status := 'nouvelle';
  new.tracking_number := null;
  new.admin_notes := null;

  if new.items is null or jsonb_typeof(new.items) <> 'array' or jsonb_array_length(new.items) = 0 then
    raise exception 'Commande vide';
  end if;

  select
    jsonb_agg(jsonb_build_object(
      'slug', p.slug, 'name', p.name, 'size', q.size, 'color', q.color,
      'unit_price', p.price, 'quantity', q.qty)),
    sum(p.price * q.qty)
  into v_clean, v_total
  from (
    select it->>'slug' as slug,
           nullif(trim(it->>'size'), '') as size,
           nullif(trim(it->>'color'), '') as color,
           greatest(least(coalesce((it->>'quantity')::int, 1), 20), 1) as qty
    from jsonb_array_elements(new.items) it
  ) q
  join public.products p on p.slug = q.slug and p.in_stock
  where q.size = any (p.sizes)
    and (coalesce(array_length(p.colors, 1), 0) = 0 or q.color = any (p.colors));

  if v_clean is null then
    raise exception 'Aucun article valide dans la commande (taille ou couleur manquante)';
  end if;

  new.items := v_clean;
  new.total_price := v_total;
  new.quantity := (select sum((x->>'quantity')::int) from jsonb_array_elements(v_clean) x);
  return new;
end $$;

drop trigger if exists orders_before_insert_trg on public.orders;
create trigger orders_before_insert_trg before insert on public.orders
  for each row execute function public.orders_before_insert();

create or replace function public.orders_after_insert() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.order_events(order_id, event) values (new.id, 'Commande reçue');
  return new;
end $$;
drop trigger if exists orders_after_insert_trg on public.orders;
create trigger orders_after_insert_trg after insert on public.orders
  for each row execute function public.orders_after_insert();

-- Suivi : chaque changement de statut est gardé dans l'historique
create or replace function public.orders_before_update() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if new.status is distinct from old.status then
    insert into public.order_events(order_id, event) values (new.id, 'Statut : ' || coalesce(new.status, ''));
  end if;
  if new.tracking_number is distinct from old.tracking_number and coalesce(new.tracking_number, '') <> '' then
    insert into public.order_events(order_id, event) values (new.id, 'Numéro de suivi : ' || new.tracking_number);
  end if;
  return new;
end $$;
drop trigger if exists orders_before_update_trg on public.orders;
create trigger orders_before_update_trg before update on public.orders
  for each row execute function public.orders_before_update();

-- 4) Fonction appelée par le site pour enregistrer une commande
create or replace function public.create_order(
  p_full_name text, p_phone text, p_email text, p_address text,
  p_postal_code text, p_city text, p_notes text, p_items jsonb
) returns text
language plpgsql security definer set search_path = public as $$
declare v_ref text;
begin
  if coalesce(trim(p_full_name), '') = '' or coalesce(trim(p_phone), '') = ''
     or coalesce(trim(p_email), '') = '' or coalesce(trim(p_address), '') = ''
     or coalesce(trim(p_postal_code), '') = '' or coalesce(trim(p_city), '') = '' then
    raise exception 'Champs obligatoires manquants';
  end if;

  insert into public.orders (full_name, phone, email, address, postal_code, city, notes, items)
  values (left(trim(p_full_name), 120), left(trim(p_phone), 40), left(trim(p_email), 160),
          left(trim(p_address), 200), left(trim(p_postal_code), 12), left(trim(p_city), 80),
          left(coalesce(p_notes, ''), 1000), p_items)
  returning reference into v_ref;

  return v_ref;
end $$;

revoke all on function public.create_order(text, text, text, text, text, text, text, jsonb) from public;
grant execute on function public.create_order(text, text, text, text, text, text, text, jsonb) to anon, authenticated;
