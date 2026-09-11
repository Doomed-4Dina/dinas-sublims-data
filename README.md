# dinas-sublims-data

> **Explicit-content warning:** This repository contains links to third-party adult media and text with sexual, fetish, hypnosis, submission, and coercive-fantasy themes. Do not open, fetch, preview, or display the linked media unless you knowingly intend to handle explicit content.

This repository is a data-only collection. It provides JSON values for controlled ingestion and does not host media, include an application, or authorize any particular use of the data.

## Safety, rights, and provenance

The media URLs are third-party hotlinks. Their availability, ownership, licensing, authenticity, security, and provenance have not been verified. The repository maintainers do not claim rights to the linked media. A reachable URL is not evidence that content may legally or ethically be copied, cached, displayed, or redistributed.

Before using or redistributing any entry, consumers must independently verify all of the following:

- every depicted person is a legal adult under all applicable laws;
- every depicted person gave informed consent to the creation and intended use of the content;
- the required copyright, publicity, privacy, platform, and distribution rights exist; and
- the proposed use complies with applicable law, platform rules, and local policy.

If any age, consent, provenance, or rights check cannot be completed, do not use the entry. The text is fantasy-themed data, not consent to manipulate, pressure, or involve another person. Real-world activity always requires freely given, informed, specific, and revocable consent.

## Consumer guidance

- Treat all URLs and strings as untrusted input.
- Require an explicit adult-content opt-in and an appropriate jurisdiction-aware age gate before display.
- Do not automatically fetch or embed the URLs during import, validation, build, test, or preview steps.
- Apply allowlists and content moderation before use; handle removed, redirected, or compromised resources safely.
- Consider user privacy before remote requests, including IP-address, referrer, tracking, and logging exposure.
- Do not assume this repository's validation establishes content safety, rights, age, consent, or provenance.

## Data files

- `images.json` contains an object with one `images` array of unique HTTP(S) URL strings.
- `phrases.json` contains an object with one `phrases` array of non-empty string arrays. Phrase values are unique across all groups.

Machine-readable schemas are in `schemas/`. They describe file shape; the local validator additionally enforces cross-group phrase uniqueness and HTTP(S)-only image URLs.

## Validate

Node.js 18 or newer is required. Validation is dependency-free and never makes network requests:

```sh
npm run validate
```

The same check runs in GitHub Actions for pushes and pull requests.
