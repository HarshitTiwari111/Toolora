"""Generate original article illustrations (no logos) for Toolora launch articles.
Writes SVGs into toolora-web/public/images/articles/. Covers are also written as
standalone HTML so headless Chrome can rasterize them to PNG (social share needs PNG)."""
import os, sys

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
FONT = "Inter, 'Segoe UI', Roboto, Arial, sans-serif"
SERIF = "Georgia, 'Times New Roman', serif"
INK = "#121420"; INDIGO = "#4f46e5"; VIOLET = "#7c3aed"; AMBER = "#f5b83d"; MUTED = "#5a6070"; LINE = "#e6e2d8"


def defs():
    return f"""<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#121420"/><stop offset=".6" stop-color="#1b1e2d"/><stop offset="1" stop-color="#2b2163"/></linearGradient>
  <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{INDIGO}"/><stop offset="1" stop-color="{VIOLET}"/></linearGradient>
  <linearGradient id="amber" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fde68a"/><stop offset="1" stop-color="#f59e0b"/></linearGradient>
  <radialGradient id="glow" cx=".8" cy=".2" r=".7"><stop offset="0" stop-color="{VIOLET}" stop-opacity=".45"/><stop offset="1" stop-color="{VIOLET}" stop-opacity="0"/></radialGradient>
  <filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000" flood-opacity=".35"/></filter>
  <filter id="sh2" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#10121e" flood-opacity=".12"/></filter>
</defs>"""


def dots(w, h, step=36, op=.07):
    out = []
    for y in range(18, h, step):
        for x in range(18, w, step):
            out.append(f'<circle cx="{x}" cy="{y}" r="1.6"/>')
    return f'<g fill="#fff" opacity="{op}">{"".join(out)}</g>'


def spark(cx, cy, r, fill="url(#amber)"):
    return (f'<path d="M{cx} {cy-r}Q{cx+r*.1} {cy-r*.1} {cx+r} {cy}Q{cx+r*.1} {cy+r*.1} {cx} {cy+r}'
            f'Q{cx-r*.1} {cy+r*.1} {cx-r} {cy}Q{cx-r*.1} {cy-r*.1} {cx} {cy-r}Z" fill="{fill}"/>')


def save(name, svg):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        f.write(svg)


def cover_html(name, svg):
    html = f"<!doctype html><html><body style='margin:0;background:{INK}'>{svg}</body></html>"
    with open(os.path.join(OUT, "_" + name + ".html"), "w", encoding="utf-8") as f:
        f.write(html)


# ---------------------------------------------------------------- Otter cover
def otter_cover():
    W, H = 1600, 900
    tiles = ""
    people = [("#a5b4fc", "#4338ca"), ("#fcd34d", "#b45309"), ("#86efac", "#15803d"), ("#f9a8d4", "#be185d")]
    for i, (c1, c2) in enumerate(people):
        x = 150 + (i % 2) * 250; y = 330 + (i // 2) * 170
        tiles += f'''<rect x="{x}" y="{y}" width="230" height="150" rx="16" fill="#262a3d"/>
  <circle cx="{x+115}" cy="{y+62}" r="30" fill="{c1}"/><path d="M{x+60} {y+150}a55 46 0 0 1 110 0z" fill="{c1}" opacity=".85"/>
  <rect x="{x+12}" y="{y+118}" width="70" height="20" rx="10" fill="#00000055"/><rect x="{x+22}" y="{y+126}" width="46" height="5" rx="2.5" fill="#fff" opacity=".7"/>'''
        if i == 1:
            tiles += f'<rect x="{x}" y="{y}" width="230" height="150" rx="16" fill="none" stroke="{AMBER}" stroke-width="4"/>'
    wave = "".join(
        f'<rect x="{150+i*16}" y="{690-h/2}" width="8" height="{h}" rx="4" fill="url(#brand)"/>'
        for i, h in enumerate([18, 34, 52, 30, 64, 40, 22, 48, 70, 36, 20, 44, 60, 28, 16, 38, 56, 30, 24, 46, 62, 34, 18, 30, 50, 26, 14, 32, 22])
    )
    lines = "".join(f'<rect x="980" y="{y}" width="{w}" height="12" rx="6" fill="#d6d9e6"/>' for y, w in [(470, 360), (496, 320), (522, 380), (548, 300)])
    items = ""
    for j, (y, w) in enumerate([(640, 300), (684, 340), (728, 260)]):
        done = j == 0
        items += (f'<rect x="980" y="{y-14}" width="28" height="28" rx="8" fill="{"#16a34a" if done else "#fff"}" stroke="{"#16a34a" if done else "#c7cbe0"}" stroke-width="2.5"/>'
                  + ('<path d="M987 {0}l6 6 12-13" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'.format(y) if done else "")
                  + f'<rect x="1024" y="{y-6}" width="{w}" height="12" rx="6" fill="#d6d9e6"/>')
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">{defs()}
<rect width="{W}" height="{H}" fill="url(#bg)"/><rect width="{W}" height="{H}" fill="url(#glow)"/>{dots(W, H)}
<text x="120" y="150" font-family="{FONT}" font-size="26" font-weight="800" letter-spacing="5" fill="{AMBER}">AI MEETING ASSISTANT · REVIEW 2026</text>
<text x="120" y="232" font-family="{SERIF}" font-size="78" font-weight="700" fill="#fff">Otter.ai, explained</text>
<g filter="url(#sh)"><rect x="120" y="290" width="560" height="470" rx="26" fill="#1d2030" stroke="#33374d"/>
  <circle cx="152" cy="312" r="6" fill="#f87171"/><circle cx="172" cy="312" r="6" fill="#fbbf24"/><circle cx="192" cy="312" r="6" fill="#4ade80"/>
  {tiles}{wave}
  <rect x="610" y="672" width="44" height="36" rx="10" fill="#dc2626"/><circle cx="632" cy="690" r="7" fill="#fff"/></g>
<g fill="none" stroke="{AMBER}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".95"><path d="M720 525h150"/><path d="M845 500l28 25-28 25"/></g>
{spark(795, 470, 22)}
<g filter="url(#sh)"><rect x="930" y="300" width="520" height="500" rx="26" fill="#fff"/>
  <rect x="930" y="300" width="520" height="90" rx="26" fill="url(#brand)"/><rect x="930" y="360" width="520" height="30" fill="url(#brand)"/>
  <text x="980" y="358" font-family="{FONT}" font-size="30" font-weight="800" fill="#fff">Meeting summary</text>
  {spark(1395, 345, 16, "#fde68a")}
  <text x="980" y="440" font-family="{FONT}" font-size="20" font-weight="800" letter-spacing="2" fill="{INDIGO}">KEY POINTS</text>{lines}
  <text x="980" y="606" font-family="{FONT}" font-size="20" font-weight="800" letter-spacing="2" fill="{INDIGO}">ACTION ITEMS</text>{items}</g>
</svg>'''
    save("otter-ai-review-cover.svg", svg); cover_html("otter-ai-review-cover", svg)


# --------------------------------------------------------- Otter workflow
def otter_workflow():
    W, H = 1200, 520
    steps = [
        ("1", "Join the meeting", "Zoom, Microsoft Teams or Google Meet, or record on desktop"),
        ("2", "Live transcript", "Speaker-labelled text appears while people talk"),
        ("3", "AI summary", "Decisions, key points and an outline after the call"),
        ("4", "Action items", "Next steps captured; AI Chat answers questions later"),
    ]
    icons = [
        '<rect x="-26" y="-18" width="40" height="36" rx="8" fill="none" stroke="#fff" stroke-width="5"/><path d="M14 -8l16-10v36l-16-10z" fill="#fff"/>',
        '<g stroke="#fff" stroke-width="5" stroke-linecap="round"><path d="M-24 -14h48M-24 0h36M-24 14h44"/></g>',
        '<rect x="-20" y="-24" width="40" height="48" rx="7" fill="none" stroke="#fff" stroke-width="5"/><g stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M-10 -10h20M-10 2h20M-10 14h12"/></g>',
        '<path d="M-20 0l12 12 26-28" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>',
    ]
    cards = ""
    for i, (n, t, d) in enumerate(steps):
        x = 40 + i * 290
        words = d.split(); l1, l2 = [], []
        for w in words:
            (l1 if len(" ".join(l1 + [w])) <= 26 and not l2 else l2).append(w)
        l3 = []
        while len(" ".join(l2)) > 28:
            l3.insert(0, l2.pop())
        cards += f'''<g filter="url(#sh2)"><rect x="{x}" y="150" width="250" height="300" rx="22" fill="#fff" stroke="{LINE}"/></g>
<circle cx="{x+125}" cy="235" r="48" fill="url(#brand)"/><g transform="translate({x+125} 235)">{icons[i]}</g>
<text x="{x+24}" y="182" font-family="{FONT}" font-size="15" font-weight="800" letter-spacing="2" fill="{MUTED}">STEP {n}</text>
<text x="{x+125}" y="330" text-anchor="middle" font-family="{FONT}" font-size="22" font-weight="800" fill="{INK}">{t}</text>
<text x="{x+125}" y="368" text-anchor="middle" font-family="{FONT}" font-size="16" fill="{MUTED}">{" ".join(l1)}</text>
<text x="{x+125}" y="392" text-anchor="middle" font-family="{FONT}" font-size="16" fill="{MUTED}">{" ".join(l2)}</text>
<text x="{x+125}" y="416" text-anchor="middle" font-family="{FONT}" font-size="16" fill="{MUTED}">{" ".join(l3)}</text>'''
        if i < 3:
            ax = x + 254
            cards += f'<path d="M{ax} 300h28" stroke="{AMBER}" stroke-width="5" stroke-linecap="round"/><path d="M{ax+20} 290l12 10-12 10" fill="none" stroke="{AMBER}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">{defs()}
<rect width="{W}" height="{H}" rx="28" fill="#faf8f4"/>
<text x="40" y="70" font-family="{FONT}" font-size="15" font-weight="800" letter-spacing="3" fill="{INDIGO}">HOW OTTER.AI WORKS</text>
<text x="40" y="112" font-family="{SERIF}" font-size="36" font-weight="700" fill="{INK}">From a live call to a list of next steps</text>
{cards}
<text x="40" y="496" font-family="{FONT}" font-size="14" fill="{MUTED}">Based on features described on otter.ai, checked 5 Nov 2026. Illustration by Toolora.ai.</text>
</svg>'''
    save("otter-ai-workflow.svg", svg)


# ------------------------------------------------------- Otter plan limits
def otter_limits():
    W, H = 1200, 600
    plans = [("Basic", 300, "300 min", 30, "30 min"), ("Pro", 1200, "1,200 min", 90, "90 min"), ("Business", None, "Unlimited", 240, "4 hours")]
    bars = ""
    top = 190; maxw = 470
    for i, (p, m, ml, c, cl) in enumerate(plans):
        y = top + i * 110
        w1 = maxw if m is None else maxw * m / 1200 * .85
        w2 = maxw * c / 240
        bars += f'''<text x="40" y="{y+40}" font-family="{FONT}" font-size="22" font-weight="800" fill="{INK}">{p}</text>
<rect x="170" y="{y+8}" width="{maxw}" height="40" rx="12" fill="#efece4"/>
<rect x="170" y="{y+8}" width="{w1:.0f}" height="40" rx="12" fill="url(#brand)"/>
<text x="{170 + w1 + 12 if w1 < maxw - 150 else 170 + w1 - 14:.0f}" y="{y+35}" text-anchor="{"start" if w1 < maxw - 150 else "end"}" font-family="{FONT}" font-size="18" font-weight="800" fill="{INK if w1 < maxw - 150 else "#fff"}">{ml}</text>
<rect x="690" y="{y+8}" width="{maxw}" height="40" rx="12" fill="#efece4"/>
<rect x="690" y="{y+8}" width="{w2:.0f}" height="40" rx="12" fill="url(#amber)"/>
<text x="{690 + w2 + 12 if w2 < maxw - 120 else 690 + w2 - 14:.0f}" y="{y+35}" text-anchor="{"start" if w2 < maxw - 120 else "end"}" font-family="{FONT}" font-size="18" font-weight="800" fill="{INK}">{cl}</text>'''
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">{defs()}
<rect width="{W}" height="{H}" rx="28" fill="#faf8f4"/>
<text x="40" y="70" font-family="{FONT}" font-size="15" font-weight="800" letter-spacing="3" fill="{INDIGO}">OTTER.AI PLAN LIMITS</text>
<text x="40" y="112" font-family="{SERIF}" font-size="36" font-weight="700" fill="{INK}">How much each plan lets you record</text>
<text x="170" y="170" font-family="{FONT}" font-size="16" font-weight="700" fill="{MUTED}">Meeting transcription per month</text>
<text x="690" y="170" font-family="{FONT}" font-size="16" font-weight="700" fill="{MUTED}">Max length of one conversation</text>
{bars}
<text x="40" y="570" font-family="{FONT}" font-size="14" fill="{MUTED}">Source: otter.ai/pricing comparison table, checked 5 Nov 2026. Bars not to exact scale for "Unlimited".</text>
</svg>'''
    save("otter-ai-plan-limits.svg", svg)


# ----------------------------------------------------------- Trello cover
def board(x0, y0, scale=1.0, dark=True):
    lists = [("To do", ["#a5b4fc", "#fcd34d", "#f9a8d4"], 3), ("Doing", ["#86efac", "#a5b4fc"], 2), ("Done", ["#fcd34d", "#86efac", "#c4b5fd"], 3)]
    out = ""
    for i, (name, colors, n) in enumerate(lists):
        x = x0 + i * 300 * scale
        h = (90 + n * 118) * scale
        out += f'<rect x="{x}" y="{y0}" width="{270*scale}" height="{h}" rx="{20*scale}" fill="{"#f1f0ec" if dark else "#eeebe3"}"/>'
        out += f'<text x="{x+22*scale}" y="{y0+46*scale}" font-family="{FONT}" font-size="{24*scale}" font-weight="800" fill="{INK}">{name}</text>'
        out += f'<text x="{x+238*scale}" y="{y0+46*scale}" text-anchor="end" font-family="{FONT}" font-size="{20*scale}" font-weight="700" fill="{MUTED}">{n}</text>'
        for j in range(n):
            cy = y0 + (70 + j * 118) * scale
            out += f'<g filter="url(#sh2)"><rect x="{x+14*scale}" y="{cy}" width="{242*scale}" height="{100*scale}" rx="{14*scale}" fill="#fff"/></g>'
            out += f'<rect x="{x+30*scale}" y="{cy+16*scale}" width="{54*scale}" height="{10*scale}" rx="{5*scale}" fill="{colors[j % len(colors)]}"/>'
            out += f'<rect x="{x+30*scale}" y="{cy+40*scale}" width="{(170 - (j*23 % 50))*scale}" height="{12*scale}" rx="{6*scale}" fill="#c9ccd9"/>'
            out += f'<rect x="{x+30*scale}" y="{cy+62*scale}" width="{(120 - (j*31 % 40))*scale}" height="{12*scale}" rx="{6*scale}" fill="#e2e4ec"/>'
            if name == "Done":
                out += f'<circle cx="{x+226*scale}" cy="{cy+74*scale}" r="{13*scale}" fill="#16a34a"/><path d="M{x+219*scale} {cy+74*scale}l5 5 9-10" fill="none" stroke="#fff" stroke-width="{3*scale}" stroke-linecap="round" stroke-linejoin="round"/>'
            elif j == 0:
                out += f'<circle cx="{x+226*scale}" cy="{cy+74*scale}" r="{13*scale}" fill="{["#4f46e5", "#b45309"][i % 2]}"/>'
    return out


def trello_cover():
    W, H = 1600, 900
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">{defs()}
<rect width="{W}" height="{H}" fill="url(#bg)"/><rect width="{W}" height="{H}" fill="url(#glow)"/>{dots(W, H)}
<text x="120" y="150" font-family="{FONT}" font-size="26" font-weight="800" letter-spacing="5" fill="{AMBER}">PROJECT MANAGEMENT · REVIEW 2026</text>
<text x="120" y="232" font-family="{SERIF}" font-size="78" font-weight="700" fill="#fff">Trello, explained</text>
<g filter="url(#sh)"><rect x="120" y="290" width="1000" height="530" rx="28" fill="#2a2850"/>
<rect x="120" y="290" width="1000" height="64" rx="28" fill="#1f1d3d"/><rect x="120" y="330" width="1000" height="24" fill="#1f1d3d"/>
<rect x="150" y="310" width="180" height="22" rx="11" fill="#fff" opacity=".85"/><rect x="350" y="310" width="90" height="22" rx="11" fill="#fff" opacity=".25"/>
{board(150, 380, .97)}</g>
<g filter="url(#sh)"><rect x="1150" y="360" width="330" height="190" rx="24" fill="#fff"/>
<circle cx="1210" cy="420" r="30" fill="url(#amber)"/><path d="M1214 398l-16 26h14l-4 20 16-28h-14z" fill="{INK}"/>
<text x="1256" y="414" font-family="{FONT}" font-size="22" font-weight="800" fill="{INK}">Automation</text>
<text x="1256" y="442" font-family="{FONT}" font-size="17" fill="{MUTED}">built into every board</text>
<rect x="1180" y="476" width="270" height="12" rx="6" fill="#e2e4ec"/><rect x="1180" y="500" width="200" height="12" rx="6" fill="#e2e4ec"/></g>
<g filter="url(#sh)"><rect x="1150" y="580" width="330" height="190" rx="24" fill="#fff"/>
<rect x="1180" y="608" width="60" height="60" rx="16" fill="url(#brand)"/><g fill="#fff"><rect x="1194" y="622" width="14" height="14" rx="3"/><rect x="1212" y="622" width="14" height="14" rx="3"/><rect x="1194" y="640" width="14" height="14" rx="3"/><rect x="1212" y="640" width="14" height="14" rx="3" opacity=".5"/></g>
<text x="1256" y="634" font-family="{FONT}" font-size="22" font-weight="800" fill="{INK}">Power-Ups</text>
<text x="1256" y="662" font-family="{FONT}" font-size="17" fill="{MUTED}">200+ app integrations</text>
<rect x="1180" y="700" width="270" height="12" rx="6" fill="#e2e4ec"/><rect x="1180" y="724" width="180" height="12" rx="6" fill="#e2e4ec"/></g>
</svg>'''
    save("trello-review-cover.svg", svg); cover_html("trello-review-cover", svg)


# ----------------------------------------------------- Trello board anatomy
def trello_anatomy():
    W, H = 1200, 640
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">{defs()}
<rect width="{W}" height="{H}" rx="28" fill="#faf8f4"/>
<text x="40" y="70" font-family="{FONT}" font-size="15" font-weight="800" letter-spacing="3" fill="{INDIGO}">HOW A TRELLO BOARD IS BUILT</text>
<text x="40" y="112" font-family="{SERIF}" font-size="36" font-weight="700" fill="{INK}">Boards hold lists, lists hold cards</text>
<rect x="40" y="150" width="860" height="440" rx="24" fill="#fff" stroke="{LINE}"/>
{board(64, 176, .88, dark=False)}
<g font-family="{FONT}">
<g transform="translate(930 180)"><rect width="230" height="110" rx="18" fill="{INK}"/><text x="20" y="40" font-size="20" font-weight="800" fill="#fff">Board</text><text x="20" y="68" font-size="15" fill="#c9ccd9">One project or</text><text x="20" y="88" font-size="15" fill="#c9ccd9">workflow</text></g>
<g transform="translate(930 310)"><rect width="230" height="110" rx="18" fill="url(#brand)"/><text x="20" y="40" font-size="20" font-weight="800" fill="#fff">Lists</text><text x="20" y="68" font-size="15" fill="#e0e0ff">Stages such as To do,</text><text x="20" y="88" font-size="15" fill="#e0e0ff">Doing and Done</text></g>
<g transform="translate(930 440)"><rect width="230" height="150" rx="18" fill="url(#amber)"/><text x="20" y="40" font-size="20" font-weight="800" fill="{INK}">Cards</text><text x="20" y="68" font-size="15" fill="{INK}">Tasks with due dates,</text><text x="20" y="88" font-size="15" fill="{INK}">assignees, checklists</text><text x="20" y="108" font-size="15" fill="{INK}">and attachments</text></g>
</g>
<text x="40" y="620" font-family="{FONT}" font-size="14" fill="{MUTED}">Based on trello.com, checked 5 Nov 2026. Illustration by Toolora.ai, not a product screenshot.</text>
</svg>'''
    save("trello-board-anatomy.svg", svg)


# -------------------------------------------------------- Trello plan prices
def trello_prices():
    W, H = 1200, 600
    plans = [("Free", 0, 0, "$0"), ("Standard", 5, 6, "$5 / $6"), ("Premium", 10, 12.5, "$10 / $12.50"), ("Enterprise", 17.5, None, "$17.50 / —")]
    base = 480; scale = 13
    bars = ""
    for i, (p, a, m, lab) in enumerate(plans):
        x = 150 + i * 250
        ha = max(a * scale, 4)
        bars += f'<rect x="{x}" y="{base-ha}" width="70" height="{ha}" rx="10" fill="url(#brand)"/>'
        if m is not None:
            hm = max(m * scale, 4)
            bars += f'<rect x="{x+80}" y="{base-hm}" width="70" height="{hm}" rx="10" fill="url(#amber)"/>'
        top = base - max(ha, (m or 0) * scale)
        bars += f'<text x="{x+75}" y="{top-16}" text-anchor="middle" font-family="{FONT}" font-size="20" font-weight="800" fill="{INK}">{lab}</text>'
        bars += f'<text x="{x+75}" y="{base+40}" text-anchor="middle" font-family="{FONT}" font-size="20" font-weight="800" fill="{INK}">{p}</text>'
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">{defs()}
<rect width="{W}" height="{H}" rx="28" fill="#faf8f4"/>
<text x="40" y="70" font-family="{FONT}" font-size="15" font-weight="800" letter-spacing="3" fill="{INDIGO}">TRELLO PRICING (USD PER USER / MONTH)</text>
<text x="40" y="112" font-family="{SERIF}" font-size="36" font-weight="700" fill="{INK}">Annual vs monthly billing, by plan</text>
<rect x="760" y="96" width="18" height="18" rx="5" fill="url(#brand)"/><text x="786" y="111" font-family="{FONT}" font-size="16" font-weight="700" fill="{MUTED}">Billed annually</text>
<rect x="930" y="96" width="18" height="18" rx="5" fill="url(#amber)"/><text x="956" y="111" font-family="{FONT}" font-size="16" font-weight="700" fill="{MUTED}">Billed monthly</text>
<path d="M120 {base}H1120" stroke="{LINE}" stroke-width="2"/>
{bars}
<text x="40" y="570" font-family="{FONT}" font-size="14" fill="{MUTED}">Source: trello.com/pricing, checked 5 Nov 2026. Enterprise lists an annual price only.</text>
</svg>'''
    save("trello-plan-prices.svg", svg)


for fn in (otter_cover, otter_workflow, otter_limits, trello_cover, trello_anatomy, trello_prices):
    fn()
print("ok", sorted(os.listdir(OUT)))
