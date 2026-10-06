# AlphaFold Exercises · Cilia Connect 2026

Student-facing web version of the two computer exercises for the AI structure prediction workshop (Cilia Connect 2026, Bonn).

- **Part 1 · ARL13B**: single-protein prediction, pLDDT, pTM, the five models, first look at the PAE.
- **Part 2 · IFT52:IFT46**: complex prediction, PAE and ipTM, finding and testing the interface.

Static site, no build step. Deployed on Vercel straight from this repo.

## Layout

```
index.html      the site (tabs: Start here, Part 1, Part 2, Server not working?)
style.css
app.js          tabs, copy buttons, sequence trimmer
pdf/            the PDF handouts (same content and section numbers)
assets/         figures used in the page
downloads/      offline fallback results, linked only from the "Server not working?" tab
```

Deep links work for tabs (`#part1`, `#part2`) and sections (`#p1-s6`, `#p2-s4`, ...).

## Updating

The page text mirrors `ARL13B_exercise.tex` and `IFT_complex_exercise.tex`. If a handout changes, rebuild its PDF, copy it into `pdf/`, and make the same edit in `index.html`.

Answer keys and instructor notes are deliberately **not** in this repo.
