import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { groupId, senderId, messageText } = req.body;

  const { data, error } = await supabase
    .from('messages')
    .insert([{ group_id: groupId, sender_id: senderId, message_text: messageText, sent_at: new Date().toISOString() }]);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
}