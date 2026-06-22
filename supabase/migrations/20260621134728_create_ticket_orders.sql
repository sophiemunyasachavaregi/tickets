
CREATE TABLE ticket_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Buyer Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  province TEXT,

  -- ARMY Membership
  army_membership_number TEXT,

  -- Event
  event_date TEXT NOT NULL,

  -- Ticket
  ticket_category TEXT NOT NULL,
  ticket_quantity INTEGER NOT NULL CHECK (ticket_quantity BETWEEN 1 AND 2),
  unit_price NUMERIC(10,2) NOT NULL,
  online_fee NUMERIC(10,2) NOT NULL DEFAULT 100,
  total_amount NUMERIC(10,2) NOT NULL,

  -- Payment
  payment_method TEXT NOT NULL CHECK (payment_method IN ('maya', 'gcash')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'cancelled')),

  -- Reference
  order_reference TEXT UNIQUE NOT NULL
);

ALTER TABLE ticket_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_ticket_orders" ON ticket_orders FOR INSERT
  TO anon WITH CHECK (true);

CREATE POLICY "select_own_order" ON ticket_orders FOR SELECT
  TO anon USING (true);
