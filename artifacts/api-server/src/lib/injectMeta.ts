export interface MetaValues {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  jsonLd?: object | object[];
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function injectMeta(html: string, meta: MetaValues): string {
  const title = escapeHtml(meta.title);
  const desc = escapeHtml(meta.description);
  const ogTitle = escapeHtml(meta.ogTitle ?? meta.title);
  const ogDesc = escapeHtml(meta.ogDescription ?? meta.description);
  const ogImage = escapeHtml(meta.ogImage ?? "");
  const ogType = escapeHtml(meta.ogType ?? "website");
  const ogUrl = escapeHtml(meta.ogUrl ?? "");

  let result = html;

  result = result.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  result = result.replace(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${desc}" />`,
  );
  result = result.replace(
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${ogTitle}" />`,
  );
  result = result.replace(
    /<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${ogDesc}" />`,
  );
  result = result.replace(
    /<meta property="og:type"[^>]*>/,
    `<meta property="og:type" content="${ogType}" />`,
  );
  result = result.replace(
    /<meta property="og:image"[^>]*>/,
    `<meta property="og:image" content="${ogImage}" />`,
  );
  result = result.replace(
    /<meta property="og:url"[^>]*>/,
    `<meta property="og:url" content="${ogUrl}" />`,
  );

  if (meta.jsonLd) {
    const schemas = Array.isArray(meta.jsonLd) ? meta.jsonLd : [meta.jsonLd];
    const tags = schemas
      .map(
        (s) =>
          `  <script type="application/ld+json">${JSON.stringify(s).replace(/<\/script>/gi, "<\\/script>")}</script>`,
      )
      .join("\n");
    result = result.replace("</head>", `${tags}\n  </head>`);
  }

  return result;
}
