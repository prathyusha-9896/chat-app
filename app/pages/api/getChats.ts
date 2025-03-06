import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .or(`user1.eq.${userId},user2.eq.${userId}`);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
}
