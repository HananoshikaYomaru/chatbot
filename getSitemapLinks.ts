type IOptions = {
  filterIndexes?: string;
};

const fetchSitemap = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (response.ok) {
    return await response.text();
  } else {
    throw new Error(`Failed to fetch ${url}`);
  }
};

const extractUrls = (xml: string): string[] => {
  const regex = /<loc>(.*?)<\/loc>/g;
  const urls: string[] = [];
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  return urls;
};

export const getSitemapLinks = async (
  url: string,
  options: IOptions = {}
): Promise<string[]> => {
  let indexes: string[] = [];
  let links: string[] = [];

  try {
    const sitemapData = await fetchSitemap(url);
    indexes = extractUrls(sitemapData);
  } catch (err) {
    console.error(err);
    return [];
  }

  if (indexes.length === 0 || !indexes[0].endsWith(".xml")) {
    return indexes;
  }

  const { filterIndexes } = options;
  if (filterIndexes) {
    indexes = indexes.filter((e) => e.includes(filterIndexes));
  }

  await Promise.all(
    indexes.map(async (index) => {
      try {
        const indexData = await fetchSitemap(index);
        const array = extractUrls(indexData);
        links.push(...array);
      } catch (err) {
        console.error(err);
      }
    })
  );

  return [...new Set(links)];
};
