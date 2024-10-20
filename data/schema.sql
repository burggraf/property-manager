

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."delete_org"("org_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Delete the organization and let cascading constraints handle related data
    DELETE FROM orgs
    WHERE id = org_id;
    -- If the deletion was successful, commit the transaction
    IF FOUND THEN
        RAISE NOTICE 'Organization with ID % has been deleted along with all related data.', org_id;
    ELSE
        RAISE EXCEPTION 'Organization with ID % not found.', org_id;
    END IF;
END;
$$;


ALTER FUNCTION "public"."delete_org"("org_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."delete_org"("org_id" "uuid") IS 'Deletes an organization and all its related data. This function should only be accessible to highly privileged roles.';



CREATE OR REPLACE FUNCTION "public"."get_org_role"("org_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    role TEXT;
BEGIN
    SELECT user_role INTO role
    FROM orgs_users
    WHERE orgid = org_id AND userid = auth.uid();

    RETURN role;
END;
$$;


ALTER FUNCTION "public"."get_org_role"("org_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_org_role_for_user"("org_id" "uuid", "user_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
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
$$;


ALTER FUNCTION "public"."get_org_role_for_user"("org_id" "uuid", "user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_backup_running"() RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM pg_ls_dir('.')
    WHERE pg_ls_dir = 'backup_label'
  );
END;
$$;


ALTER FUNCTION "public"."is_backup_running"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."contacts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "firstname" "text",
    "lastname" "text",
    "email" "text",
    "phone" "text",
    "authid" "uuid",
    "contact_type" "text",
    "notes" "text",
    "orgid" "uuid" NOT NULL
);


ALTER TABLE "public"."contacts" OWNER TO "postgres";


COMMENT ON TABLE "public"."contacts" IS 'List of Contacts (people)';



CREATE TABLE IF NOT EXISTS "public"."orgs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text" NOT NULL,
    "metadata" "jsonb"
);


ALTER TABLE "public"."orgs" OWNER TO "postgres";


COMMENT ON TABLE "public"."orgs" IS 'Organizations';



CREATE TABLE IF NOT EXISTS "public"."orgs_invites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "orgid" "uuid" NOT NULL,
    "owner" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "user_role" "text" NOT NULL,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '7 days'::interval) NOT NULL,
    "metadata" "jsonb"
);


ALTER TABLE "public"."orgs_invites" OWNER TO "postgres";


COMMENT ON TABLE "public"."orgs_invites" IS 'pending invitations to join an org';



CREATE TABLE IF NOT EXISTS "public"."orgs_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "orgid" "uuid" NOT NULL,
    "userid" "uuid" NOT NULL,
    "user_role" "text" NOT NULL
);


ALTER TABLE "public"."orgs_users" OWNER TO "postgres";


COMMENT ON TABLE "public"."orgs_users" IS 'Users belong to Orgs';



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orgs_invites"
    ADD CONSTRAINT "orgs_invites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orgs"
    ADD CONSTRAINT "orgs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orgs_users"
    ADD CONSTRAINT "orgs_users_pkey" PRIMARY KEY ("id");



CREATE INDEX "orgs_users_orgid_idx" ON "public"."orgs_users" USING "btree" ("orgid");



CREATE INDEX "orgs_users_userid_idx" ON "public"."orgs_users" USING "btree" ("userid");



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_authid_fkey" FOREIGN KEY ("authid") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_orgid_fkey" FOREIGN KEY ("orgid") REFERENCES "public"."orgs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orgs_invites"
    ADD CONSTRAINT "orgs_invites_orgid_fkey" FOREIGN KEY ("orgid") REFERENCES "public"."orgs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orgs_invites"
    ADD CONSTRAINT "orgs_invites_orgid_fkey1" FOREIGN KEY ("orgid") REFERENCES "public"."orgs"("id");



ALTER TABLE ONLY "public"."orgs_invites"
    ADD CONSTRAINT "orgs_invites_owner_fkey" FOREIGN KEY ("owner") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orgs_invites"
    ADD CONSTRAINT "orgs_invites_owner_fkey1" FOREIGN KEY ("owner") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."orgs_users"
    ADD CONSTRAINT "orgs_users_orgid_fkey" FOREIGN KEY ("orgid") REFERENCES "public"."orgs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orgs_users"
    ADD CONSTRAINT "orgs_users_userid_fkey" FOREIGN KEY ("userid") REFERENCES "auth"."users"("id");



CREATE POLICY "User must belong to org" ON "public"."contacts" TO "authenticated" USING ((( SELECT "public"."get_org_role"("contacts"."orgid") AS "get_org_role") IS NOT NULL)) WITH CHECK ((( SELECT "public"."get_org_role"("contacts"."orgid") AS "get_org_role") IS NOT NULL));



ALTER TABLE "public"."contacts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "org owners can create invites" ON "public"."orgs_invites" FOR INSERT TO "authenticated" WITH CHECK (((( SELECT "public"."get_org_role"("orgs_invites"."orgid") AS "get_org_role") = 'Owner'::"text") AND ("owner" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "org owners can updated policies they created" ON "public"."orgs_invites" FOR UPDATE TO "authenticated" USING (((( SELECT "public"."get_org_role"("orgs_invites"."orgid") AS "get_org_role") = 'Owner'::"text") AND ("owner" = ( SELECT "auth"."uid"() AS "uid")))) WITH CHECK (((( SELECT "public"."get_org_role"("orgs_invites"."orgid") AS "get_org_role") = 'Owner'::"text") AND ("owner" = ( SELECT "auth"."uid"() AS "uid"))));



ALTER TABLE "public"."orgs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orgs_invites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orgs_users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "owner or invitee can delete an invite" ON "public"."orgs_invites" FOR DELETE TO "authenticated" USING ((("owner" = ( SELECT "auth"."uid"() AS "uid")) OR ("email" = ( SELECT "auth"."email"() AS "uid"))));



CREATE POLICY "owner or invitee can view invite" ON "public"."orgs_invites" FOR SELECT TO "authenticated" USING ((("owner" = ( SELECT "auth"."uid"() AS "uid")) OR ("email" = ( SELECT "auth"."email"() AS "email"))));



CREATE POLICY "users can view orgs they belong to" ON "public"."orgs" FOR SELECT USING (("id" IN ( SELECT "orgs_users"."orgid"
   FROM "public"."orgs_users"
  WHERE ("orgs_users"."userid" = ( SELECT "auth"."uid"() AS "uid")))));



CREATE POLICY "users can view their own records" ON "public"."orgs_users" FOR SELECT USING (("userid" = "auth"."uid"()));



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_org"("org_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_org_role"("org_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_org_role"("org_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_org_role"("org_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_org_role_for_user"("org_id" "uuid", "user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_org_role_for_user"("org_id" "uuid", "user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_org_role_for_user"("org_id" "uuid", "user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_backup_running"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_backup_running"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_backup_running"() TO "service_role";



GRANT ALL ON TABLE "public"."contacts" TO "anon";
GRANT ALL ON TABLE "public"."contacts" TO "authenticated";
GRANT ALL ON TABLE "public"."contacts" TO "service_role";



GRANT ALL ON TABLE "public"."orgs" TO "anon";
GRANT ALL ON TABLE "public"."orgs" TO "authenticated";
GRANT ALL ON TABLE "public"."orgs" TO "service_role";



GRANT ALL ON TABLE "public"."orgs_invites" TO "anon";
GRANT ALL ON TABLE "public"."orgs_invites" TO "authenticated";
GRANT ALL ON TABLE "public"."orgs_invites" TO "service_role";



GRANT ALL ON TABLE "public"."orgs_users" TO "anon";
GRANT ALL ON TABLE "public"."orgs_users" TO "authenticated";
GRANT ALL ON TABLE "public"."orgs_users" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






RESET ALL;
