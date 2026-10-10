# SiteSpark — Logic Fixers

SiteSpark turns plain-language descriptions into responsive, single-page websites using Google Gemini. Built for the TriCity AI Hackathon.

**Live demo:** https://sitespark-0kc4.onrender.com

## Problem and solution

Creating a website usually requires coding and design skills. SiteSpark lets users describe their idea, generates the layout and content, and displays a preview with an option to download the website.

## Features

- Generate websites from natural-language descriptions.
- Preview desktop and mobile layouts.
- Download a standalone HTML file.
- Start with bakery, portfolio, or college-event example prompts.
- Receive clear messages for generation errors and service limits.

## Technology

- Frontend: HTML, CSS and JavaScript
- Backend: Node.js with built-in modules
- AI: Google Gemini API
- Hosting: Render
- Database: Not required

## Run locally

1. Install Node.js 24.19.0 or a newer compatible Node.js 24 release.
2. Clone or download this repository.
3. Open the project folder in VS Code.
4. Copy `.env.example` to a new file named `.env`.
5. Create an API key at https://aistudio.google.com/apikey.
6. In `.env`, put your key after `GEMINI_API_KEY=`.
7. Keep `GEMINI_MODEL=gemini-3-flash-preview`, or choose another available model supporting `generateContent`.
8. Open a terminal in the project folder and run `node server.mjs`.
9. Open http://localhost:3000.

No additional packages or `npm install` step are required. Gemini access depends on your API key, model availability and quota.

**Never commit `.env` or share your API key.**

## How it works

1. The browser sends the user's description to the Node.js server.
2. The server validates the description and calls Gemini.
3. Gemini generates a complete HTML document with inline styling.
4. The server checks the response and adds a restrictive content policy.
5. The browser displays the document in a sandboxed preview.
6. The user can download the generated HTML.

The API key stays on the server. Generated scripts and external resources are blocked.

## Deploy on Render

Create a Node Web Service connected to this repository.

- Build command: `node --check server.mjs`
- Start command: `node server.mjs`
- Environment variable: `GEMINI_API_KEY` containing your private key
- Optional environment variable: `GEMINI_MODEL`
- Node version: a compatible Node.js 24 release

The server uses Render's assigned port and accepts connections on `0.0.0.0` when running on Render.

## Testing completed

Manual testing confirmed:

- Website generation and desktop preview.
- Mobile preview and section navigation.
- HTML download and opening the downloaded website.
- Generation on the deployed Render website.
- Opening the public website in an Incognito window without signing in.

## Limitations

- Generated websites are static prototypes. Payments, accounts and backend forms are not implemented.
- AI-generated content and layouts should be reviewed.
- Generation depends on Gemini availability and quota.
- The free hosting instance can pause when inactive, delaying the first request.
- The demo allows two simultaneous generations and 30 generation attempts per hour per running server. These in-memory limits reset when the server restarts.

## Team

**Logic Fixers**

- Kusuma Charan Teja
- Bukya Sathwika
- Aadika Durga Mounima
- Pabba Tejaswi

Individual contributions will be documented before final submission.

## Acknowledgements

Developed with AI assistance from OpenAI Codex for implementation and troubleshooting. Google Gemini powers website generation. Render provides hosting.
