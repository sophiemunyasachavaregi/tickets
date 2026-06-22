CREATE TABLE ticket_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_date TEXT NOT NULL,
  ticket_category TEXT NOT NULL,
  total_quantity INTEGER NOT NULL,
  sold_quantity INTEGER NOT NULL DEFAULT 0,
  UNIQUE(event_date, ticket_category)
);

ALTER TABLE ticket_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_inventory" ON ticket_inventory FOR SELECT TO anon USING (true);

-- Seed inventory data
-- Mar 13 (Sat): 45 tickets — 10 soundcheck, 15 bleachers1, 20 bleachers2
INSERT INTO ticket_inventory (event_date, ticket_category, total_quantity) VALUES
  ('13 Mar 2027 (Sat.)', 'VIP SOUNDCHECK',  10),
  ('13 Mar 2027 (Sat.)', 'BLEACHERS 1',     15),
  ('13 Mar 2027 (Sat.)', 'BLEACHERS 2',     20),
  -- Mar 14 (Sun): 22 tickets — split 11 bleachers1, 11 bleachers2
  ('14 Mar 2027 (Sun.)', 'BLEACHERS 1',     11),
  ('14 Mar 2027 (Sun.)', 'BLEACHERS 2',     11),
  -- Mar 16 (Tue): 1000 tickets
  ('16 Mar 2027 (Tue.)', 'VIP SOUNDCHECK',   100),
  ('16 Mar 2027 (Tue.)', 'FLOOR STANDING',   120),
  ('16 Mar 2027 (Tue.)', 'BLEACHERS 1',      400),
  ('16 Mar 2027 (Tue.)', 'BLEACHERS 2',      380);
