CREATE OR REPLACE FUNCTION get_org_role_for_user(org_id uuid, user_id uuid)
    RETURNS text
    AS $$
DECLARE
    ROLE TEXT;
BEGIN
    SELECT
        user_role INTO ROLE
    FROM
        orgs_users
    WHERE
        orgid = org_id
        AND userid = user_id;
    RETURN ROLE;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER;

