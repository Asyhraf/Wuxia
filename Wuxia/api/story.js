export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { input } = req.body;
  if (!input || typeof input !== 'string') return res.status(400).json({ error: 'Invalid input' });
  try {
    const prompt = `You are the narrator of a never-ending wuxia fantasy RPG. Player action: "${input}"\nRespond in JSON format.`;
    const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
        max_tokens: 1000
      })
    });
    const result = await openrouterResponse.json();
    const message = result.choices?.[0]?.message?.content;
    if (!message) return res.status(502).json({ error: 'Invalid response from OpenRouter' });
    return res.status(200).json(JSON.parse(message));
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}