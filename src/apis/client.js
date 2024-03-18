import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.SUPABASE_PUBLIC_URL;
// const supabaseKey = process.env.SUPABASE_PUBLIC_KEY;
const supabaseUrl = 'https://pgcciqaasgkwyilevxxj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnY2NpcWFhc2drd3lpbGV2eHhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM2NTY3OTUsImV4cCI6MjAxOTIzMjc5NX0.-Av7ZBMBaXUMNK22-1fuHgFRGfA7p_cj8gPW98e3tVc'
console.log(supabaseUrl, supabaseKey)
const supabase = createClient(
    supabaseUrl,
    supabaseKey
)

export default supabase