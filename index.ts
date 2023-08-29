import { getSitemapLinks } from "./getSitemapLinks";

async function fetchHTML(url: string): Promise<string> {
  const response = await fetch(url);
  const html = await response.text();
  return html;
}

const url =
  "https://yomaru.dev/400+Lifestyle/Christianity/%F0%9F%8E%B6+Worship+songs/Trust+in+God";

const fetchObsidian = async (url: string) => {
  const html = await fetchHTML(url);

  const regex = /window\.preloadPage=f\("([^"]+)"\)/;
  const match = html.match(regex);

  if (match && match.length > 1) {
    const preloadPageUrl = match[1];
    console.log("fetching ", preloadPageUrl, "...");
    const markdown = await fetchHTML(preloadPageUrl);
    return markdown;
  } else {
    console.log("Preload page URL not found");
  }
};

const runApp = async () => {
  // fetch all links from sitemap
  const links = await getSitemapLinks("https://yomaru.dev/sitemap.xml");

  // for each link, fetch the markdown
  const markdowns = await Promise.all(
    links.map(async (link) => {
      const markdown = await fetchObsidian(link);
      return markdown;
    })
  );

  // print the markdown
  console.log(markdowns);
};

runApp();
