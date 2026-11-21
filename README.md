![A bridge proposal and its red counterargument overlay beside a risk scatterplot.](assets/banner/banner.png)

# 😈 Devil's Advocate Architect

What would have to be true for your plan to fail? Give the studio a proposal and read the strongest case against it. Then audit the objections themselves. The final synthesis weighs the proposal, its critique and the audit before recommending a decision.

**Contents** · [Framework modes](#modes) · [Risk and bias](#risk) · [Quick start](#start) · [Architecture and stack](#architecture) · [Project status](#status) · [Contributing and license](#contributing)

<a id="modes"></a>

## ⚔️ The dialectical pipeline

Try a decision with a real alternative, such as *“Should we migrate every team this month or pilot the change with one team first?”* Quick Scan gives you a first objection. Full Pipeline lets you see whether that objection survives a second reading.

| Workspace mode | What happens |
| --- | --- |
| ⚡ Quick | One request returns a summary, top risk, primary alternative and recommendation. [Quick analysis schema](services/geminiService.ts) |
| 😈 Advocate | Challenges assumptions and returns a critique, risk points, mitigation plan and confidence level. [Analysis service](services/geminiService.ts) |
| 🔍 Validate | Starts with the same critique as Advocate. Once it is ready, run validation to examine biases, strategic conditions and the cost of inaction. [Workspace controls](App.tsx) · [Validation view](components/ValidationView.tsx) |
| ⚖️ Synthesize | Also begins with the critique. Run validation, then synthesis to compare the arguments and inspect a verdict, dependencies and pivot triggers. [Workspace controls](App.tsx) · [Synthesis view](components/SynthesisView.tsx) |
| 🏆 Full | Runs analysis → validation → synthesis in sequence, passing each result into the next step. [Pipeline implementation](App.tsx) |

<a id="risk"></a>

## 📊 Read the risk and bias results

On the scatterplot, moving **right** means higher estimated probability and moving **up** means higher estimated impact. Hover over a point for its name, category and scores. Color comes from probability × impact. A score of 60 or more is red, 30–59 is orange, and lower scores are yellow. A financial risk and an operational risk can therefore share a color. [Risk chart](components/RiskChart.tsx)

The validation panel pairs each bias assessment with an explanation. Read those observations alongside the terrain, timing, force and conditions assessments to see which objections the model kept or overrode. These are model judgments about the supplied material. [Validation panel](components/ValidationView.tsx) · [Response contracts](types.ts)

The workspace accepts images, video, PDFs and plain text. A context URL is sent as a text string. The Markdown export contains the original critique, risks and mitigation plan. A separate chat panel supports follow-up conversation with its own message history. [Workspace and export](App.tsx) · [Attachment handling](services/geminiService.ts) · [Chat](components/ChatInterface.tsx)

<a id="start"></a>

## ⚡ Quick start on Windows

1. Open PowerShell in the repository with Node.js and npm available.
2. Run `npm install` to install the dependencies declared in [package.json](package.json).
3. In a local `.env.local` file at the repository root, set `GEMINI_API_KEY` to your own Gemini credential. Vite embeds this value into the browser bundle. Keep the credential-bearing build private. [Vite configuration](vite.config.ts)
4. Run `npm run dev -- --host 127.0.0.1` to bind the development server to your machine. Open the address Vite prints. The configured port is **3000**.
5. Enter a proposal, choose **Quick**, and run the analysis. For the full sequence, switch to **Full** and run it again. [Mode handling](App.tsx)

For a local production preview, run `npm run build` and then `npm run preview -- --host 127.0.0.1`. The repository provides Vite development, build and preview scripts. Public deployment would require a design that keeps the Gemini credential on a server. [Scripts](package.json) · [Client service](services/geminiService.ts)

<a id="architecture"></a>

## 🏗️ Architecture, stack and repository layout

| Path | Responsibility |
| --- | --- |
| [index.html](index.html) · [index.tsx](index.tsx) | HTML shell, Tailwind CDN configuration and React entry point |
| [App.tsx](App.tsx) | React workspace, proposal and attachment state, mode selection and report export |
| [services/geminiService.ts](services/geminiService.ts) | Google GenAI prompts, response schemas, analysis requests and chat |
| [types.ts](types.ts) | TypeScript contracts for analyses, risks, validation and synthesis |
| [components](components) | Recharts scatterplot, validation and synthesis panels, chat and framework reference |
| [package.json](package.json) · [vite.config.ts](vite.config.ts) | React 19, TypeScript, Vite 6, Lucide React, Recharts and Google GenAI dependencies and build settings |
| [Banner brief](assets/banner/BANNER_BRIEF.md) · [Editable artwork](assets/banner/banner.svg) | Art direction and vector fallback for the repository front page |

<a id="status"></a>

## 🚧 Project status

The analysis service requests `gemini-2.5-flash-latest` and the chat service requests `gemini-3-pro-preview`. Those are the identifiers in the source. Live model availability and end-to-end responses were not verified for this refresh. The package defines no automated test script. [Model requests](services/geminiService.ts) · [Package scripts](package.json)

<a id="contributing"></a>

## 🤝 Contributing and license

For changes to a report field, check its [TypeScript definition](types.ts), [Gemini response schema](services/geminiService.ts) and the [component that renders it](components). Build locally with `npm run build` and describe the decision scenario you exercised in your pull request.

Distributed under the [MIT License](LICENSE).
