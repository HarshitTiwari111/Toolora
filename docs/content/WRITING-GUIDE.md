# Toolora.ai writing guide (editors + AI drafting)

Every article on Toolora.ai follows these rules, whether a person writes it or the n8n/OpenAI workflow drafts it. The API enforces the hard limits: an article that breaks them **cannot be published**.

## Hard rules (publish gate)

| Rule | Limit |
| --- | --- |
| Body length | **Max 1,500 words** (aim for 1,100–1,400 words). The FAQ is separate. |
| Internal links | **At least 2** links to our own pages (`/ai-tools/...`, `/saas/...`, `/reviews/...` and so on) |
| Sources | At least 1 official source URL, each with a "checked on" date |
| Meta | Meta title (max 70 characters) and meta description (max 170 characters) |
| Disclosure | Required. State the affiliate relationship, or say there is none |
| Reviewer | A human editor's name before publishing |
| Cover image | If set, it must have alt text |

## Content rules (from the developer guide PDF)

- Use only facts from official or first-party sources. Never invent prices, features, limits, customer numbers or benchmarks. If a source is unclear or contradicts itself, say so in the article.
- Never claim hands-on testing unless the team really tested the tool. Label everything else **research-based** and give no score or star rating.
- Show the currency, plan name, billing period and check date for every price.
- Don't rewrite vendor copy. Add useful guidance: who the tool fits, who it doesn't, and what to check before buying.

## Sound like a person, not a template (unslop rules)

Readers and Google both notice when every page reads the same. Check each draft against this list before saving.

**Banned words and habits**
- No em dashes (—). Use a full stop, a comma or brackets.
- No stock AI phrases: "dive into", "delve", "in today's fast-paced world", "whether you're a … or a …", "look no further", "unlock", "elevate", "seamless", "robust", "game-changer", "cutting-edge", "navigate", "landscape", "leverage", "empower", "it's worth noting", "in conclusion".
- Don't repeat the site's promise ("sourced, dated, no fake scores") inside articles. The page template already says it once.
- No "On paper," and no rule-of-three lists written only for rhythm.

**Vary the shape**
- Don't copy another article's headings. Only "pricing", "free plan" and "pros and cons" sections are standard; name the rest after the real question ("Is Otter.ai worth paying for?", "Which Trello plan should you pick?").
- Open with the reader's situation or the tool's one-line job, not "X is a … tool that … This review covers …".
- Mix short and long sentences. Some paragraphs can be one line.
- End with a recommendation a reader can act on (which plan, for whom), not a summary of the article.

**Be specific**
- Prefer numbers and examples ("$8.33 a month instead of $16.99", "a rule that ticks the checklist when a card hits Done") over adjectives.
- Only claim what a source says. If you add a fact from memory (launch year, owner, user counts), find the source or delete it.

## SEO checklist

1. **Primary keyword** (for example "Otter.ai review") goes in the title, the first paragraph, at least one H2 and the meta title.
2. Use **secondary keywords** naturally in H2s, for example "Otter.ai pricing", "Otter.ai free plan" and "pros and cons".
3. Use one H1 only (the page title). The body uses H2 for sections and H3 for sub-points.
4. The meta description is 140–170 characters, includes the keyword and states the benefit to the reader.
5. Keep the slug short: `brand-review`, `brand-vs-brand` or `best-ai-writing-tools`.
6. Add an FAQ with 3–5 real questions people search for. FAQ answers are 1–3 sentences each.
7. Images must have descriptive alt text, with the keyword where it fits naturally.

## Interlinking

- Link to the **product profile** (`/ai-tools/{slug}/` or `/saas/{slug}/`) and its **category hub**.
- Link to **one or two related articles** where it helps the reader, for example from a meeting-notes tool to a task-board tool.
- Use descriptive anchor text ("our Trello review"), never "click here".
- Only link to pages that exist. The live inventory is at `GET /api/public/inventory`.

## Article structure (review)

1. Lead paragraph (`<p class="lead">`): what the tool is and what this review covers, with the check date.
2. Key takeaways (`<div class="tldr"><ul class="checks">…</ul></div>`): best for, free plan, paid plans and what to watch out for.
3. What is {tool}? This section can include a diagram image.
4. Key features (H3 per feature).
5. Pricing table (`<div class="table-wrap"><table>…</table></div>`) plus a warning callout for fine print.
6. Free plan: what you get and what its limits are.
7. Pros and cons (`<div class="pros-cons"><div class="pros">…</div><div class="cons">…</div></div>`).
8. Who should use it: lists with `class="checks"` for good fit and `class="crosses"` for look elsewhere.
9. Tips before you sign up (numbered list).
10. Verdict (`<div class="verdict"><p class="label">Our verdict</p>…</div>`) with internal links.

Allowed design classes: `lead`, `label`, `tldr`, `callout tip`, `callout warn`, `verdict`, `pros-cons`, `pros`, `cons`, `table-wrap`, `checks`, `crosses`, `wide`. Any other class is removed.

## Images

- Use one cover image at 1600×900 (JPG, under 150 KB) and 1–3 inline images (SVG diagrams or charts work well).
- Make original illustrations, diagrams or charts built from the sourced facts. **No vendor logos or screenshots** unless you have the rights.
- Store files in `toolora-web/public/images/articles/` and reference them as `/images/articles/name.ext`.
- Every image needs alt text and a caption that credits the source of any numbers.

## AI drafting prompt (n8n → OpenAI, replaces PDF Prompt 2)

```
You are a writer for Toolora.ai. Write an original, research-based article for [audience] about [topic]
using ONLY the approved brief and source records below.

Rules:
- Max 1,500 words of body (target 1,100–1,400). FAQ separate: 3–5 questions, 1–3 sentences each.
- Never add facts that are not in the sources. If sources conflict or are unclear, say so plainly.
- Follow the "Sound like a person" rules: no em dashes, none of the banned phrases, headings named after real
  questions, an opening about the reader's situation, and a closing recommendation (which plan, for whom).
- Do not claim hands-on testing. No scores or star ratings. Show currency, plan, billing period and
  "checked on [date]" for every price.
- SEO: put the primary keyword "[keyword]" in the first paragraph, one H2 and the meta title.
  Use secondary keywords [list] naturally in H2s. No H1 in the body.
- Interlinking: add at least 2 internal links, chosen ONLY from this site inventory: [inventory JSON].
  Use descriptive anchor text.
- Structure and HTML classes: follow the Toolora review structure (lead, tldr, features, pricing table in
  table-wrap, free plan, pros-cons, who should use it, tips, verdict). Use only the allowed classes.
- Images: suggest 1 cover idea and 1–2 diagram or chart ideas built from the facts, each with alt text.
  Do not use logos or screenshots.

Return JSON: { article_html, meta_title (<=70 chars), meta_description (<=170 chars), excerpt,
faq[{question, answer}], internal_links_used[], image_ideas[{type, description, alt}], word_count,
claims_needing_review[] }
```
