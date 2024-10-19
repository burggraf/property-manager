import { createClient } from 'jsr:@supabase/supabase-js@2';

import { corsHeaders } from '../_shared/cors.ts';

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.split(' ')[1],
    );
    console.log('user', user);
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get the org_id and new title from the request body
    const { id, title } = await req.json();
    console.log('id', id);
    console.log('title', title);
    if (!id || !title) {
      throw new Error('Missing org_id or title');
    }

    // Check user's role in the org
    console.log('checking user_role for org_id', id);
    const { data: roleData, error: roleError } = await supabase
      .rpc('get_org_role_for_user', { org_id: id, user_id: user.id })
      .single();
    console.log('roleData, roleError', roleData, roleError);

    if (roleError) {
      console.error('Error checking user role:', roleError);
      throw roleError;
    }
    console.log('roleData', roleData);
    if (roleData !== 'Owner') {
      throw new Error('Unauthorized: User is not an Owner of this org');
    }

    // Update org title
    const { data: updatedOrg, error: updateError } = await supabase
      .from('orgs')
      .update({ title })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating org:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ org: updatedOrg }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (err) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: err.message.includes('Unauthorized') ? 401 : 500,
    });
  }
});
