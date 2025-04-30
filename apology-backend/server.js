import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate-apology', async (req, res) => {
  const { confession } = req.body;
  console.log('Recieved confession:', confession)

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in writing dramatic influencer style Youtube apology scripts. Format the output like a teleprompter, with short and speakable sentences. Add light emotional stage direction in parentheses like (deep breath), (voice crack), or (choking up) where appropriate. Do not include title cards, scene descriptions, or cinematic transitions. This is meant to be read aloud to a webcam, so keep it real but dramatic. And slightly humorous while maintaining the vibe of an influencer apology video.'
          },
          {
            role: 'user',
            content: `I did this: ${confession}`
          }
        ]
      })
    });

    const data = await response.json();
    console.log('OpenRouter response:', data)

    const apology = data.choices?.[0]?.message?.content;
    res.json({ apology: apology || "No apology returned." });
  } catch (err) {
    console.error('❌ Error calling OpenRouter:', err);
    res.status(500).json({ apology: 'Something went wrong. Please try again.' });
  }
});

app.listen(3000, () => {
  console.log('Backend running on port 3000');
});
