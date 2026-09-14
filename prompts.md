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

Problem Set 2 — Week 3: Live Data and Backend

Claim Audit and Decision

TutorSlot previously showed “17 open slots available” as a hard-coded number. This was not supported by a real tutor calendar or booking database, so I decided not to present it as live. I removed the unsupported claim.

Instead, I added one clearly useful, truthful live-data feature: the short-term City weather forecast for students travelling to an in-person tutoring session at SMU. The source is Singapore’s official two-hour weather forecast service at data.gov.sg. I first opened the endpoint by hand and confirmed that the response contains data.items[0].forecasts, including an entry with area: "City" and a forecast value.

Prompt 5 — Add Live City Weather

Prompt sent:

Extend the existing TutorSlot project without redesigning or removing the current booking interface. Add a live-weather section for students planning an in-person tutoring session at SMU. Create a Vercel backend route at /api/weather; the browser must call only this route, not the Singapore provider directly. Fetch the official Singapore two-hour weather forecast, extract only the City forecast, valid time period, and update time, and show loading, empty-result, provider-error, and network-error messages. Cache the result because the provider has a shared rate limit. Also create /api/health.

What came back:

AI Studio added a City-weather card and created initial weather and health routes. The card showed the forecast and the valid time period while preserving TutorSlot’s tutor listings, booking flow, filters, and My Week screen.

What I did with it:

I did not rely only on AI Studio’s completion message. I inspected the new files and found that the first version used TypeScript route files and that the health route reported “ok” even when it had not verified the upstream provider. I used the professor’s backend checklist to identify these problems before deployment.

Prompt 6 — Correct and Harden the Backend

Prompt sent:

Correct the Week 3 backend without redesigning TutorSlot. Use api/weather.js and api/health.js at the project root beside package.json, not inside src. Remove the unsupported “17 open slots available” badge. The weather route must fetch the official Singapore two-hour forecast only from the server, check response.ok before parsing, return only City, forecast, valid period, and update timestamp, and cache successful replies with Cache-Control: s-maxage=1800, stale-while-revalidate=3600.

The health route must report keyConfigured: "not-required" because the chosen public weather source needs no credential. It must also state whether the provider answered and include the upstream HTTP status. The screen must use four distinct messages for loading, empty City data, provider refusal/rate limit, and provider/network failure. Add the required Singapore Open Data Licence attribution.

What came back:

AI Studio moved the backend functions to root-level JavaScript files, removed the unsupported availability badge, added source attribution, and added the four user-facing states.

What I did with it:

I checked the actual code rather than accepting the summary. I verified that api/weather.js and api/health.js were beside package.json. I also checked that the weather route used the correct official endpoint, checked response.ok, returned only the required fields, and set the specified cache header.

Prompt 7 — Make Health Status Honest

Prompt sent:

Correct api/health.js so that it returns status: "ok" only when the provider answers with a 2xx status, status: "degraded" for a non-2xx upstream reply, and status: "unavailable" when the provider cannot be reached. Return upstreamStatus: "unreachable" rather than null when there is no provider response. Return HTTP 200 only for a healthy provider and HTTP 503 otherwise. Do not expose internal error details.

What came back:

AI Studio updated the health route to distinguish healthy, degraded, and unavailable states while keeping the public-service value keyConfigured: "not-required".

What I did with it:

I inspected the updated route in the Code tab. I confirmed that it reported the provider’s HTTP status, used unreachable when there was no answer, and returned HTTP 503 when the upstream service was not healthy.

Deployment and Verification

I pushed the completed update to the existing TutorSlot GitHub repository and verified that the root-level api folder appeared in the public repository. Vercel deployed the update successfully.

I then tested the live backend before relying on the screen:

/api/health returned status: "ok", keyConfigured: "not-required", providerAnswered: true, and upstreamStatus: 200.

/api/weather returned only the live City forecast fields: area, forecast, valid period, and update time.

The live TutorSlot page displayed the current City forecast and the required Singapore Open Data Licence attribution.

No API key, credential, database, or login was used because the selected government weather service is public. The browser calls TutorSlot’s /api/weather route; the serverless function makes the external provider request.


I checked the overall booking window and the individual tutoring slots and confirmed that the dates were consistent with the current week. No further change was needed for this requirement.

Manual Review and Correction

One correction did not work as reported. AI Studio stated that the weather route had been fixed, but I checked the actual file rather than accepting the summary. I found that the provider URL and formatting still needed verification.

At that point, I stopped relying on the agent’s completion message alone. I manually reviewed and replaced the relevant route code in the AI Studio Code tab, then checked the live Vercel endpoints after deployment.


The live /api/health response confirmed status: "ok", providerAnswered: true, and upstreamStatus: 200; /api/weather returned the live City forecast.