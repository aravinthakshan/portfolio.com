# Site pages — todo

New routes to add under the App Router (`app/`):

- [ ] `/research` — `app/research/page.tsx`
- [ ] `/aboutme` — `app/aboutme/page.tsx`
- [ ] `/dev` — `app/dev/page.tsx`
- [ ] `/ml` — `app/ml/page.tsx`
- [ ] `/math` — `app/math/page.tsx`
- [ ] `/blog` — `app/blog/page.tsx`

## Notes (when you implement)

- Wire each page into the existing layout (`app/layout.tsx`) and navigation if you want them in the menu.
- Reuse the site typography / `data-theme` patterns from `portfolio`, `globe`, or `contact` as needed.
- `/blog` may later need a listing + dynamic `[slug]` route; start with a single `page.tsx` if you prefer.
