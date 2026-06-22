CREATE OR REPLACE FUNCTION decrement_inventory(
  p_event_date TEXT,
  p_ticket_category TEXT,
  p_quantity INTEGER
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE ticket_inventory
  SET sold_quantity = sold_quantity + p_quantity
  WHERE event_date = p_event_date
    AND ticket_category = p_ticket_category
    AND (total_quantity - sold_quantity) >= p_quantity;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Not enough tickets available';
  END IF;
END;
$$;
