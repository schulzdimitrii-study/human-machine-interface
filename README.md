# Inatel App - Job Candidacy Module
### Human-Machine Interface Course Project | Inatel

---

## 📌 Project Justification & Persona
The **Job Candidacy Module** was created native to the **Inatel App** to solve the pain points of the persona **Lucas Andrade** (21, Software Engineering student at Inatel). 

* **The Problem:** Generic hiring platforms (such as LinkedIn or Gupy) list jobs from all over the country without specific filters for Inatel students or local companies in Santa Rita do Sapucaí, causing high cognitive load and search friction.
* **The Solution:** A secure, native in-app internship board displaying curated institutional vacancies. It integrates directly with the student's profile data, automatically pre-populates application forms, and manages candidacies within the Inatel ecosystem.

---

## 📖 User Story

> **"As Lucas, I want to view and apply for internship and job opportunities directly through the Inatel App, so that I can access curated, profile-relevant vacancies without having to leave the institution's digital ecosystem."**

| Field | Content |
|---|---|
| **As** | Lucas Andrade — Software Engineering student in the 5th period |
| **I want** | To view internship/job openings filtered by course, period, and area of interest, and apply directly through the app |
| **So that** | I can easily find opportunities relevant to my profile in an agile manner, without fragmenting my routine across multiple platforms |

---

## 🌳 Hierarchical Task Analysis (HTA)
**Goal: Apply for an internship vacancy through the Inatel App**

```
0. Apply for an internship vacancy through the Inatel App
   Plan: 1 > 2 > 3 > 4
   
   ├── 1. Access the "Mercado de Trabalho" Section (Menu / Bottom Nav)
   │       Plan: 1.1 > 1.2
   │   ├── 1.1. Open the Inatel App
   │   └── 1.2. Click on the "Vagas" icon in the navigation bar
   │
   ├── 2. Search for Relevant Vacancies
   │       Plan: A / B (Alternate)
   │   ├── A. Apply filters (Course, Period, Modality)
   │   └── B. Keyword text search (with typo tolerance)
   │
   ├── 3. Analyze and Select a Vacancy
   │       Plan: 3.1 > 3.2
   │   ├── 3.1. Read vacancy details (requirements, salary, hours, about company)
   │   └── 3.2. Decide on application (A: Apply / B: Bookmark/Save for later)
   │
   └── 4. Complete the Candidacy Flow
           Plan: 4.1 > 4.2 > 4.3
       ├── 4.1. Confirm pre-filled academic profile details and customize skills
       ├── 4.2. Attach resume (saved CV, local PDF upload, or auto-generate CV)
       ├── 4.3. Submit application, obtain protocol ID, and receive confirmation
```

---

## 🔄 Information Flow & Class Structure (UML)
The domain logic is fully implemented using clean JavaScript classes aligned with the UML specifications:

* **[AlunoCandidato](file:///Users/schulzdimitrii/Documents/GitHub-Projects/human-machine-interface/js/models.js#L3)**: Models the logged-in student, managing their registration data, skill list, and saved resume path.
* **[VagaEstagio](file:///Users/schulzdimitrii/Documents/GitHub-Projects/human-machine-interface/js/models.js#L42)**: Models the internship opening details.
* **[Candidatura](file:///Users/schulzdimitrii/Documents/GitHub-Projects/human-machine-interface/js/models.js#L58)**: Tracks individual application transactions, handling status updates and submission timestamps.
* **[GerenciadorCandidaturas](file:///Users/schulzdimitrii/Documents/GitHub-Projects/human-machine-interface/js/models.js#L81)**: Manages candidate validation, auto-generates unique protocol numbers, increments application counts, and triggers notifications.

---

## 📱 Wireframe & Screens
1. **Header Navigation:** Includes back buttons, clear contextual screen titles ("Vagas de Estágio" / "Detalhes da Vaga: Backend"), and quick save/apply shortcuts.
2. **Main Jobs Grid:** Lists available internship cards with key information (Title, Company, Modality, Salary, Badge status) and action buttons.
3. **Bottom Navigation Menu:** Persistent bottom bar for mobile screens containing:
   * **Início:** Dashboard home.
   * **Vagas:** Active job listings board.
   * **Notificações:** Displays in-app status notifications.
   * **Perfil:** Opens a slide-up form to edit student profile information.
4. **Multi-Step Candidacy Modal:**
   * **Step 1:** Confirm pre-filled academic profile info and add specialized skill tags.
   * **Step 2:** Choose to use a saved CV, upload a local PDF file, or auto-generate a structured text resume from academic data.
   * **Step 3:** Animated success confirmation screen showing the candidacy protocol ID and institutional email delivery confirmation.

---

## ✨ Implemented Differentials (Simulations)
* **Data Input Simulation:** The **Perfil** tab allows fully updating Lucas's profile (Name, Matrícula, Período, Curso, Skills) and uploading files, which dynamically syncs across the rest of the application.
* **Real-time Processing:** Submitting a candidacy updates the vacancy's status to "Candidatado" (persisted locally), generates an application protocol, and increments candidacy statistics.
* **Rich User Feedback:** Features mock notification badges on the bottom nav, slide-up notification logs, success dialogues, and a notification layout simulating emails sent to your `@inatel.br` address.
* **Quality & Polish:** Built with HSL-themed variables, responsive media layouts, glassmorphic blur overlays, animated modal slide-ups, and Material Symbol iconography.

---

## 🧪 Automated Testing
Run the automated test suite directly in Node.js to verify the model logic and workflows:
```bash
node js/tests/testRunner.js
```
