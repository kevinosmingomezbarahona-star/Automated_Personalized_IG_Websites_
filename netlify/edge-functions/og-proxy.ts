import type { Config, Context } from "@netlify/edge-functions";

// ── Bot detection ────────────────────────────────────────────────────────────
// Netlify sets `netlify-agent-category` for known crawlers: 'social', 'crawler'
const BOT_CATEGORIES = ["social", "crawler"];

// UA fallback for environments where `netlify-agent-category` may not be set
const BOT_UA_PATTERNS = [
    "facebookexternalhit",
    "facebookscraper",
    "twitterbot",
    "linkedinbot",
    "whatsapp",
    "slackbot",
    "telegrambot",
    "discordbot",
    "applebot",
    "googlebot",
    "bingbot",
    "ia_archiver",
];

function isBot(request: Request): boolean {
    // Primary: Netlify's built-in agent category header
    const agentCategory = request.headers.get("netlify-agent-category")?.toLowerCase() ?? "";
    if (BOT_CATEGORIES.some((cat) => agentCategory.includes(cat))) return true;

    // Fallback: raw User-Agent string matching
    const ua = request.headers.get("user-agent")?.toLowerCase() ?? "";
    return BOT_UA_PATTERNS.some((pattern) => ua.includes(pattern));
}

// ── HTML escaping ────────────────────────────────────────────────────────────
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// ── Edge Function handler ────────────────────────────────────────────────────
export default async function handler(request: Request, context: Context) {
    // Only intercept bots — real users get the normal SPA
    if (!isBot(request)) {
        return context.next();
    }

    // Extract slug from /p/:slug
    const url = new URL(request.url);
    const slug = url.pathname.replace(/^\/p\//, "").split("/")[0];

    if (!slug) {
        return context.next();
    }

    // ── Fetch prospect data from Supabase ────────────────────────────────────
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

    let fullName = "CelestIA Demo";
    let description = "Your private AI-powered demo experience, built by CelestIA.";
    let ogImage = "";

    if (supabaseUrl && supabaseKey) {
        try {
            const query = new URL(
                `${supabaseUrl}/rest/v1/prospects`
            );
            query.searchParams.set("slug", `eq.${slug}`);
            query.searchParams.set(
                "select",
                "full_name,business_summary,profile_pic_url,site_screenshot_url"
            );
            query.searchParams.set("limit", "1");

            const res = await fetch(query.toString(), {
                headers: {
                    apikey: supabaseKey,
                    Authorization: `Bearer ${supabaseKey}`,
                    Accept: "application/json",
                },
            });

            if (res.ok) {
                const rows: Array<{
                    full_name?: string;
                    business_summary?: string;
                    profile_pic_url?: string;
                    site_screenshot_url?: string;
                }> = await res.json();

                const prospect = rows[0];
                if (prospect) {
                    // Text metadata
                    if (prospect.full_name?.trim()) {
                        fullName = prospect.full_name.trim();
                    }
                    if (prospect.business_summary?.trim()) {
                        description = prospect.business_summary.trim();
                    }

                    // Image waterfall: site_screenshot_url → profile_pic_url
                    const clean = (u?: string | null) => (u ?? "").replace(/^=+/, "").trim();
                    ogImage = clean(prospect.site_screenshot_url) || clean(prospect.profile_pic_url);
                }
            }
        } catch (err) {
            console.error("[og-proxy] Supabase fetch error:", err);
            // Graceful degradation: use default values set above
        }
    }

    // ── Build metadata strings ────────────────────────────────────────────────
    const title = escapeHtml(`${fullName} x CelestIA | Private Demo`);
    const safeDesc = escapeHtml(description);
    const safeImage = escapeHtml(ogImage);
    const pageUrl = escapeHtml(url.toString());

    // ── Fetch the SPA shell and inject meta tags ──────────────────────────────
    const spaResponse = await context.next();
    const originalHtml = await spaResponse.text();

    // Build the block of meta tags to inject just before </head>
    const metaBlock = `
  <!-- og-proxy: dynamic meta injected by Netlify Edge Function -->
  <title>${title}</title>
  <meta name="description" content="${safeDesc}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${safeDesc}" />${safeImage ? `\n  <meta property="og:image" content="${safeImage}" />` : ""
        }
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${pageUrl}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${safeDesc}" />${safeImage ? `\n  <meta name="twitter:image" content="${safeImage}" />` : ""
        }
  <!-- /og-proxy -->`;

    // Replace placeholder tags from index.html with the injected dynamic ones
    // We wipe out the static fallback OG tags first, then inject our dynamic block
    const patchedHtml = originalHtml
        // Remove the static fallback og:title / twitter:title planted in index.html
        .replace(/<title>[^<]*<\/title>/i, "")
        .replace(/<meta\s[^>]*property="og:[^"]*"[^>]*\/>/gi, "")
        .replace(/<meta\s[^>]*name="twitter:[^"]*"[^>]*\/>/gi, "")
        .replace(/<meta\s[^>]*name="description"[^>]*\/>/gi, "")
        // Inject dynamic block right before </head>
        .replace("</head>", `${metaBlock}\n</head>`);

    return new Response(patchedHtml, {
        status: spaResponse.status,
        headers: {
            "content-type": "text/html; charset=utf-8",
            // Allow crawlers to cache the response briefly (5 minutes)
            "cache-control": "public, max-age=300, s-maxage=300",
        },
    });
}

// Netlify Edge Function config — this handles routing declaration
// (netlify.toml also declares this path as a belt-and-suspenders approach)
export const config: Config = {
    path: "/p/*",
};
