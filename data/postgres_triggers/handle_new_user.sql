CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER
    AS $$
BEGIN
    INSERT INTO public.profiles(id, email)
        VALUES(NEW.id, NEW.email);
    RETURN NEW;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

