# Design language

A magazine that boots up. Editorial type and numbered stories, cut with chamfered corners and drawn on a geometry-book grid.

- **Palette:** Ink #111110, Graphite #3A3A37, Concrete #8C8A83, Beige #E8DFCB, Bone #FBFAF6, Signal yellow #F4C20D. Yellow is rare on purpose: one highlight per screen, plus niche-tool chips.
- **Type:** Bodoni Moda 800 for headlines, Space Grotesk for body, IBM Plex Mono for labels and the one-line `# comment` under every tool.
- **Shape:** chamfered corners (18px) on cards, tiles and buttons; never rounded. Alternate the cut direction (`.cut`, `.cut2`).
- **Line:** hairlines at 0.5 to 1.5px, ruler ticks along edges, concentric circles and crosshairs for figures, a 60px grid. Figures are captioned `FIG. 01` in mono.
- **Structure:** every list is numbered like a magazine feature. The roadmap mirrors a code tree, with a comment beside each stop.
- **Accessibility:** small grey text uses `--muted` (#55554f) on beige or bone. Real buttons, labels and alt text throughout.

Tokens live in `design/tokens.css`.
