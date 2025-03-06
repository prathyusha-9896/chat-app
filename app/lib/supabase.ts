import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabaseUrl = 'https://vrrfvovzjdjbtmaxhqqy.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;


export const supabase = createClient(supabaseUrl, supabaseKey);