/** 네이버 블로그 RSS 등 공개 텍스트 수집 */

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function naverBlogId(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("blog.naver.com")) return null;
    const id = u.pathname.split("/").filter(Boolean)[0];
    return id || null;
  } catch {
    return null;
  }
}

export async function fetchBlogSummary(blogUrl: string): Promise<string> {
  const blogId = naverBlogId(blogUrl);
  if (!blogId) {
    const res = await fetch(blogUrl, {
      headers: { "User-Agent": "HelloMusicAcademy/1.0" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`fetch failed ${res.status}`);
    const html = await res.text();
    return stripHtml(html).slice(0, 8000);
  }

  const rssUrl = `https://rss.blog.naver.com/${blogId}.xml`;
  const res = await fetch(rssUrl, {
    headers: { "User-Agent": "HelloMusicAcademy/1.0" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`rss failed ${res.status}`);
  const xml = await res.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0, 8);
  const chunks = items.map((m) => {
    const block = m[1];
    const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
      || block.match(/<title>(.*?)<\/title>/)?.[1]
      || "";
    const desc = block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1]
      || block.match(/<description>([\s\S]*?)<\/description>/)?.[1]
      || "";
    return `· ${stripHtml(title)}\n  ${stripHtml(desc).slice(0, 400)}`;
  });
  return chunks.join("\n\n") || stripHtml(xml).slice(0, 4000);
}
