-- Enable UUID extension just in case (Supabase usually has this enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_layanan TEXT NOT NULL,
    deskripsi TEXT,
    harga_dasar INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    nama_customer TEXT NOT NULL,
    no_hp TEXT NOT NULL,
    alamat TEXT,
    deskripsi TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'survey', 'dikerjakan', 'selesai')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. order_photos table
CREATE TABLE order_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    url_foto TEXT NOT NULL,
    tipe TEXT CHECK (tipe IN ('referensi', 'progress')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. portfolios table
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul TEXT NOT NULL,
    url_foto TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- services: Public read access
CREATE POLICY "Services are viewable by everyone."
ON services FOR SELECT
TO public
USING (true);

-- portfolios: Public read access
CREATE POLICY "Portfolios are viewable by everyone."
ON portfolios FOR SELECT
TO public
USING (true);

-- orders: Public insert (for order form)
CREATE POLICY "Anyone can insert an order."
ON orders FOR INSERT
TO public
WITH CHECK (true);

-- orders: Authenticated users can read/update (admin)
CREATE POLICY "Admins can view and update orders."
ON orders FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- order_photos: Public insert (if customers upload photos during order)
CREATE POLICY "Anyone can insert order photos."
ON order_photos FOR INSERT
TO public
WITH CHECK (true);

-- order_photos: Authenticated users can read/update/delete (admin)
CREATE POLICY "Admins can manage order photos."
ON order_photos FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
