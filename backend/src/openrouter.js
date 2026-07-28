const DEFAULT_REPLY =
  'Run a 45-minute deep work sprint, allow only deadline or calendar alerts, batch social apps into a summary, and take a 7-minute reset break after the block.';

export async function askFocusCoach(message) {
  if (!process.env.OPENROUTER_API_KEY) {
    return {
      reply: DEFAULT_REPLY,
      source: 'demo',
    };
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
      'X-Title': 'FocusAI',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are FocusAI, a concise student productivity coach. Give practical notification triage and focus-mode recommendations in 5 bullets or fewer.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter request failed with ${response.status}`);
  }

  const data = await response.json();
  return {
    reply: data.choices?.[0]?.message?.content || DEFAULT_REPLY,
    source: 'openrouter',
  };
}

