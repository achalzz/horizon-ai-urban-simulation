# CSET400C Capstone Project — Project Log Diary & Contribution Register
**Bennett University | School of Computer Science Engineering and Technology**  
**Course Code:** CSET400C (0-0-12-6) | **Academic Session:** 2026–27  
**Course Coordinator:** Dr. Jabir Ali  

---

## 1. Project & Group Information

- **Project Title:** HORIZON AI: Autonomous Multi-Dimensional Urban Impact Assessment & Future Simulation Engine for Delhi-NCR
- **Domain:** Urban Computing, Causal AI, Geospatial Information Systems (GIS), Full-Stack Web Application
- **UN SDG Mappings:** SDG 11 (Sustainable Cities & Communities), SDG 13 (Climate Action), SDG 9 (Resilient Infrastructure)
- **Project Guide:** [Faculty Name / Designation]
- **Meeting Frequency:** Weekly / Bi-weekly progress review

### 1.1 Team Members & Individual Role Allocation

| Member Name | Enrollment No. | University Email | Assigned Architectural Responsibilities |
| :--- | :--- | :--- | :--- |
| **Member 1 (Team Leader)** | [Enrollment 1] | leader@bennett.edu.in | • System Architecture & FastAPI Gateway (`main.py`)<br>• Causal Mobility & Trip Generation Engine (`mobility_model.py`)<br>• Project Management, Milestone Submissions & Log Diary |
| **Member 2** | [Enrollment 2] | member2@bennett.edu.in | • Geospatial Engine & Delhi-NCR Zone baselines (`spatial_engine.py`)<br>• Atmospheric Gaussian Plume & Noise Buffer Model (`pollution_model.py`)<br>• Resource Depletion & Water/Power Indexing (`resource_model.py`) |
| **Member 3** | [Enrollment 3] | member3@bennett.edu.in | • Next.js 14 Interactive Web Frontend & Leaflet Map (`MapContainer.tsx`)<br>• Temporal Projections & Scenario Generation Engine (`scenario_engine.py`)<br>• Automated Pytest & Integration Test Suite (`tests/`) |

---

## 2. Longitudinal Sprint Log & Guide Meeting Records

### Sprint 1: Weeks 1–2 (August 10 – August 25, 2026) — Milestone 0: Problem Identification
- **Objectives:** Problem formulation, stakeholder analysis, university group formation MS Form submission, and guide selection.
- **Tasks Completed:**
  - *Member 1:* Drafted core problem statement addressing uncoordinated NCR urban sprawl and submitted MS Form with member consents.
  - *Member 2:* Mapped project scope to UN SDG 11 and SDG 13; surveyed open geospatial data availability (OSM, CPCB, DDA).
  - *Member 3:* Conducted feasibility study on modern GIS visualization frameworks (Next.js, Mapbox GL, Leaflet).
- **Guide Meeting & Feedback:** Guide verified problem validity; recommended grounding all baselines in the official *DDA Master Plan Delhi 2041 (MPD-2041)*.
- **Milestone 0 Status:** **Approved by Coordinator (25 Aug 2026).**

---

### Sprint 2: Weeks 3–5 (August 26 – September 20, 2026) — Milestone 1: Requirements & Methodology
- **Objectives:** Formalizing functional/non-functional requirements, mathematical formulations for causal models, and comparative literature review.
- **Tasks Completed:**
  - *Member 1:* Modeled ITE trip generation formulations adjusted for Delhi-NCR vehicle occupancy and multimodal metro transit shares.
  - *Member 2:* Formulated empirical Gaussian-style radial buffer dispersion equations for PM2.5, PM10, and noise contours.
  - *Member 3:* Drafted SRS document specifying FR-01 to FR-12 and NFR-01 to NFR-05; prepared comparative matrix against ArcGIS Urban.
- **Guide Meeting & Feedback:** Advised adding water aquifer depletion metrics due to severe groundwater extraction in Gurugram and South Delhi.
- **Sprint Deliverable:** Milestone-1 Proposal & Requirements Document compiled.

---

### Sprint 3: Weeks 6–8 (September 21 – October 18, 2026) — Milestone 1 Submission & Defense
- **Objectives:** Finalization of Milestone-1 Report, presentation slide deck, and mock panel defense.
- **Tasks Completed:**
  - *Member 1:* Authored Chapter on Feasibility, Risk Analysis, and Economic GVA modeling.
  - *Member 2:* Compiled data dictionaries for 10 Delhi-NCR spatial zones (Saket, Dwarka, Cyber City, Noida Sec 62, etc.).
  - *Member 3:* Designed presentation slides highlighting causal coupling versus traditional static EIAs.
- **Milestone 1 Presentation (18 Oct 2026):** Presented to faculty panel.
  - *Panel Feedback:* Commended the ambition of multi-dimensional causal coupling; emphasized demonstrating a functional working prototype by Milestone-2.

---

### Sprint 4: Weeks 9–11 (October 19 – November 10, 2026) — Milestone 2: Core Engine & API Implementation
- **Objectives:** Backend implementation in FastAPI and decoupled causal microservices.
- **Tasks Completed:**
  - *Member 1:* Implemented `main.py`, `mobility_model.py`, and `economic_model.py` with Pydantic v2 schemas.
  - *Member 2:* Implemented `spatial_engine.py`, `pollution_model.py`, and `resource_model.py` calculating water, power, and sewage loads.
  - *Member 3:* Built `scenario_engine.py` synthesizing counterfactual scenarios (S0–S3) and temporal 15-year projections.
- **Guide Meeting & Feedback:** Guide reviewed API JSON responses; instructed the team to add plain-language AI summaries for municipal non-technical officials.
- **Code Check-in:** Integrated deterministic explainer and local Ollama hooks in `llm_explainer.py`.

---

### Sprint 5: Weeks 12–14 (November 11 – November 30, 2026) — Milestone 2: Frontend & Automated Testing
- **Objectives:** Full-stack integration, interactive dashboard UI, unit testing, and Milestone-2 demonstration.
- **Tasks Completed:**
  - *Member 3:* Built Next.js interactive frontend with Mapbox/Leaflet GIS canvas, positive/negative ledgers, temporal sliders, and radar charts.
  - *Member 1 & 2:* Connected frontend to FastAPI `/api/simulate` endpoint; tuned API latency to execute under 100 ms.
  - *Member 3:* Developed comprehensive `pytest` test suite (`test_spatial_engine.py`, `test_causal_models.py`, `test_api_endpoints.py`), achieving 100% pass across 15 test suites.
- **Milestone 2 Status:** **MVP fully functional, integrated, and validated.**

---

### Sprint 6: Weeks 15–16 (December 1 – End Semester) — Final Report & Defense Preparation
- **Objectives:** Compilation of official 20–40 page Capstone Project Report following Section 12 guidelines (Times New Roman, 1.5 spacing, Chapters 1–8), live demonstration rehearsal, and individual viva defense.
- **Tasks Completed:**
  - *Member 1:* Authored Chapters 1, 4, and 8 (Introduction, Methodology, and Conclusion).
  - *Member 2:* Authored Chapters 2, 3, and 7 (Literature Review, Requirements, and SDG Impact).
  - *Member 3:* Authored Chapters 5 and 6 (Implementation, Testing, Results, and Benchmark Performance).
- **Final Outcome:** Ready for offline panel presentation and live defense.

---

## 3. Guide Verification & Signature Sheet

| Milestone Review | Date | Guide Remarks & Observations | Guide Signature |
| :--- | :--- | :--- | :--- |
| **Milestone 0 Review** | 24/08/2026 | Group formed; scope validated against SDG 11 & 13. Approved. | ____________ |
| **Milestone 1 Review** | 16/10/2026 | Comprehensive requirements and causal methodology verified. | ____________ |
| **Milestone 2 Review** | 28/11/2026 | Live MVP demonstrated; 15 unit tests passing; high technical rigor. | ____________ |
| **Pre-Final Viva Draft**| __/__/2026 | Draft report structure checked against Section 12 format. | ____________ |

---
*End of Project Log Diary.*
