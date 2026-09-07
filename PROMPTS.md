**Name:** Shantanu Sawant
# TutorSlot — Prompt Log

## Prompt 1 — Initial Product Build

**Prompt sent:**

**ROLE:** You are a senior front-end developer building a React web app.

**GOAL:** Build the front end of **TutorSlot**, a web product for **students who need to book a tutoring session during the current week**. Their job on this product is **to find an available tutor slot, book it, and see that booking in their week**.

Screens:

1) **Find a Tutor:** Show available tutors and their tutoring slots for this week. The student can select one available slot and book it. They know it worked when the selected slot is shown as booked/confirmed.

2) **My Week:** Show the student's weekly schedule. The tutoring session they just booked appears on the appropriate day and time as a confirmed appointment.

**OUTPUT:** A running app. Keep every invented value in **ONE data file of its own**, with at least **6 tutor rows**, so the screen looks real. The data file should contain invented tutor names, subjects, descriptions, dates and times. Use one component per screen or major section. Move between screens without reloading the page. Readable and usable on a phone at arm's length. The booking interaction should update the My Week screen immediately. When you are done, list the files you created and what each one holds.

**GUARDRAILS:** Screens and invented data only. Do **NOT** call the Gemini API or any other model. Do **NOT** call any outside service or fetch from any URL. No backend, no database, no login, no user accounts, no analytics, and no API keys. No real company's name, logo, trademark, institution, tutor or student names. Invented names, dates, times and numbers only. Do not use live data. No features I did not list. Do not reload the page when moving between screens or booking a slot.

**CONTEXT:** Individual Problem Set 1 for MGMT 6110 Human-AI Collaboration at SMU. **Google AI Studio is only the app-building station at this stage.** The app will later be kept and controlled in GitHub and hosted on Vercel. Built in Google AI Studio and opened on a phone by classmates in Week 3. I am not a programmer: when you make a choice I did not specify, say so in one line rather than burying it.

**What came back:**

AI Studio produced a functional two-screen app with 7 tutors, available tutoring slots, booking confirmation, and a “My Week” screen. I was able to select and book a tutoring slot from the “Find a Tutor” page, and the booked session appeared correctly in “My Week.” It also introduced additional features that I had not requested, such as day filters, tutor ratings, an academic class timetable, and cancellation functionality.

**What changed next and why:**

I noticed that the academic class timetable was outside my specified scope. I therefore asked AI Studio to remove the academic timetable while keeping the tutoring booking functionality unchanged.


## Prompt 2 — Remove Academic Class Timetable

**Prompt sent:**

Do remove the ‘ECON 201: Intermediate Micro Lecture’, ‘MATH 240: Linear Systems & Matrices’ etc from “My Week” page. Only keep the lectures which I add from “Find a Tutor” page in “My Week” page.

**What came back:**

AI Studio initially reported that the academic timetable had been removed, but the preview still displayed the academic class entries. After checking the preview, I determined that the requested change had not yet appeared correctly in the visible app.

**What changed next and why:**

I tested the actual preview rather than relying only on AI Studio's completion message and repeated the removal request so that “My Week” would contain only tutoring sessions.


## Prompt 3 — Remove Saturday

**Prompt sent:**

Remove Saturday from the “Find a Tutor” page. Students should only see tutoring slots from Monday through Friday. Keep all existing tutors, subjects, descriptions, booking functionality, and the My Week page unchanged. Change nothing else.

**What came back:**

AI Studio successfully removed Saturday from the “Find a Tutor” page and also removed the Saturday tutoring slots from the tutor listings. The removal of the Saturday slots was not explicitly specified in the prompt, but it was a logical implementation of limiting available tutoring days to Monday through Friday.

**What changed next and why:**

I checked the updated tutor listings and confirmed that only Monday–Friday slots were displayed. The result matched the intended weekday-only tutoring experience, so I moved on to the next requirement.


## Prompt 4 — Update the Booking Week

**Prompt sent:**

Update the TutorSlot booking week to the current week, Monday September 7 through Friday September 11, 2026. Update all displayed dates for the available tutoring slots and the My Week screen to match this week. Keep the existing tutors, subjects, descriptions, times, rooms, weekday availability, booking functionality, and screen layout unchanged. Change nothing else.

**What came back:**

AI Studio successfully updated the booking window to September 7–11, 2026. The dates in the header and the individual tutor time slots were updated consistently.

**What changed next and why:**

I checked the overall booking window and the individual tutoring slots and confirmed that the dates were consistent with the current week. No further change was needed for this requirement.
