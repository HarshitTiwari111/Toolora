# Toolora MCP: Claude Desktop se article draft banana

Is MCP server se Claude Desktop seedha Toolora.ai se jud jata hai. Claude research karta hai, article likhta hai, images banata hai aur article ko **Draft** me save karta hai. **Publish hamesha aap `/admin` se karte ho.** Yeh tools kabhi publish nahi kar sakte (PDF ka rule: human approval).

## Ek baar ka setup (ho chuka hai)

Config file: `C:\Users\window10\AppData\Local\Claude-Data\claude_pzs8sxrjxfjjc\claude_desktop_config.json`

```json
"mcpServers": {
  "toolora": {
    "command": "C:\\Program Files\\nodejs\\node.EXE",
    "args": ["D:/Toolora/toolora-mcp/index.mjs"],
    "env": {
      "TOOLORA_API_URL": "https://toolora-api.onrender.com",
      "TOOLORA_API_KEY": "<AUTOMATION_API_KEY from toolora-api/.env.production>",
      "TOOLORA_SITE_URL": "https://toolora-lake.vercel.app"
    }
  }
}
```

Purani config ka backup bhi usi folder me hai: `claude_desktop_config.json.backup-before-toolora`.

Packages install karne ke liye (sirf naye computer par): `cd D:\Toolora\toolora-mcp` aur phir `npm install`.

## Tools

| Tool | Kaam |
| --- | --- |
| `get_writing_guide` | Writing, SEO, interlinking aur image ke rules (har article se pehle) |
| `get_site_inventory` | Site ke saare live pages, taaki internal links sirf inhi par lagein |
| `find_products` / `create_product` | Product dhoondhna, ya naya product **draft** me banana |
| `save_source_fact` | Fact, official source URL aur check date save karna |
| `list_topics` / `create_topic` | Keyword queue dekhna aur naya topic jodna |
| `upload_image` | SVG ya local image upload karna (cover ke liye `convertToJpg`) |
| `check_article` | Words (700–1500), links, meta, H1, FAQ aur alt text ka check |
| `create_article_draft` | Check pass hone par draft save karna |
| `suggest_links` | Link suggestions (editor admin me approve karta hai) |

## Test

```bash
cd D:\Toolora\toolora-mcp
set TOOLORA_API_URL=https://toolora-api.onrender.com
set TOOLORA_API_KEY=...
node test.mjs          # read-only checks, production ke liye safe
node test.mjs --write  # test product/article bhi banata hai: sirf LOCAL API par chalayein
```
