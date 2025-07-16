import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const clerkRes = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });
    if (!clerkRes.ok) throw new Error('Failed to fetch user');
    const data = await clerkRes.json();
    res.json({
      first_name: data.first_name,
      image_url: data.image_url,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
} 