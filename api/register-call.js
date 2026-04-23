export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.RETELL_API_KEY;
  const AGENT_ID = process.env.RETELL_AGENT_ID;

  if (!API_KEY || !AGENT_ID) {
    return res.status(500).json({ error: 'Missing env vars' });
  }

  try {
    const response = await fetch('https://api.retell.ai/v1/calls', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent_id: AGENT_ID,
        call_type: "web"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: 'Retell API error', details: data });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
