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


Problem Set 4 — Adversarial Collaboration and Revision
Prompt 8 — Skeptical Review of HJ Finding 1: Booking Persistence
Finding being answered: HJ reported that confirmed and paid bookings disappeared after browser refresh. HJ rated this Severity 4 under H1 — Visibility of System Status.
Prompt sent:
ROLE: You are a sceptical senior developer and usability reviewer working in my existing project. Before you write any code, your job is to argue against the repair I propose.
CONTEXT:
- Live address: https://mgmt6110week2assignmenttutorslot.vercel.app/
- TutorSlot is for SMU students and helps them find, review, and book available 1-on-1 tutoring sessions.
- Finding: A reviewer booked sessions, saw them as confirmed, paid for a session, and then refreshed. The bookings and payment state disappeared.
- Heuristic: 1 — Visibility of System Status.
- Screen or system: System.
- Severity: 4 — the app reports a booking/payment as confirmed but does not preserve that state after refresh.
- Proposed repair: persist the minimum booking/payment state needed so that confirmed bookings survive browser refresh and revisit.
GOAL: Argue against my repair. Tell me:
1. Does it solve the problem the finding describes?
2. Does it belong to the screen or system?
3. Name one heuristic this repair could break.
4. Propose the smallest alternative.
5. Tell me exactly how to test it.
OUTPUT: Arguments first, then stop. Write no code until I reply.
GUARDRAILS: Change nothing else. Do not remove Disqus, Microsoft Clarity, the privacy notice, weather functionality, or /api/health.
What came back:
The agent argued that persistence should not be added blindly. It said that localStorage could create stale or confusing demo state, especially on shared browsers, and could reduce H3 — User Control and Freedom if the user had no way to clear the saved state.
It proposed two alternatives:
- Approach A: localStorage persistence plus a clear one-click Reset Demo Data control.
- Approach B: make the prototype explicitly session-only and remove the misleading permanence implied by “confirmed” and “paid”.
It also proposed a live test: create paid and unpaid bookings, hard-refresh, and verify that booking/payment states and slot locks survive.
My decision:
I chose Approach A because the peer evidence showed that users reasonably interpreted “confirmed” and “paid” as persistent states. I instructed the agent to persist only the minimum booking/payment state and add a clearly labelled Reset Demo Data control.
Implementation result:
The agent persisted tutors, schedule and chat-request state using localStorage and added Reset Demo Data.
Commit:
7f0b950 — feat(persistence): add localStorage support for state
How I checked it:
I booked two sessions, paid for one, refreshed the page, and verified that both bookings remained and that the paid/unpaid states were preserved. I repeated the test on the live Vercel deployment.
Prompt 9 — Skeptical Review of HJ Finding 2: Translation-Triggered White Screen
Finding being answered: HJ reported that with browser translation enabled, navigating from My Week back to Find a Tutor could produce a blank white screen with no recovery path. HJ rated this Severity 3 under H9 — Help Users Recognize, Diagnose, and Recover from Errors.
Prompt sent:
ROLE: You are a sceptical senior developer and usability reviewer working in my existing project. Before you write any code, your job is to argue against the repair I propose.
CONTEXT:
- Live address: https://mgmt6110week2assignmenttutorslot.vercel.app
- Who the product is for, and what it does for them: TutorSlot is for SMU students and helps them find, review, and book available 1-on-1 tutoring sessions.
- The finding, in its six lines:
WHERE: TutorSlot, when navigating from My Week back to Find a Tutor while browser translation is active.
WHAT I DID, WHAT I SAW: A reviewer enabled Safari page translation, booked a session, opened My Week, and navigated back to Find a Tutor. The entire app became a white screen and showed no recovery message. With translation off, the same steps worked normally.
HEURISTIC: 9 — Help Users Recognize, Diagnose, and Recover from Errors.
SCREEN OR SYSTEM: Both. The crash is a system problem, while the absence of a recovery message is a screen problem.
SEVERITY: 3 — Major usability problem because the app becomes unusable under browser translation, with no in-app recovery path.
REPAIR: The app should avoid crashing when browser translation modifies the page, and if rendering still fails, show an error state with a route back to My Week or Find a Tutor.
- The evidence behind it: 1 of 3 groupmates raised it and reproduced it with translation enabled.
- The repair I propose: Add the smallest robust error-boundary/recovery behavior needed so a render failure does not leave a blank screen, and avoid translation-sensitive DOM assumptions if they are present.
GOAL: Argue against my repair.
1. Does it solve the problem the finding describes, or a different problem?
2. Does the problem belong to the screen or to the system, and does my repair sit in the right half?
3. Name one heuristic this repair could break while it serves the one above, and how.
4. Propose the smallest alternative that still addresses the reviewer’s observed failure.
5. Tell me exactly what to do on the live address to check that the repair worked.
OUTPUT: Your arguments first, as a numbered list. Then stop. Write no code until I reply with the repair I have chosen.
GUARDRAILS: Change nothing else. Do not remove Disqus, Clarity, the privacy notice, or break /api/health.
What came back:
The agent argued that an Error Boundary alone would only improve the aftermath of the failure, not remove the underlying translation/React DOM collision.
It classified the root failure as system-level and the recovery UI as screen-level.
It also warned that a recovery button could create an H3 — User Control and Freedom problem if the translated page immediately crashed again.
Its proposed smallest repair had two layers:
1. Protect critical dynamic/interpolated text in the affected booking → My Week → Find a Tutor flow from translation-sensitive DOM replacement.
2. Add a lightweight Error Boundary so that an unexpected rendering failure produces a recovery screen instead of a blank page.
My decision:
I accepted the dual-layer repair but explicitly limited it to the critical navigation/dynamic text rather than disabling browser translation across the entire product.
Implementation result:
The agent added targeted translate="no" / notranslate protection to critical dynamic counters and added an Error Boundary around the main application views.
Commit:
5a0c4c8 — feat: add ErrorBoundary and prevent translation bugs
How I checked it:
I enabled Chrome page translation and translated TutorSlot into Chinese. I booked and paid for a class and moved through the relevant screens.
A rendering error could still occur, so the root issue was not fully eliminated. However, instead of a blank white page, TutorSlot displayed a recovery screen with:
- Return to Find a Tutor
- Reload Page
Returning to Find a Tutor worked and the booking remained.
I therefore recorded this as a partial repair, not a full fix.
Prompt 10 — Diagnose and Restore Disqus / Privacy Regression
Why this was needed:
While checking JY’s analytics/privacy observation and preparing the required Disqus replies, I found that the Disqus discussion had disappeared from the live revision. The page ended at the TutorSlot footer.
Prompt sent:
URGENT BUG — DO NOT CHANGE ANYTHING ELSE.
On the current live TutorSlot deployment, the Disqus comments section that previously appeared below the footer is now completely missing. The page currently ends after the TutorSlot footer and Reset Demo Data button.
Inspect the current code and determine exactly why the existing Disqus section is no longer rendering. Restore the same existing Disqus integration/configuration that this project previously used. Do not create a new Disqus site, shortname, thread, or configuration, and do not delete or replace existing comments.
Preserve all current functionality, especially:
- booking/payment localStorage persistence
- Reset Demo Data
- translation protection
- Error Boundary
- Microsoft Clarity
- privacy notice
- weather functionality
- /api/health
First tell me what caused Disqus to disappear and what minimal change you propose. Do not edit any files or write code until I approve.
What came back and what happened next:
The agent first correctly identified that the Disqus container and loader had been omitted, but it then proposed the wrong forum shortname.
I deployed that change and the live site still showed a blank Disqus area.
I then challenged that result and asked the agent to verify the exact old working configuration instead of assuming the new one was correct.
It then identified the existing values as:
- forum shortname: tutorslot-mgmt6110
- identifier: tutorslot-home
- canonical URL: https://mgmt6110week2assignmenttutorslot.vercel.app/
Even after that configuration correction, the thread remained blank.
I then compared the current repository with the last working Disqus version and restored the legacy RGB mount-point styling and loader behaviour that the earlier working version used.
Final restoration commit:
14e4ce4 — fix: restore working Disqus embed styling and loader
How I checked it:
I opened the deployed live page and verified that the original Disqus discussion returned with the existing eight comments.

