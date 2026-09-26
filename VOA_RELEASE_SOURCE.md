# VOA production source baseline (2026-09-26)

This revision incorporates the recovered VOA release from `/mnt/deploy-ssd/releases/voa-recovery-20260926`, based on GitHub `main` at `49d1bf118eff09ee6fa5e847dedda355ae013cfb`, plus its 95 changed source/media files. It does **not** itself deploy production. The accepted live alias on verification was deployment `dpl_6nE4myEESSsAi66cG2YarZEXNTi3` for `vaultofarcana.com` and `www.vaultofarcana.com`.

The accepted live Red Book hero SHA-256 was `3f812d952dd7c60a45165ebdfca840c066b3fc16a8792ebc1d59c23f3297aea4`; thumbnail SHA-256 was `59ec578e0c50cb4cfb783fd543f0d8d03e1d18ba21c829cd07ab123d1d7d550f`. Source files in this revision match those live bytes. The Shape Before the World imagery also matched live byte-for-byte across its nine assets. The release carries the 12 archive product additions, public Updates records, Codex v2, and Red Book/Shape articles from the recovered tree.

Before any future production promotion:

1. Start from this shared committed revision, not an older checkout, dirty working tree, or arbitrary source snapshot. Keep the installed `node_modules`, `.next`, env files and local archives out of the release.
2. Run `node --test tests/*.test.mjs` and `npm run build` on the exact candidate tree.
3. Run `python3 /mnt/hermes-ssd/thoth-clean/hermes-data/scripts/voa_deploy_source_gate.py --source <candidate-checkout>` on the Pi. A passing gate is necessary but not sufficient.
4. Build a preview **without changing production aliases**. Compare required routes and media with live production, then promote only if the intended new content works and existing `/updates`, both Codex routes, Red Book article/images, metadata, sitemap and shop paths remain intact.
5. Read back both custom domains and Vercel's deployment alias mapping afterward. Stop and roll back to the accepted deployment on any regression. Do not call a CLI `Aliased` message a successful release.

The source gate checks a committed clean tree and live asset parity; tests check the accepted baseline. Neither can prevent an unrelated person with Vercel credentials from bypassing the process. The live regression watchdog alerts on repeated failures.
