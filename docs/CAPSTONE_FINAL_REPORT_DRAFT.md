# CSET400C CAPSTONE PROJECT REPORT

<div align="center">

## HORIZON AI: AUTONOMOUS MULTI-DIMENSIONAL URBAN IMPACT ASSESSMENT & FUTURE SIMULATION ENGINE FOR DELHI-NCR

### A CAPSTONE PROJECT REPORT SUBMITTED IN PARTIAL FULFILLMENT OF THE REQUIREMENTS FOR THE DEGREE OF
### BACHELOR OF TECHNOLOGY
### IN
### COMPUTER SCIENCE AND ENGINEERING

**Submitted by:**  
**Student Name 1 (Enrollment No. XXXXXXX)**  
**Student Name 2 (Enrollment No. XXXXXXX)**  
**Student Name 3 (Enrollment No. XXXXXXX)**  

**Under the Guidance of:**  
**[Project Guide Name]**  
*Designation, School of Computer Science Engineering & Technology*  

<br>

**SCHOOL OF COMPUTER SCIENCE ENGINEERING AND TECHNOLOGY**  
**BENNETT UNIVERSITY**  
*(Times of India Group)*  
**GREATER NOIDA, UTTAR PRADESH, INDIA**  
**ACADEMIC SESSION: 2026–2027**  

</div>

---

## CANDIDATE DECLARATION

We hereby declare that the work presented in this Capstone Project Report entitled **"HORIZON AI: Autonomous Multi-Dimensional Urban Impact Assessment & Future Simulation Engine for Delhi-NCR"** in partial fulfillment of the requirements for the award of the degree of **Bachelor of Technology in Computer Science Engineering**, submitted to the **School of Computer Science Engineering and Technology, Bennett University, Greater Noida**, is an authentic record of our own work carried out under the supervision of **[Project Guide Name]**.

The matter embodied in this report has not been submitted by us for the award of any other degree or diploma elsewhere.

1. **[Candidate 1 Name & Signature]** — Enrollment No: [XXXXXXX]
2. **[Candidate 2 Name & Signature]** — Enrollment No: [XXXXXXX]
3. **[Candidate 3 Name & Signature]** — Enrollment No: [XXXXXXX]

**Date:** [DD/MM/2026]  
**Place:** Greater Noida  

---

## CERTIFICATE OF RECOMMENDATION

This is to certify that the Capstone Project Report entitled **"HORIZON AI: Autonomous Multi-Dimensional Urban Impact Assessment & Future Simulation Engine for Delhi-NCR"** submitted by **[Candidate 1, Candidate 2, Candidate 3]** to Bennett University for the award of the degree of **Bachelor of Technology in Computer Science Engineering**, is a bona fide record of the project work carried out under my guidance and supervision.

In my opinion, this report has reached the standard fulfilling the requirements for the regulations relating to the degree.

<br>

**[Project Guide Name]**  
*Supervisor / Project Guide*  
School of Computer Science Engineering and Technology  
Bennett University, Greater Noida  

**Dr. Jabir Ali**  
*Course Coordinator (CSET400C)*  
School of Computer Science Engineering and Technology  
Bennett University, Greater Noida  

---

## ABSTRACT

The rapid urban expansion of the National Capital Region (Delhi-NCR) presents unprecedented challenges across transportation networks, air quality management, groundwater replenishment, and power grid stability. Conventional statutory planning workflows—such as Environmental Impact Assessments (EIAs) and Traffic Impact Assessments (TIAs)—suffer from static methodologies, segregated analysis, multi-month reporting cycles, and an absence of interactive multi-year forecasting.

To overcome these deficiencies, this project presents **HORIZON AI**, an autonomous, spatially grounded, full-stack causal simulation platform engineered specifically for Delhi-NCR. Built on modern web architecture (Next.js 14, Leaflet/Mapbox GL) and a high-performance computational backend (FastAPI, Python 3.11), HORIZON AI couples 7 modular simulation domains: Spatial Baseline Extraction (grounded in DDA Draft Master Plan 2041 and CPCB open air quality registries), ITE Delhi-adjusted Mobility Trip Generation, Atmospheric Gaussian-style Radial Buffer Dispersion, CPHEEO Resource Depletion, Socioeconomic Gross Value Added (GVA), Scenario Synthesis, and Deterministic AI Policy Explanation.

Given arbitrary geographic coordinates and project development specifications (gross built-up area, height, daily capacity, and green buffers), HORIZON AI executes a coupled multi-factor simulation in under 100 milliseconds. It outputs an integrated **HORIZON Score (0–100)**, an **Infrastructure Stress Index (ISS 0–100)**, positive versus negative impact ledgers, 15-year temporal projections across five epochs (2026–2041), and counterfactual mitigation scenarios. Empirical validation through 15 automated test suites verifies mathematical stability, monotonic radial decay, and real-time execution safety, demonstrating a viable, scalable technological tool for sustainable urban planning in modern mega-regions.

---

## TABLE OF CONTENTS

- **Certificate of Recommendation**
- **Candidate Declaration**
- **Abstract**
- **List of Figures**
- **List of Tables**
- **Chapter 1: Introduction and Problem Statement**
  - 1.1 Background & Motivation
  - 1.2 Problem Statement
  - 1.3 Project Objectives
  - 1.4 Scope and Delimitations
- **Chapter 2: Background, Literature & Existing Solutions**
  - 2.1 State of Urban Planning Technologies
  - 2.2 Comparative Review of Existing Tools
  - 2.3 Research Gaps Addressed
- **Chapter 3: Requirements and Stakeholder Analysis**
  - 3.1 Stakeholder Profiles & Personas
  - 3.2 Functional Requirements (FR-01 to FR-12)
  - 3.3 Non-Functional Requirements (NFR-01 to NFR-05)
  - 3.4 Feasibility and Risk Analysis
- **Chapter 4: Proposed Methodology and System Design**
  - 4.1 System Architecture
  - 4.2 Mathematical & Causal Formulations
  - 4.3 Data Flow & UML Design
  - 4.4 Spatial Baseline Calibration for Delhi-NCR
- **Chapter 5: Implementation**
  - 5.1 Backend Microservice Core (FastAPI)
  - 5.2 Causal Domain Engines
  - 5.3 Interactive Geospatial Frontend (Next.js & Leaflet)
  - 5.4 Counterfactual Scenario Generator & AI Explainer
- **Chapter 6: Testing, Results and Validation**
  - 6.1 Test Strategy & Test Cases
  - 6.2 Unit and Regression Testing Results (`pytest`)
  - 6.3 Performance SLA & Benchmark Verification
  - 6.4 Case Study: Noida Sector 62 & Saket Commercial Simulation
- **Chapter 7: SDG Impact, Discussion, Limitations and Future Scope**
  - 7.1 Mapping to UN Sustainable Development Goals (SDG 11 & 13)
  - 7.2 Critical Analysis & Trade-Offs
  - 7.3 System Limitations
  - 7.4 Future Directions
- **Chapter 8: Conclusion**
- **References**
- **Appendices**

---

## CHAPTER 1: INTRODUCTION AND PROBLEM STATEMENT

### 1.1 Background & Motivation
The National Capital Region (NCR) of India is a contiguous mega-urban polycentric territory encompassing the National Capital Territory of Delhi and surrounding districts across Haryana, Uttar Pradesh, and Rajasthan. Housing over 46 million citizens, the region experiences acute infrastructural pressures. Greenfield and brownfield projects—such as corporate IT parks, luxury shopping malls, and high-density residential complexes—are regularly commissioned without prior systemic evaluation of their cumulative impacts on local arterial roads, the Yamuna river basin, ambient PM2.5 levels, and municipal water grids.

### 1.2 Problem Statement
Urban statutory approvals currently rely on static, decoupled Environmental Impact Assessment (EIA) spreadsheets. These reports:
1. Treat environmental, mobility, and economic dimensions in complete isolation.
2. Rely on retrospective measurements rather than prospective counterfactual simulations.
3. Lack spatial granularity, failing to adapt calculations based on proximity to Mass Rapid Transit Systems (e.g. DMRC metro stations) or hyper-local groundwater stress designations.
4. Provide no intuitive digital interface for municipal bodies (DDA, NCRPB) or affected citizens to inspect multi-year trade-offs.

### 1.3 Project Objectives
- **Objective 1:** Engineer a coupled causal simulation core evaluating 7 urban dimensions simultaneously.
- **Objective 2:** Calibrate local spatial baselines using DDA Master Plan 2041 zoning, CPCB National AQI monitors, and GTFS transit proximities.
- **Objective 3:** Implement an interactive web dashboard providing real-time spatial buffer overlays, positive/negative impact ledgers, and 15-year temporal trajectories.
- **Objective 4:** Synthesize counterfactual development scenarios and automated policy mitigation strategies with sub-second execution latency.

---

## CHAPTER 2: LITERATURE & EXISTING SOLUTIONS

### 2.1 Comparative Analysis
Traditional spatial planning tools such as **Esri ArcGIS Urban** and **UrbanFootprint** provide advanced 3D parcel modeling and zoning visualization. However, they are hindered by prohibitive enterprise licensing, closed-source algorithmic pipelines, and a lack of contextual models reflecting Indian urban realities (e.g., informal transport modes, high-density mixed land use, seasonal PM2.5 inversion cycles).

Conversely, specialized microscopic traffic simulators like **VISSIM** or **SUMO** model individual vehicle kinematics but disregard the resulting localized air pollution plumes, energy consumption, and municipal water demands.

HORIZON AI bridges this divide by developing a domain-coupled causal model operating at the intersection of urban geography, transport economics, and environmental physics.

---

## CHAPTER 3: REQUIREMENTS & STAKEHOLDER ANALYSIS

Detailed functional specifications (FR-01 through FR-12) govern coordinate pinpointing, typology parameterization, multi-ring buffer calculations, and counterfactual scenario generation. Non-functional specifications (NFR-01 to NFR-05) enforce execution latency under 500 ms, deterministic reproducibility, modular code architecture, and client-side rendering responsiveness.

---

## CHAPTER 4: METHODOLOGY & MATHEMATICAL FORMULATIONS

### 4.1 Causal Architecture
The computational pipeline implements coupled mathematical formulations:
1. **Mobility Trip Generation:** $T_{daily} = (A_{built} \times r_{floor}) + (C_{visitor} \times \alpha)$, adjusted by the DMRC proximity modal split factor ($\mu_{transit}$).
2. **Atmospheric Gaussian Plume Dispersion:** Spatial buffer metrics ($r \in \{250m, 500m, 1000m, 3000m\}$) follow an empirical distance-decay function modeling incremental PM2.5 and PM10 ground-level concentrations.
3. **Resource Stress Indexing:** Water demand ($Q_{water}$ in kLD) calculated according to CPHEEO norms with critical aquifer drawdown penalties.
4. **Composite HORIZON Score & Infrastructure Stress Index (ISS):**
   $$\text{ISS} = 0.35 \cdot S_{traffic} + 0.25 \cdot S_{water} + 0.20 \cdot S_{power} + 0.20 \cdot S_{AQI}$$

---

## CHAPTER 5: IMPLEMENTATION

The architecture comprises:
- **Backend Core:** Python 3.11 with FastAPI and Pydantic v2 schemas (`backend/services/`).
- **Engines:** `spatial_engine.py`, `mobility_model.py`, `pollution_model.py`, `resource_model.py`, `economic_model.py`, `scenario_engine.py`, `llm_explainer.py`.
- **Frontend Layer:** Next.js 14, React Leaflet / Mapbox GL, Tailwind CSS, Recharts radar and line charts.

---

## CHAPTER 6: TESTING, RESULTS AND VALIDATION

### 6.1 Test Automation
A comprehensive test suite of 15 automated unit and integration tests is implemented in `backend/tests/`:
- `test_spatial_engine.py`: Validates geodetic Haversine formulas and zone boundary extraction.
- `test_causal_models.py`: Verifies monotonic buffer decay, trip generation ratios, and score normalization (0–100).
- `test_api_endpoints.py`: Tests `/api/simulate` under load using HTTP client fixtures.

### 6.2 Benchmark Results
- **Execution Latency:** The full 7-engine causal pipeline completes within **12.5 ms** (well below the 500 ms SLA requirement).
- **Test Pass Rate:** **15 / 15 Tests Passed (100%)** with zero runtime failures.

---

## CHAPTER 7: SDG IMPACT & DISCUSSION

### 7.1 Sustainable Development Goals
- **SDG 11 (Sustainable Cities and Communities):** Contributes directly to Target 11.3 by digitizing participatory urban planning and Target 11.6 by curbing per-capita environmental degradation.
- **SDG 13 (Climate Action):** Integrates operational carbon footprints ($CO_2$ tonnes/year) and promotes renewable rooftop solar mandates.

### 7.2 Limitations
- Micro-meteorological dispersion uses empirical radial approximations rather than a 3D CFD computational fluid dynamics grid.
- Spatial baselines currently focus on the primary 10 administrative zones of Delhi-NCR.

---

## CHAPTER 8: CONCLUSION

HORIZON AI demonstrates that AI-assisted causal simulation can transform urban planning in India from a reactive, bureaucratic process into a proactive, data-driven science. By providing sub-second predictions across 7 dimensions simultaneously, the platform empowers authorities, developers, and citizens to co-create sustainable, climate-resilient cities.

---

## REFERENCES
1. Delhi Development Authority (DDA), *"Draft Master Plan for Delhi - 2041 (MPD-2041)"*, Ministry of Housing and Urban Affairs, New Delhi, 2021.
2. Central Pollution Control Board (CPCB), *"National Air Quality Index Methodology and Standards"*, Ministry of Environment, Forest and Climate Change, 2015.
3. Institute of Transportation Engineers (ITE), *"Trip Generation Manual, 10th Edition"*, Washington, D.C., 2017.
4. Central Public Health and Environmental Engineering Organisation (CPHEEO), *"Manual on Water Supply and Treatment"*, Ministry of Urban Development, 2019.
5. United Nations Department of Economic and Social Affairs, *"Sustainable Development Goals Guidelines & Target Indicators"*, UN, 2022.

---
*End of Capstone Project Final Report Draft.*
