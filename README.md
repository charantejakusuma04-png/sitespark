# SiteSpark — Logic Fixers

A hackathon prototype that turns a natural-language brief into a responsive, downloadable static website using Gemini. Built with HTML, CSS, browser JavaScript and a Node.js server; no package dependencies.

## Run locally

1. Install Node.js 22 or newer, or use an available compatible runtime.
2. Open this folder in VS Code.
3. Copy `.env.example` to `.env`.
4. Create a Gemini API key at https://aistudio.google.com/apikey and put it after `GEMINI_API_KEY=` in `.env`. Never commit or share this file.
5. In a terminal in this folder, run `node server.mjs`.
6. Open http://localhost:3000. Enter a brief and click Generate website.

No `npm install` step is needed. If `node` is not found in VS Code, install Node.js and restart VS Code. The model is configurable with `GEMINI_MODEL`; use a text model available to your key that supports generateContent. API access and quota depend on your Google project.

## How it works

The browser sends the brief to a local Node.js endpoint. The server validates it, calls Gemini, checks for a completed HTML response, and adds a restrictive content policy. The browser renders it in a sandboxed iframe. Desktop/mobile controls resize the preview; Download saves a standalone HTML document.

The API key stays on the server. Requests time out after 90 seconds. Invalid descriptions, missing configuration, quota failures and incomplete responses produce visible errors. No generated JavaScript or external resources are permitted. Generated pages are static: payments, submissions, logins and databases are not implemented. Review AI-generated claims and content before use.

## Verification status

The initial version can be checked without a key for startup and missing-key handling. End-to-end Gemini generation requires a valid key and quota and must be verified before submission. Browser visual checks and public deployment are still pending.

## Team and submission

Team: Logic Fixers. Add each member's actual contribution here as work is completed; invite every member to the public GitHub repository. Record the use of AI assistance and third-party services as required by your organizers.

Before submission: test generation, both preview sizes, and HTML download; verify setup from this README; record a demo of at most four minutes; check repository and video links in an incognito window. Never include `.env` in uploads. Live hosting is not configured; this server currently listens only on the local computer. Public hosting requires access and usage controls to protect your Gemini quota.
