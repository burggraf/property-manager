import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing environment variables');
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get the Authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    // Verify the JWT token and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.split(' ')[1]);
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get the title from the request body
    const { title } = await req.json();

    // Insert new org
    const { data: orgData, error: orgError } = await supabase
      .from('orgs')
      .insert({ title })
      .select()
      .single();

    if (orgError) {
      console.error('Error creating org:', orgError);
      throw orgError;
    }

    // Insert new orgs_users row
    const { data: orgUserData, error: orgUserError } = await supabase
      .from('orgs_users')
      .insert({
        orgid: orgData.id,
        userid: user.id,
        user_role: 'Owner'
      })
      .select()
      .single();

    if (orgUserError) {
      console.error('Error creating org_user relationship:', orgUserError);
      throw orgUserError;
    }

    console.log('Org created:', orgData);
    console.log('Org-User relationship created:', orgUserData);

    return new Response(JSON.stringify({ org: orgData, org_user: orgUserData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: err.message === 'Unauthorized' ? 401 : 500,
    });
  }
});
