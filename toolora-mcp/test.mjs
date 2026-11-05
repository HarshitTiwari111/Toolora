// End-to-end test: starts index.mjs exactly like Claude Desktop does (stdio) and calls every tool.
// Usage: TOOLORA_API_URL=... TOOLORA_API_KEY=... node test.mjs [--write]
// Without --write only read-only tools run (safe for production).
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const write = process.argv.includes("--write");
const transport = new StdioClientTransport({ command: process.execPath, args: [new URL("./index.mjs", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")], env: process.env });
const client = new Client({ name: "toolora-mcp-test", version: "1.0.0" });
await client.connect(transport);

let pass = 0, failCount = 0;
const ok = (c, m) => { c ? pass++ : failCount++; console.log(`${c ? "PASS" : "FAIL"}  ${m}`); };
const call = async (name, args = {}) => {
  const r = await client.callTool({ name, arguments: args });
  const text = r.content?.[0]?.text ?? "";
  let json; try { json = JSON.parse(text); } catch { json = text; }
  return { error: Boolean(r.isError), json, text };
};

const { tools } = await client.listTools();
ok(tools.length === 11, `tools listed: ${tools.map((t) => t.name).join(", ")}`);

const guide = await call("get_writing_guide");
ok(!guide.error && guide.text.includes("1,500"), "get_writing_guide returns the guide");

const inv = await call("get_site_inventory");
ok(!inv.error && inv.json.count > 20 && inv.json.items.some((i) => i.kind === "category"), `get_site_inventory: ${inv.json.count} pages incl. categories`);

const found = await call("find_products", { q: "Trello" });
ok(!found.error && found.json.items?.some((p) => p.slug === "trello"), "find_products finds Trello");

const badCheck = await call("check_article", {
  body: "<h1>x</h1><p>" + "word ".repeat(1600) + '<a href="/does-not-exist/">x</a></p>',
  metaTitle: "x".repeat(80),
});
const issues = badCheck.json.issues ?? [];
ok(!badCheck.error && !badCheck.json.ok, "check_article rejects a bad article");
ok(issues.some((i) => i.includes("max 1500")), "  flags >1,500 words");
ok(issues.some((i) => i.includes("does-not-exist")), "  flags broken internal link");
ok(issues.some((i) => i.includes("H1")), "  flags H1 in body");
ok(issues.some((i) => i.includes("Meta title")), "  flags long meta title");

const svgEvil = await call("upload_image", { filename: "mcp-test-evil", alt: "should be rejected by the API", svg: '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>' });
ok(svgEvil.error && /script/i.test(svgEvil.text), "upload_image blocks SVG with script");

if (write) {
  const day = new Date().toISOString().slice(0, 10);
  const prod = await call("create_product", {
    brandName: "MCP Test Tool", slug: "mcp-test-tool", productType: "ai", categories: ["writing"],
    shortDescription: "Temporary product created by the MCP test.", officialUrl: "https://example.com/", pricingModel: "free",
    platforms: ["web"], useCases: ["Testing"], lastVerifiedAt: day,
  });
  ok(!prod.error && prod.json.id, `create_product -> ${prod.json.duplicate ? "existing" : "new draft"} ${prod.json.id}`);

  const fact = await call("save_source_fact", { productSlug: "mcp-test-tool", fieldName: "free_plan", factValue: "Free test plan", sourceUrl: "https://example.com/pricing", checkedAt: day });
  ok(!fact.error, "save_source_fact");

  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#4f46e5"/><text x="80" y="200" font-size="90" fill="#fff" font-family="Arial">MCP test cover</text></svg>';
  const inline = await call("upload_image", { filename: "mcp-test-diagram", alt: "Test diagram uploaded by the MCP test", svg });
  ok(!inline.error && /^\/media\/[a-f0-9]{24}\/mcp-test-diagram\.svg$/.test(inline.json.url), `upload_image svg -> ${inline.json.url}`);
  const cover = await call("upload_image", { filename: "mcp-test-cover", alt: "Test cover uploaded by the MCP test", svg, convertToJpg: true });
  ok(!cover.error && /\.jpg$/.test(cover.json.url), `upload_image svg->jpg cover -> ${cover.json.url} (${cover.json.size} bytes)`);
  console.log(`URLS ${inline.json.url} ${cover.json.url}`);

  const topic = await call("create_topic", { primaryKeyword: "mcp test tool review", intent: "review", productType: "ai", brand: "MCP Test Tool" });
  ok(!topic.error && topic.json.topicKey, `create_topic -> ${topic.json.topicKey}`);

  const body =
    '<p class="lead">MCP Test Tool review: a temporary article created by the automated MCP test. ' + "Testing words here to reach the minimum length. ".repeat(100) + "</p>" +
    '<h2>What is MCP Test Tool?</h2><p>See our <a href="/ai-tools/writing/">AI writing tools</a> and <a href="/how-we-review/">review method</a>.</p>' +
    `<figure><img src="${inline.json.url}" alt="Test diagram uploaded by the MCP test" width="1600" height="900"><figcaption>Test.</figcaption></figure>`;
  const draft = await call("create_article_draft", {
    topicKey: topic.json.topicKey, title: "MCP Test Tool Review (automated test)", slug: "mcp-test-tool-review", articleType: "review",
    productType: "ai", category: "writing", productIds: [prod.json.id], body, excerpt: "Temporary MCP test article.",
    metaTitle: "MCP Test Tool Review", metaDescription: "MCP Test Tool review created by the automated MCP test to confirm that drafts, images, links and checks all work end to end.",
    disclosure: "Test article. No affiliate relationship.", coverImageUrl: cover.json.url, coverImageAlt: "Test cover uploaded by the MCP test",
    sources: [{ url: "https://example.com/pricing", title: "Example pricing", checkedAt: day }],
    faq: [{ question: "Is this a test?", answer: "Yes, created by the MCP test." }, { question: "Will it be published?", answer: "No, drafts are never published." }, { question: "Can I delete it?", answer: "Yes, the cleanup script removes it." }],
  });
  ok(!draft.error && (draft.json.saved || draft.json.duplicate) && draft.json.status === "draft", `create_article_draft -> status ${draft.json.status}, ${draft.json.wordCount} words`);
  if (draft.error || !draft.json.id) console.log(draft.text);
}

await client.close();
console.log(`\n${pass} passed, ${failCount} failed`);
process.exit(failCount ? 1 : 0);
