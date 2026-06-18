# ERA Calculator Website

Static SEO site for `eracalculator.net`, focused on the keyword `era calculator` and related one-keyword-per-page search intents.

## Pages

- `/` - main ERA calculator and hub
- `/how-is-era-calculated/`
- `/era-calculation/`
- `/baseball-era-calculator/`
- `/era-calculator-7-innings/`
- `/softball-era-calculator/`
- `/pitching-era-calculator/`

## Local Preview

```bash
python3 -m http.server 8788
```

Open:

```text
http://localhost:8788
```

## Checks

```bash
node tools/check-site.mjs
```

## Cloudflare Pages Deploy

This project is ready for Cloudflare Pages as a static site. There is no build output directory because the HTML, CSS, and JS are served directly from the project root.

### Recommended: Deploy from GitHub

1. Push this folder to a GitHub repository.
2. In Cloudflare Pages, connect the repository.
3. Set build command to blank.
4. Set build output directory to `/`.
5. Set production branch to `main`.
6. Add the custom domain `eracalculator.net`.

After that, every push to `main` automatically deploys to Cloudflare Pages.

### Manual Deploy with Wrangler

Create a Cloudflare API token with Pages edit permissions, then run:

```bash
export CLOUDFLARE_API_TOKEN="your-token"
npx wrangler pages deploy . --project-name=era-calculator
```

After deployment, add the custom domain in Cloudflare Pages:

```text
eracalculator.net
```

Cloudflare will guide the DNS record creation. The `_redirects` file redirects `www.eracalculator.net` to the apex domain.

## SEO Included

- Unique title and meta description per keyword page
- Canonical URLs for `https://eracalculator.net`
- `sitemap.xml`
- `robots.txt`
- FAQ schema on every keyword page
- WebApplication schema on the homepage
- Internal links between calculator, calculation, baseball, 7-inning, softball, and pitching pages
