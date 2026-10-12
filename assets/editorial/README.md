# Editorial homepage assets

The homepage is hand-authored static HTML with `home.css` and a small year-update script. It needs no package install or build. Existing case-study routes are unchanged.

## Image provenance

All WebP derivatives below were made from existing repository images; originals remain intact.

| File | Source |
|---|---|
| portrait.webp | about/mcp-106-2178/photo-tr.jpg |
| museum.webp | about/mcp-106-2178/photo-tl.jpg |
| studio.webp | about/mcp-106-2178/photo-bl.png |
| penny-challenge.webp | penny/assets/figma/image16.png |
| penny-budget.webp | penny/assets/figma/image17.png |
| nextbit-app.webp | assets/framerusercontent.com/images/UyUnT126WLbfBtF4rBejMQlaf7o.png |

Images are resized with Pillow and saved as WebP quality 86. The six homepage images total 431,214 bytes. Only the portrait loads eagerly; the project and personal-section images are lazy-loaded. Fonts use the system Georgia/Arial stacks without additional font downloads.

## Content decisions

- Penny's 18 interviews are presented as research scope, not an impact metric.
- NEXTBIT role, duration and team size come from its existing case study.
- GameFi is an explicitly labelled concept linked to the existing route.
- Amazon Music material remains in the repository, but the homepage omits its previously non-functional case-study entry until a destination exists.
- AI product claims and unverified business metrics are not introduced.
- The resume redirect needs verification before promoting it in primary navigation.

## Local preview

From the repository root:

```sh
python3 -m http.server 8917 --bind 127.0.0.1
```

Open http://127.0.0.1:8917/ . Do not run `scripts/push-penny-updates.sh` to preview; it commits and pushes all changes.

## Verification status

Static checks passed: local href/src existence, fragment targets, unique IDs, one h1, meaningful image alternatives, intrinsic image dimensions, and git diff whitespace checks.

Browser checks completed against the correct checkout at port 8917 after the user started the local server:

- Desktop and 375 px mobile visual inspection; tightened Penny artwork spacing after detecting overlap.
- No horizontal overflow at 375, 768 and 1440 px.
- All six images loaded during inspection; offscreen images intentionally use lazy loading.
- Work anchor, Penny and NEXTBIT case-study links opened successfully.
- Keyboard Tab reaches the visible skip link with a solid focus outline.
- Temporary viewport override reset and preview retained for review.

The existing case-study pages are still the original designs. No remote commit, push or deployment was performed. Reduced-motion CSS is included, but OS-level reduced-motion interaction was not separately exercised.
