export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const url = `https://www.ibiza-spotlight.com/night/events/${year}/${String(month).padStart(2,'0')}`;
    
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await r.text();

    const clubs = ['Hï Ibiza','Ushuaïa','Amnesia','Pacha','Chinois','[UNVRS]'];
    const results = [];

    clubs.forEach(club => {
      const escaped = club.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped + '[\\s\\S]{0,500}?From (\\d+)\\d+€', 'i');
      const match = html.match(regex);
      results.push({
        name: club,
        price: match ? parseInt(match[1]) : null,
        updated: today.toISOString()
      });
    });

    res.status(200).json({ clubs: results, updated: today.toISOString() });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
