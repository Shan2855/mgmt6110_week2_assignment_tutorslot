**Name:** Shantanu Sawant

TutorSlot Notes

1) Who are your users, and what changes for them?
My users are external users: students who need to book a tutoring session during the current week. For this prototype, I designed TutorSlot for an individual student using the product on a phone or desktop. Their main job is to find an available tutor, book a suitable time slot, and confirm the appointment.
Without TutorSlot, a student would need to:
1.	Find information about available tutors. 
2.	Check which tutoring slots are available. 
3.	Choose a suitable day and time. 
4.	Make the booking and also need to remember the weekly class schedule.
TutorSlot brings these steps together into two screens. On “Find a Tutor,” the student can see available tutors and their tutoring slots in one place and book a suitable slot. The booking then appears automatically on “My Week” on the correct day and time.
Therefore, TutorSlot removes the need to separately track the appointment and makes the process simpler.
Find an available slot → Book the slot → See the confirmed appointment in My Week.

2) Augmented capacity and constrained capacity
Augmented 
AI allowed me to build a functional React prototype with two screens, seven tutors, booking functionality, and a working application flow without manually writing the underlying code. It enhanced my ability to ship product significantly faster. I also do believe having at least core fundamental knowledge of the underlying code or technical functionalities will make my skillset even better. 
Additionally, AI also added new features by itself without me specifically mentioning. Like day filters, ratings and review, cancel lecture option, etc which I found to be great and very much insightful.
Constrained
I think from a constrained point of view, if there was a deeply technical concept, it would be difficult for me to understand the same and it’s core use in building the product or app. 
After prompt 1 i.e. master prompt, I identified an issue, it automatically added entire class schedule for already registered lectures in “My Week” page for the respective student. I tried to remove the same in next prompt but it failed twice, but for some reason it worked the third time. This made me realise that if I did have the underlying coding capabilities I might have resolved the error a lot faster.
Another constraint I realised is, because of AI, it becomes difficult to come up with original ideas by yourself for the product you want to build. Extreme over dependence on AI might reduce my critical thinking ability.

3) In the loop, on the loop, out of the loop where was your judgment actually needed?

My judgment clearly changed the outcome when I noticed that AI Studio had added an academic class timetable that was outside my specification. I specifically asked it to remove entries such as “ECON 201: Intermediate Micro Lecture” and “MATH 240: Linear Systems & Matrices” and to keep only tutoring sessions added through “Find a Tutor.” The first attempted change did not appear correctly in the visible preview, so I checked the actual result rather than accepting the tool’s completion message. I then repeated the requirement until the visible product matched the intended behaviour. This was a genuine point where human judgment was needed.

There were also moments where I was nominally in the loop but my contribution was limited. When AI Studio reported that a change had been completed, I initially had to rely on its description before checking the preview carefully. The timetable problem demonstrated why being told that something is complete is not the same as actually verifying it.

For a real TutorSlot product, I would put routine display of already-approved, invented availability largely out of the loop once the data and rules had been validated. This would require automated tests confirming that only valid Monday–Friday slots appear, bookings appear in the correct day and time, and no booking can create an invalid schedule entry. I would keep a human in the loop for decisions that affect a student’s actual appointment, such as changing or cancelling a confirmed booking, because the stakes and consequences are higher and the affected user bears the error.

4) What did it build that you never sketched?

The clearest difference was the amount of functionality AI Studio added beyond my original sketch. I asked for two screens focused on finding a tutor, booking a slot, and seeing the booking in “My Week.” AI Studio additionally created day filters, tutor ratings and review counts, cancellation functionality, and an academic class timetable.
I noticed the academic timetable during the build rather than only in retrospect. It was particularly useful because it showed me that a polished interface is not necessarily a correctly specified interface. The timetable looked plausible, but it represented a different product purpose from the one I had defined. I therefore removed it rather than accepting it simply because it made the screen look more complete.

There was also an example where the model was right beyond my literal instruction. When I asked it to remove Saturday from “Find a Tutor,” it also removed the Saturday tutoring slots from the tutor listings. I had not explicitly stated that second action, but it was the logical consequence of making the product Monday to Friday only.
5)  Learning pointers for the organisational context
1. I believe AI must be used by folks in work environments who have a fair understanding of the negative consequences it might have along with a decent knowledge of the underlying coding/technical capabilities.
2. Human verification is of utmost importance. My build showed that AI can add features such as ratings, filters, cancellation, and academic timetable that were never requested by me, which were good add-ons. Similarly, AI Studio reported that the academic timetable had been removed from “My Week” page, but the preview still showed it.
3. Require AI-built projects to retain their if not all but major insightful prompts, respective AI outputs, and human decisions in a controlled log.


6) Week 3 Assessment — Front End and Back End

Criteria for a Good Front End

Criterion

My assessment of TutorSlot

Clear user purpose

Meets. TutorSlot helps a student find a tutor, book a session, and see the booking in My Week.

Honest claims

Improved. I removed the unsupported “17 open slots available” badge rather than falsely presenting it as live.

Useful live information

Meets. The interface now shows the official short-term City weather forecast for students travelling to an in-person session at SMU.

Understandable states

Meets. The weather feature has different messages for loading, no City result, provider refusal/rate limit, and provider/network failure.

Source transparency

Meets. The interface credits the National Environment Agency and Singapore Open Data Licence.

Usability

Meets for the prototype. The weather card is prominent, concise, and understandable on the existing TutorSlot layout.

Criteria for a Good Back End

Criterion

My assessment of TutorSlot

Real external source

Meets. /api/weather fetches Singapore’s official two-hour weather forecast from data.gov.sg.

Server-side connection

Meets. The browser calls TutorSlot’s /api/weather; TutorSlot’s serverless function calls the provider.

Minimal data returned

Meets. The route returns only City, forecast, valid period, and update time instead of the whole provider response.

Error handling

Meets. The implementation separates provider refusal/rate-limit, missing City data, and network failure.

Rate-limit awareness

Meets. The response uses a 30-minute cache with stale-while-revalidate because the provider has a shared rate limit.

Health check

Meets. /api/health checks the upstream provider and reports status, provider response, and upstream HTTP status.

Credential safety

Meets for this selected source. The provider is public and requires no key, so keyConfigured truthfully reports "not-required". No secret was added to GitHub or browser code.

My Product Against These Criteria

TutorSlot now works end to end for its live-weather feature. I verified the deployed Vercel URLs rather than treating the AI Studio preview as proof:

/api/health returned status: "ok", providerAnswered: true, and upstreamStatus: 200.

/api/weather returned a current City forecast, valid period, and provider update time.

The public TutorSlot page displayed that live forecast with source attribution.

A limitation remains: the tutor names, slots, ratings, and bookings are still prototype data managed in the front end. They are not real tutor-calendar data, and I removed the “17 open slots” figure because it could not be supported by this Week 3 provider. A future version would need a real authorised tutor calendar and booking database before presenting availability or booking confirmation as live external facts.

7) Assessment of the Collaboration

1. What did I specify?

I specified the original user, purpose, and basic booking flow for TutorSlot. For Week 3, I selected weather as a relevant live-data feature, chose the official Singapore provider, identified City as the appropriate SMU forecast area, and decided that the unsupported availability badge should be removed rather than made to look live.

2. What did the agent produce?

AI Studio produced the weather-card interface, the two serverless functions, the Vercel-compatible root api folder, loading and error states, caching headers, source attribution, and the changes needed to remove the unsupported availability badge.

3. Where did my judgement matter?

My judgement mattered when I checked whether the product’s claims were supportable. I decided that weather could be sourced but tutor availability could not. It also mattered when I checked the actual files and live deployment instead of accepting AI Studio’s description that the work was complete.

4. What did I verify?

I manually called the official provider before building and checked its real response fields. After deployment, I verified the public GitHub repository, Vercel deployment, /api/health, /api/weather, and the live TutorSlot screen. This confirmed that the back end, rather than only the preview, was functioning.

5. What did the agent get wrong or leave unclear?

The first implementation required review. The initial health route reported an “ok” status without proving that the upstream provider was healthy. I requested a correction so that it reports ok, degraded, or unavailable honestly. This showed that a plausible technical explanation is not enough; the human collaborator must inspect the actual code and behaviour.

6. What is the working division between my command and the agent’s production?

My role was to define the product purpose, decide which claims were defensible, choose the provider, protect user-facing honesty, reject unsupported claims, and verify the deployed result. The agent’s role was to turn those decisions into interface components, serverless functions, route handling, and code. The collaboration worked best when I treated the agent’s output as a proposal to inspect rather than as an authority to accept automatically.

8) Overall Reflection

This assignment changed my understanding of “working product.” In Week 2, TutorSlot needed a usable screen and interaction flow. In Week 3, the product also had to cope with an external provider that could be unavailable, return no useful data, or refuse requests. The most valuable decision was not adding a large feature; it was reducing TutorSlot’s unsupported claim and replacing it with a smaller claim that the product could genuinely support with live data.

