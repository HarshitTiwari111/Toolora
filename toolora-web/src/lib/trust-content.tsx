import Link from "next/link";

// Trust pages ka content PDF ke editorial rules (section 4, 7, 8) se banaya gaya hai.
// Launch se pehle owner review kare. Privacy / Terms / Contact owner aur legal input ke baad likhe jaayenge.

export type TrustContent = { description: string; body: React.ReactNode };

export const trustContent: Record<string, TrustContent> = {
  about: {
    description: "Toolora.ai helps people find, compare and understand AI tools and SaaS products using dated, sourced facts.",
    body: (
      <>
        <p>
          Toolora.ai is an editorial site for discovering AI tools and business software. We publish product profiles,
          reviews, head-to-head comparisons, alternatives and practical guides, so you can decide which tool fits your
          work, and which one doesn&apos;t.
        </p>
        <h2>What makes our pages different</h2>
        <ul>
          <li>Pricing and feature claims link to the vendor&apos;s official source.</li>
          <li>Every fact shows the date we last checked it, and pages are queued for regular refreshes.</li>
          <li>We say clearly when a page is research-based rather than hands-on tested.</li>
          <li>A human editor reviews every page before it is published.</li>
        </ul>
        <h2>How we are funded</h2>
        <p>
          Some links on Toolora.ai are affiliate links. If you buy through them we may earn a commission, at no extra
          cost to you. This never changes the facts we report. Read our <Link href="/affiliate-disclosure/">affiliate disclosure</Link>.
        </p>
      </>
    ),
  },

  "editorial-policy": {
    description: "The rules every Toolora.ai page follows: sourced facts, clear methods, human review and no invented claims.",
    body: (
      <>
        <h2>Sources</h2>
        <p>
          Product facts (pricing, plans, features, platforms and availability) come from the vendor&apos;s own pages,
          documentation, pricing page or changelog. We store the source URL and the date we checked it. If we cannot find
          a source, we leave the claim out or mark it for verification.
        </p>
        <h2>What we never do</h2>
        <ul>
          <li>Invent pricing, features, benchmarks, customer counts or security claims.</li>
          <li>Claim hands-on testing we did not do, or assign experience-based ratings without testing.</li>
          <li>Publish fake star ratings or mark up ratings we do not have.</li>
          <li>Copy or lightly rewrite vendor marketing or other reviews.</li>
        </ul>
        <h2>Use of AI</h2>
        <p>
          We may use AI tools to help organise research and draft structure. Every draft is checked against its sources and
          approved by a human editor before it is published. Nothing is published automatically.
        </p>
        <h2>Independence</h2>
        <p>
          Affiliate relationships are disclosed on the page. Payment does not change factual claims, and our selection
          criteria are explained in each article.
        </p>
        <h2>Updates</h2>
        <p>
          Pricing and time-sensitive details are re-checked on a regular schedule. If a source is no longer reachable, the
          fact is flagged for an editor rather than silently kept. See <Link href="/corrections/">corrections</Link>.
        </p>
      </>
    ),
  },

  "how-we-review": {
    description: "How Toolora.ai researches, checks and publishes reviews, comparisons and product profiles.",
    body: (
      <>
        <h2>1. Choose the topic</h2>
        <p>We pick topics readers actually search for and group similar questions into one strong page instead of many thin ones.</p>
        <h2>2. Collect first-party sources</h2>
        <p>We read the vendor&apos;s official pricing, documentation and changelog, and record each fact with its URL and check date.</p>
        <h2>3. Draft with clear criteria</h2>
        <p>
          Each article explains who the tool fits and who it may not fit, what it does, features checked against official
          sources, pricing with a &ldquo;checked on&rdquo; date, pros and limitations, and alternatives.
        </p>
        <h2>4. Quality checks</h2>
        <p>Before publishing we check that every claim maps to a source, dates are present, links work and the disclosure is shown.</p>
        <h2>5. Editor approval</h2>
        <p>A named editor reviews and approves every page. Their name appears on the article as &ldquo;Reviewed by&rdquo;.</p>
        <h2>Research-based vs hands-on</h2>
        <p>
          Most pages are <strong>research-based overviews</strong> built from official sources. We only label a page
          <strong> hands-on tested</strong> when our team actually used the product, and we never assign ratings without testing.
        </p>
      </>
    ),
  },

  "affiliate-disclosure": {
    description: "How Toolora.ai earns money and how affiliate links are marked.",
    body: (
      <>
        <p>
          Toolora.ai is reader-supported. Some links to products on this site are affiliate links: if you click one and buy
          something, we may earn a commission. You don&apos;t pay anything extra.
        </p>
        <h2>How we mark affiliate links</h2>
        <ul>
          <li>Pages with affiliate links show a disclosure near the top.</li>
          <li>&ldquo;Visit&rdquo; buttons that are affiliate links are labelled, and marked as sponsored for search engines.</li>
          <li>Citation links to sources are kept separate from affiliate links.</li>
        </ul>
        <h2>What affiliate relationships don&apos;t change</h2>
        <p>
          Commissions never change the facts we report or the limitations we describe. Being listed on Toolora.ai is not an
          endorsement by the vendor unless we say so explicitly.
        </p>
      </>
    ),
  },

  corrections: {
    description: "How to report an error on Toolora.ai and how we handle corrections.",
    body: (
      <>
        <p>
          We work to keep every fact accurate and dated, but products change quickly. If you spot something wrong or out
          of date, such as a price, a feature or a broken link, please tell us.
        </p>
        <h2>What happens next</h2>
        <ul>
          <li>An editor re-checks the claim against the official source.</li>
          <li>If it is wrong, we fix it and update the page&apos;s &ldquo;updated&rdquo; date.</li>
          <li>Significant corrections are noted on the page.</li>
        </ul>
        <p>Use the contact details on our <Link href="/contact/">contact page</Link> to report a correction.</p>
      </>
    ),
  },
};

// In pages ka text owner/legal input ke bina nahi likha ja sakta.
export const ownerRequiredPages = ["privacy-policy", "terms", "contact"];
