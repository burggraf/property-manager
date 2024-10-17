CREATE OR REPLACE FUNCTION get_org_role(org_id UUID)
RETURNS TEXT AS $$
DECLARE
    role TEXT;
BEGIN
    SELECT user_role INTO role
    FROM orgs_users
    WHERE orgid = org_id AND userid = auth.uid();

    RETURN role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

