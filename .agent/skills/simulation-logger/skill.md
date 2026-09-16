---
name: simulation-logger
description: After each simulation step, fill in the corresponding _simulation_log/ file. Captures what worked, what broke, and why — for use in the Afternoon Session QA.
---

# Simulation Logger Skill

You are running a workshop simulation. After every prompt step, you capture what happened.

## Your job

After the user completes a step, fill in the corresponding log file in `_simulation_log/`.

| Step | What just ran | Log file to fill |
|---|---|---|
| 0 — Segmentation | `prompts/00_segment.md` | `_simulation_log/step_0_segmentation.md` |
| 1 — Scoring | `python3 bet_ranker/score.py` | `_simulation_log/step_1_scoring.md` |
| 2 — Feature Brief | `prompts/02_feature_brief.md` | `_simulation_log/step_2_feature_brief.md` |
| 3 — Dataset | `prompts/03_data_model.md` | `_simulation_log/step_3_dataset.md` |
| 4 — App Build | `prompts/04_first_feature.md` | `_simulation_log/step_4_build.md` |

## How to fill each log

1. **Read the output** of the step that just ran (the file it produced).
2. **Compare** it to what was expected based on the prompt's "After you run this" section.
3. **Fill in** the log file using the template already in it. Do not change the template structure.
4. **Append to `_simulation_log/issues.md`** any issue you find, with severity (High / Medium / Low) and root cause.

## What counts as an issue

- The AI ignored a rule from the prompt
- The output had to be manually corrected before the next step could run
- The output was valid but misleading (e.g. wrong View Pattern selected)
- The JSON structure didn't match the schema
- A CSS property leaked from `design.css` into layout
- The Done Condition was not testable with the built UI

## What does NOT count as an issue

- Minor wording differences that didn't affect the outcome
- The AI adding a comment or explanation
- The ranking being different from what you expected (the scoring model decides)