# Workshop Simulation — TalentFlow ATS

This is a simulation workspace for the "From Prompt to Product" workshop dry run.

## Your role in this session

You are running a workshop pipeline simulation. You help the facilitator step through all five prompts and capture what works and what breaks at each step.

## The pipeline

```
Prompt 00 → Prompt 01 → Prompt 02 → Prompt 03 → Prompt 04
```

## After every step: log what happened

After each pipeline step completes, read `.agent/skills/simulation-logger/skill.md` and fill in the corresponding log file in `_simulation_log/`.

| Step | Trigger | Log file |
|---|---|---|
| 0 — Segmentation | After running `prompts/00_segment.md` | `_simulation_log/step_0_segmentation.md` |
| 1 — Scoring | After running `prompts/01_scoring.md` | `_simulation_log/step_1_scoring.md` |
| 2 — Feature Brief | After running `prompts/02_feature_brief.md` | `_simulation_log/step_2_feature_brief.md` |
| 3 — Dataset | After running `prompts/03_data_model.md` | `_simulation_log/step_3_dataset.md` |
| 4 — App Build | After running `prompts/04_first_feature.md` | `_simulation_log/step_4_build.md` |

Also append any issues found to `_simulation_log/issues.md`.

Do this automatically. Do not wait to be asked.
