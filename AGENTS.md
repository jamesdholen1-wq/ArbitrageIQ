<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# ArbitrageIQ Agent System

## Architecture

ArbitrageIQ uses a **parent-child agent model** to keep each agent focused and context-lean:

- **Child agents** are specialized, scheduled remote agents. Each runs independently, researches one domain, and writes a structured output file to `agents/outputs/{agent-name}/`.
- **The parent agent** is triggered after child agents complete. It reads all output files, synthesizes them into a unified action report, and writes `agents/PARENT_REPORT.md` for the developer to act on.

```
agents/
├── outputs/
│   ├── market-research/       # Written by: Weekly Market Research Agent
│   │   └── report.md
│   └── [future-agent]/        # Add new agent output dirs here
│       └── report.md
└── PARENT_REPORT.md           # Written by: Parent Synthesis Agent
```

### Communication Protocol

All agents communicate exclusively through files in `agents/outputs/`. Rules:

1. Each child agent writes **one file**: `agents/outputs/{agent-name}/report.md`
2. Child agents **never** modify `src/data/markets.json` directly — only the developer does
3. Child agents **never** read each other's outputs — only the parent does
4. The parent reads **all** `agents/outputs/*/report.md` files and synthesizes them
5. Every output file must begin with a metadata header (see format below)

### Output File Header Format

Every child agent must start its `report.md` with:

```
---
agent: [agent-name]
trigger_id: [trig_...]
run_date: [YYYY-MM-DD]
status: complete | partial | failed
markets_covered: [n]
flags: [none | list of high-priority flags]
---
```

---

## Registered Agents

### Parent: Weekly Synthesis Agent

> **Not yet created.** To be set up when 2+ child agents are active.

**Role:** Reads all `agents/outputs/*/report.md` files and produces `agents/PARENT_REPORT.md` — a single prioritized action list for the developer. Runs Sundays at 6am ET (after all child agents complete).

**Parent report format:**
- Priority actions (regulatory changes, >10% data shifts, recommendation flips)
- Per-field change summary across all markets
- Ready-to-paste `markets.json` diff
- Confidence and source quality assessment

---

### Child 1: Weekly Market Research Agent

**Trigger ID:** `trig_011pnGtjNkxGgppvATt7yJAi`
**Manage:** https://claude.ai/code/scheduled/trig_011pnGtjNkxGgppvATt7yJAi
**Schedule:** Every Sunday at 12am ET (5am UTC) — `0 5 * * 0`
**Output:** `agents/outputs/market-research/report.md`
**Model:** claude-sonnet-4-6
**Repo:** https://github.com/jamesdholen1-wq/ArbitrageIQ

**Domain:** STR market metrics — nightly rates, occupancy, revenue potential, seasonality, competition, regulations, and Go/Caution/Avoid verdict for every market in `src/data/markets.json`.

**Fields researched:**

| Field | Type | Notes |
|-------|------|-------|
| `averageNightlyRate` | number | USD per night, 1–2BR average |
| `monthlyRevenuePotential` | number | USD gross monthly estimate |
| `occupancyRate` | number | Percentage (0–100) |
| `seasonality` | object | highMonths, lowMonths, peakMonth, slowestMonth |
| `competitionLevel` | low/medium/high | Based on listing count trends |
| `regulatoryRisk` | low/medium/high | Based on permit rules, bans, caps |
| `recommendation` | go/caution/avoid | Overall market verdict |
| `marketNotes` | string[] | 3–5 bullet insights |

---

### Child 2+: [Future Agent Slot]

To add a new child agent:
1. Create the trigger at https://claude.ai/code/scheduled
2. Set its output path to `agents/outputs/{agent-name}/report.md`
3. Include the standard header format at the top of its output
4. Register it in this file under a new `### Child N` section
5. Update the parent agent prompt to include the new output path

---

## How to Use the Weekly Reports

1. **Monday morning** — open `agents/PARENT_REPORT.md` (once parent agent exists) or `agents/outputs/market-research/report.md` directly
2. Review priority flags first (regulatory changes, recommendation flips)
3. For each changed market, copy the ready-to-paste JSON block into `src/data/markets.json`
4. Commit and push — no code changes needed, data only
