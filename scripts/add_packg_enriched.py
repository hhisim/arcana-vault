#!/usr/bin/env python3
"""Add PACK-G entry to VOA enriched shop JSON (idempotent)."""
import json

p = 'lib/shop-packs-enriched.json'
d = json.load(open(p))
desc = """**ESP & TELEPATHY MEGA PACK — 33 GB of rare psychic-science training & research**

A curated archive for the serious student of extrasensory perception: complete remote viewing training systems, classic telepathy instruction, psi-research literature, and a deep library of consciousness-exploration audio — organized, indexed, and delivered instantly.

**◈ ESP & TELEPATHY CORE** — ESP Mechanics complete 3-module video course · Alice Bailey's *Telepathy and the Etheric Vehicle* (PDF + full 25-chapter audiobook)

**◈ REMOTE VIEWING TRAINING** — The Complete Remote Viewing System audio course (MP3 + lossless WAV masters) · 4-part Remote Viewing video course · CRV target templates

**◈ PSYCHIC SCIENCES LIBRARY** — 13 classic texts: psychic power development, crystal gazing, psychic self-defense, the psychic sciences illustrated, thought-force classics, and the legendary *Black Box & Other Psychic Generators*

**◈ PSI RESEARCH AUTHORS** — Dedicated folders for Ingo Swann (incl. *Penetration*), Charles Tart, Russell Targ, Joseph McMoneagle, Dean Radin, Andrija Puharich, Jane Roberts, and more

**◈ CONSCIOUSNESS EXPLORATION AUDIO (20+ GB)** — Hemi-Sync collections · Brainwave Mind Voyages · Buhlman out-of-body course · Remote Influencing sessions · guided psi-state training programs

**◈ REFERENCE TEXTS** — The Dreamwalker library: biomind superpowers, *Mind Trek*, the Controlled Remote Viewing Manual, and hundreds of supporting pages

**DETAILS**
• 1,283 files · ~33 GB · PDF/EPUB/MP3/WAV/AVI/WMV/FLAC
• Instant delivery — organized folders, works on any device
• Legacy video formats preserved as-is (WMV/AVI); mixed bitrates on older audio
• For study of historical & esoteric source material; no paranormal results promised or implied

*Vault of Arcana — curated archives for the independent esoteric scholar.*"""
entry = {
    "sku": "etsy-4562868882",
    "etsyListingId": 4562868882,
    "title": "ESP & Telepathy Mega Pack 33GB | Remote Viewing, Psychic Sciences, Psi Research Library, Hemi-Sync + Brainwave Audio | Instant Download",
    "price": 49.99,
    "stripePriceId": "",
    "views": 0,
    "favs": 0,
    "description": desc,
    "images": [f"/shop/etsy-4562868882/img-{i}.jpg" for i in range(1, 5)],
}
d = [e for e in d if e.get("etsyListingId") != 4562868882]
d.append(entry)
json.dump(d, open(p, 'w'), indent=2, ensure_ascii=False)
print('enriched entries:', len(d))
