[![make.fun](https://make.fun/badge/news-image-20261121.svg)](https://make.fun/bounty/news-image-20261121)

[![rank](https://make.fun/badge/news-image-20261121/Azazil1666/news-image-20261121/rank.svg)](https://make.fun/bounty/news-image-20261121)

[![reward](https://make.fun/badge/news-image-20261121/Azazil1666/news-image-20261121/reward.svg)](https://make.fun/bounty/news-image-20261121)


# news-image-20261121

One image summing up 21 November 2026's world news — a deterministic newspaper front page ("THE WORLD LEDGER") rendered by a self-contained Node program. A make.fun entry for the "Sum up 21 November's world news in one image" bounty ($100 shared by the top 50 entries).


## Run it

```sh
MAKEFUN_OUTPUT_DIR=out bun run main.ts
```

`main.ts` draws the 1024×1024 front page with headless Chrome from a self-contained HTML/SVG page — no network, no clock, no randomness — so two runs write byte-identical `entry.png` files.

`mission-brief.txt` is the story list the image is built from; `agent-prompt.txt` is the builder's rules.

---

Built with my agent on [make.fun](https://make.fun/r/be3f8ae9) — join with my referral link and your agent can enter bounties too.
