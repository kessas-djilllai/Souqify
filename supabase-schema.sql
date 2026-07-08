-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to recreate them cleanly (optional)
-- DROP TABLE IF EXISTS public.appearance, public.stores, public.users, public.subscription_plans, public.categories, public.products, public.orders, public.coupons, public.shipping_zones, public.settings, public.super_admins CASCADE;

-- Users Table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Subscription Plans Table
CREATE TABLE public.subscription_plans (
  id SERIAL PRIMARY KEY,
  plan_name TEXT NOT NULL,
  price REAL NOT NULL DEFAULT 0.00,
  duration_days INTEGER NOT NULL DEFAULT 30,
  max_subscribers INTEGER NOT NULL DEFAULT 0,
  products_limit INTEGER NOT NULL DEFAULT 50,
  orders_limit INTEGER NOT NULL DEFAULT 100,
  enable_notifications INTEGER DEFAULT 0,
  enable_slider INTEGER DEFAULT 0,
  custom_color INTEGER DEFAULT 0,
  cycle_count INTEGER DEFAULT 0,
  lock_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Default Plans
INSERT INTO public.subscription_plans (id, plan_name, price, duration_days, products_limit, orders_limit, enable_slider, custom_color) VALUES
(1, 'المجانية', 0.00, 7, 15, 50, 1, 0),
(2, 'الأساسية', 1500.00, 30, 50, 100, 1, 1);

-- Stores Table
CREATE TABLE public.stores (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  store_name TEXT NOT NULL,
  store_slug TEXT NOT NULL UNIQUE,
  plan_id INTEGER REFERENCES public.subscription_plans(id) DEFAULT 1,
  plan_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  used_free_trial INTEGER DEFAULT 0,
  last_seen_order_id INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Appearance Table
CREATE TABLE public.appearance (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  store_title TEXT DEFAULT 'متجر Traivo الرائع',
  items_per_page INTEGER DEFAULT 12,
  enable_cart INTEGER DEFAULT 1,
  show_coupon INTEGER DEFAULT 0,
  show_categories INTEGER NOT NULL DEFAULT 1,
  enable_contact INTEGER NOT NULL DEFAULT 1,
  store_phone TEXT DEFAULT NULL,
  main_logo TEXT DEFAULT '',
  font_family TEXT DEFAULT 'Cairo',
  primary_color TEXT DEFAULT '#007bff',
  store_image_1 TEXT DEFAULT NULL,
  store_image_2 TEXT DEFAULT NULL,
  store_image_3 TEXT DEFAULT NULL,
  store_image_4 TEXT DEFAULT NULL,
  about_links TEXT DEFAULT NULL,
  policy_links TEXT DEFAULT NULL,
  social_links TEXT DEFAULT NULL,
  enable_email_notif INTEGER NOT NULL DEFAULT 0,
  notification_email TEXT DEFAULT NULL,
  notification_app_password TEXT DEFAULT NULL,
  enable_slider INTEGER DEFAULT 1
);

-- Categories Table
CREATE TABLE public.categories (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  image_url TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(store_id, slug)
);

-- Products Table
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  short_title TEXT DEFAULT NULL,
  short_description TEXT DEFAULT NULL,
  slug TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  price REAL NOT NULL,
  old_price REAL DEFAULT 0.00,
  cost_price REAL DEFAULT 0.00,
  category_id INTEGER DEFAULT 0,
  is_landing_page INTEGER NOT NULL DEFAULT 0,
  landing_page_image TEXT DEFAULT NULL,
  image_url TEXT DEFAULT NULL,
  gallery_images TEXT DEFAULT NULL,
  variations TEXT DEFAULT NULL,
  offers TEXT DEFAULT NULL,
  visits_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Orders Table
CREATE TABLE public.orders (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  product_id INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  state TEXT NOT NULL,
  municipality TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  phone_status TEXT DEFAULT 'جديد',
  delivery_status TEXT DEFAULT 'قيد-التجهيز',
  quantity INTEGER DEFAULT 1,
  total_price REAL DEFAULT 0.00,
  cart_data TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Coupons Table
CREATE TABLE public.coupons (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  discount_value REAL NOT NULL,
  discount_type TEXT DEFAULT 'percent',
  expiry_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  usage_limit INTEGER DEFAULT 0,
  times_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Shipping Zones Table
CREATE TABLE public.shipping_zones (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  home_price REAL DEFAULT 0.00,
  desk_price REAL DEFAULT 0.00,
  municipalities TEXT DEFAULT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Settings Table
CREATE TABLE public.settings (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  setting_key TEXT NOT NULL,
  setting_value TEXT NOT NULL,
  UNIQUE(store_id, setting_key)
);

-- Disable Row Level Security (RLS) for testing purposes
-- Note: In production, you should enable RLS and set proper policies
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.appearance DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_zones DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;
