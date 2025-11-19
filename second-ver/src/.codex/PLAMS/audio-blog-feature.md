== EXECUTION PLAN: AUDIO BLOG FEATURE (PART 1 OF 3) ==
This Execution Plan is created following TEMPLATE_PLAN.md.
It will enable a new feature: recording audio in the browser, sending it to a Cloudflare Worker, transcribing the audio via gpt-4o-transcribe, generating an MDX blog article using gpt-4o-mini, and downloading the result locally as a .mdx file.
This is Part 1 of a 3-part ExecPlan.
Parts 2 and 3 will complete the full plan.

== PURPOSE / BIG PICTURE ==

After completing this feature, a user will be able to:

・ Open a dedicated page at the route /blog/new/audio
・ Click a “Start Recording” button to capture microphone audio
・ Stop recording and submit the audio file to an API endpoint (/api/audio-blog)
・ The Worker will transcribe the audio, generate a blog article in MDX format, and return the MDX content to the browser
・ The browser will show a preview and allow the user to download the MDX as audio-{timestamp}.mdx

This feature allows creators to convert spoken recordings into text-based blog articles automatically, removing the need for typing or manual formatting.

The implementation must work entirely locally using wrangler dev for simulation.
Deployment, secrets, and authentication are explicitly out of scope.

== SCOPE AND OUT-OF-SCOPE RESPONSIBILITIES ==

This ExecPlan includes:

・ Implementing the audio recording UI
・ Adding a new page at app/routes/blog/new/audio.tsx
・ Creating a Worker at src/features/audio-blog/worker.ts
・ Creating local-only API fetch logic to call the Worker
・ Generating a YAML-frontmatter MDX article format
・ Returning MDX content to the frontend
・ Implementing a download-as-file function
・ Writing clear instructions for any step requiring future secrets

This ExecPlan does NOT include:

・ Cloudflare authentication (wrangler login)
・ Deployment (wrangler deploy)
・ Creating or modifying environment variables
・ Creating, modifying, or reading Cloudflare secrets
・ API key setup
・ Production database operations
・ Any destructive system-level operation
・ Any steps outside repository boundaries
・ Creating CMS or permanent storage

If such steps would normally be needed, they will be written as human instructions and skipped by the automated agent.

== CONTEXT AND ORIENTATION ==

This project uses Honox (Hono + Vite + Islands architecture).
Relevant parts of the repository:

app/
Contains UI routes, components, layout, styling, and client islands.
Honox uses file-based routing under app/routes/\*, so creating a new page at:
app/routes/blog/new/audio.tsx
will automatically expose the /blog/new/audio route.

src/
Contains application logic not tied to rendering.
src/features/\* contains feature-specific modules.
Worker code for audio processing will be placed at:
src/features/audio-blog/worker.ts

wrangler.jsonc
Defines Worker entrypoints, bindings, and worker routes.
This plan will NOT modify wrangler.jsonc directly (since it may contain secrets or deployment info).
Instead, instructions for the human will be added in Part 2 for the required "add this route to wrangler.jsonc".

public/
Not directly used for this feature.

app/content
Existing MDX-driven blog content.
This feature does NOT edit blog storage logic; download-only operation is used.

Routing Summary:

Frontend Page → /blog/new/audio
API Endpoint → /api/audio-blog (served through Worker)
Worker Source → src/features/audio-blog/worker.ts

== END OF PART 1 ==

== EXECUTION PLAN: AUDIO BLOG FEATURE (PART 2 OF 3) ==
This section describes the detailed “Plan of Work” and “Concrete Steps” needed to implement the audio blog feature.
This is a narrative blueprint of the full implementation.
All steps must follow Out-of-Scope rules: no auth, no deploy, no secrets, local only.

== PLAN OF WORK ==
The implementation will proceed in a sequence of additive steps that gradually build the full audio-to-MDX pipeline.
First, a new route will be created at app/routes/blog/new/audio.tsx. This route will host a page with an audio recorder UI. The UI must be implemented using browser-native MediaRecorder. The page must manage recording state, store the resulting Blob, and allow submitting it to the Worker endpoint.
Second, an API client module will be added under app/lib. This module will expose a function responsible for sending the audio Blob via fetch to the Worker route /api/audio-blog. The function will return the MDX string produced by the Worker.
Third, a Cloudflare Worker will be implemented at src/features/audio-blog/worker.ts. This Worker will accept multipart/form-data containing the audio file. It will forward the raw audio bytes to gpt-4o-transcribe for speech-to-text. After transcription, it will send the text to gpt-4o-mini to generate a formatted MDX article using the YAML-frontmatter template chosen in Part 1. The Worker will respond with the MDX as plain text.
Fourth, the frontend page will incorporate logic to render a preview of the returned MDX string and provide a button that triggers a download action. The download feature will create a Blob of type text/mdx and programmatically click an anchor with the download attribute. The filename will follow the audio-{timestamp}.mdx format.
Fifth, instructions will be provided for the human operator to modify wrangler.jsonc to map the Worker route /api/audio-blog to the Worker module src/features/audio-blog/worker.ts. The automated agent must not edit wrangler.jsonc.
Finally, after all components are connected, the feature will be validated locally using wrangler dev.

== CONCRETE STEPS ==

Create the new route file at app/routes/blog/new/audio.tsx.
This file must export a default function that renders:
・ A page title
・ A “Start Recording” button
・ A “Stop Recording” button
・ A submission button
・ A preview area for the generated MDX
Do not implement the full UI yet; just create the component and placeholders.

In app/lib, create a file named audioBlogClient.ts.
Inside, implement a function named submitAudioBlob.
This function will accept a Blob and perform a fetch POST request to /api/audio-blog with multipart/form-data.
The function must return the MDX text as a string.

In src/features/audio-blog, create worker.ts.
Inside this Worker module:
・ Import Hono
・ Create an app instance
・ Define a POST handler for /api/audio-blog
・ Parse the multipart form
・ Extract the audio file
・ Convert it to ArrayBuffer
・ Prepare the payload for gpt-4o-transcribe
・ Prepare a second call to gpt-4o-mini for MDX formatting
・ Build the MDX frontmatter with date and title
・ Return the MDX as plain text

Note: The agent must not provide real API keys. Instead, leave placeholders and add a comment instructing the human to create secrets after implementation.

Update the Honox entry routing (human instruction only).
Since the automated agent cannot modify wrangler.jsonc, it must instruct the human:
“Add a route mapping /api/audio-blog to src/features/audio-blog/worker.ts in wrangler.jsonc.”
Do not include actual JSON edits.

Return to app/routes/blog/new/audio.tsx and finish the recording UI.
Implement:
・ useState for recording state
・ MediaRecorder setup in useEffect
・ Logic to push recorded audio chunks
・ Logic to stop recording and convert to Blob
・ Call submitAudioBlob with the audio Blob
・ Render the returned MDX and store it in state

Implement the download button.
When clicked, generate a Blob with the MDX content and create an anchor element with the download attribute set to “audio-{timestamp}.mdx”.
Programmatically click the anchor to download the file.

Run wrangler dev.
This must only simulate behavior.
The agent must provide sample expected output such as:
[example: Worker running at http://localhost:8787]
But must not attempt to deploy.

Manually test the pipeline:
・ Visit /blog/new/audio
・ Press Start Recording
・ Speak for 3–5 seconds
・ Press Stop
・ Press Convert
・ Confirm the MDX preview appears
・ Press Download to save the .mdx file

== END OF PART 2 ==

== EXECUTION PLAN: AUDIO BLOG FEATURE (PART 3 OF 3) ==
This section completes the Execution Plan by providing Validation, Idempotence and Recovery, Artifacts and Notes, Interfaces and Dependencies, and the Outcomes and Retrospective.
This is the final part of the audio-blog-feature ExecPlan.

== VALIDATION AND ACCEPTANCE ==

Validation must demonstrate the feature’s behavior entirely in a local environment using wrangler dev and the Honox dev server.
No deployment or authentication may be used.

Validation Steps:

Start the local development environment.
In the project root, run:
pnpm dev
and in a separate terminal:
wrangler dev
Expected behavior:
The browser application becomes available through Vite at a localhost port (such as 5173).
The Worker becomes available under wrangler at port 8787 or whichever port wrangler prints.

Navigate to the page.
Open the browser and visit:
http://localhost
:<vite-port>/blog/new/audio

Test the recording UI.
Press the Start Recording button.
Speak for a few seconds.
Press Stop Recording.
Visually confirm that the UI indicates recording has ended.

Submit the audio.
Press the button to submit the recording.
The page should show a “Processing…” state until the Worker responds.

Validate Worker behavior.
The Worker should log that it received multipart/form-data.
The Worker should call the transcribe model and then generate MDX.
The Worker should return the MDX string to the frontend.

Verify MDX preview.
The front-end preview area should display the MDX content returned by the Worker.
It should include frontmatter with title and date, followed by sectioned content.

Test the file download.
Press the Download button.
This should trigger saving a file named:
audio-{timestamp}.mdx
Open the file in a code editor to ensure content integrity.

Acceptance Criteria (all must be true):

・ The user can record audio, submit it, receive MDX, preview it, and download it.
・ The MDX file contains valid frontmatter and readable content.
・ All behavior works without deployment (wrangler dev only).
・ No secrets or external credentials are required to run locally.
・ Errors related to missing keys or external configuration do not cause crashes; instead, placeholders or error messages appear.

== IDEMPOTENCE AND RECOVERY ==

The feature must support safe repetition of steps without causing broken states.

Idempotent behaviors required:

・ Recording can be started and stopped multiple times without refreshing the page.
・ Submitting audio multiple times must produce a fresh MDX output each time.
・ Downloading the MDX file repeatedly must not corrupt previous results.
・ The Worker must safely handle repeated requests, including malformed ones.

Recovery instructions:

If audio submission fails due to missing API keys, the Worker must return a clear text error instructing the developer to set the key manually.
If wrangler dev crashes, restarting it must restore all functionality without additional steps.
If the recording UI enters a broken state, refreshing the page must restore the recorder.
If the Worker throws an error, the developer can inspect wrangler logs and retry the submission once keys are configured.

== ARTIFACTS AND NOTES ==

Developers may capture useful reference outputs during implementation.
Examples include:
[example: wrangler log shows “received audio file: 81234 bytes”]
[example: MDX preview shows “--- title: My Audio Post date: 2025-11-16 ---”]
[example: Error display: “Missing OPENAI_API_KEY: please add via wrangler secret put”]

These examples help future contributors understand normal behavior.
They must not contain secrets or configuration values.

== INTERFACES AND DEPENDENCIES ==

Required interface definitions by the end of implementation:

Frontend API Client
File: app/lib/audioBlogClient.ts
Function signature requirement:
[example: export async function submitAudioBlob(blobFile): returns MDX string]

Worker
File: src/features/audio-blog/worker.ts
Worker responsibilities:
・ Accept multipart/form-data
・ Extract audio file
・ Call transcribe model (gpt-4o-transcribe)
・ Call MDX generator model (gpt-4o-mini)
・ Construct YAML frontmatter
・ Return MDX as plain text

Route Page
File: app/routes/blog/new/audio.tsx
Must expose UI elements:
・ Record start
・ Record stop
・ Submit
・ MDX preview
・ Download

Dependencies:
・ Honox routing system
・ Hono for Worker API
・ Vite for development server
・ OpenAI client (key provided only by human operator)

All models and AI interactions must be wrapped so the Worker gracefully handles missing keys.

== OUTCOMES AND RETROSPECTIVE ==

Upon completion of this plan:

・ The system can convert audio recordings into MDX blog articles locally.
・ The implementation respects all Out-of-Scope rules and avoids deployment and authentication requirements.
・ The feature operates fully within wrangler dev and Vite dev.
・ The codebase gains a reusable audio-to-text-to-MDX workflow.
・ The user experience becomes significantly streamlined for blog creation.

Potential future improvements could include:
・ Adding titles automatically based on summary inference
・ Improving prompt quality for structure or tone
・ Allowing the user to edit MDX before download
・ Eventually integrating storage or publication once deployment is allowed

Completion of this plan satisfies the Purpose defined in Part 1 and provides a strong foundation for future enhancements.

== END OF PART 3 ==
