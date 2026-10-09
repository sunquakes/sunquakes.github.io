# Anyone can be a full-stack developer now — CLI + SKILL, become a programmer without writing code

Building software used to demand a lot before you ever wrote a line that a user
could see.

Before AI, that was a real door. To build software yourself, you not only
had to know what JSON, Spring Boot, React and Gradle were — you had to actually
learn how to use them: how to install them, configure them and fit them together.
Just the "learning it" part could eat months.

I'm a developer myself and I still couldn't skip it. Every new project, my list
went roughly like this:

- spin up a pnpm workspace and wire Turborepo
- stand up a Spring Boot API while scaffolding a Vue admin app
- throw in a React + Tauri desktop target, then a native Android app
- hand-edit Gradle includes, app dependencies and DI bindings so the phone app
  can reach the backend
- and wrestle with my local JDK / Maven / Android SDK versions, naturally

By the time I was done, days were gone and the product was still just a pile of
config. No user had seen a thing.

After AI, that doesn't mean you need to understand nothing. I've watched
non-technical friends hear a developer say "we just send some JSON back and
forth" and still ask "who's Jason?", convinced he's the new guy on the team.
You still have to know what these things are, what they're for and what a
reasonable ask looks like — you should be able to say "I want a phone app you
can log into, with an API storing the data behind it," and then judge whether
what the AI hands back is actually right. Only one thing changed: you no longer
have to install, configure and write every line by hand. Understand what it is
so you know what to ask for; leave the doing to the AI.

That's why I eventually stopped and built a tool for everyone — so nobody has to
know those details and can just focus on the product.

## What it actually does

One command, `mars`. Tick the platforms you really want and it hands you a working
multi-platform monorepo, with the backend API, admin frontend, desktop and mobile
clients already wired together.

Strictly speaking, it's two things working together: the `mars` command-line tool
plus a skill you hand to an AI agent. The CLI generates the project and installs
the toolchains; the skill tells the agent how each step should be done.

![Creating and running a multi-platform project with mars](/assets/ai/mars-cli-demo.gif)

```bash
pnpm add -g @marsquakes/cli

mars create my-app
cd my-app
mars init
mars dev
```

`mars create` asks which platforms you want, but `mars init` is what actually makes
that real on your machine. It reads the generated `platforms.json` and only installs
the toolchains your ticked platforms need. If web is all you picked, no JDK, no
Maven, no Rust. Want to add a platform three months later? Run `mars init` again —
it's idempotent.

Android, Tauri desktop, the web admin and the API are ready now. iOS, the public
web client and native Windows / Linux / macOS clients are on the way and slot into
the same scaffold when they land.

If you're just skimming, here's the short version of what you get:

- a compiling monorepo in minutes, not the usual week of setup
- ready today: Android, Tauri desktop, web admin and the Spring API, already
  talking to each other
- one `platforms.json` as the single source of truth — no hard-coded paths
- new Android Gradle modules generated and mounted for you, zero hand-edited
  Gradle
- only the toolchains you actually need, installed at versions that work together
- Docker builds for a clean checkout, and bilingual (English / Chinese) output
- coming soon: iOS, the public web client and native Windows / Linux / macOS
  desktop targets — each lights up in the same scaffold the moment it lands

## These days I mostly just talk

The reason I actually wanted to open-source this is that it quietly fixed a
frustrating pattern I kept hitting with AI agents. When an agent derailed, it was
almost never the feature itself. It was the missing plumbing around it. It would
try to add a screen, realize there's no API module, start guessing at the Gradle
wiring, and the next thing you know the build is red. Get the scaffolding and
conventions in place first, and its effort goes where you actually wanted it.

Here's the bit a lot of people miss: I don't even run `mars create` myself. From
the first folder to the final build, I basically only talk to the AI. The setup is
something you do once.

First, the agent. I use OpenAI Codex CLI here.

**macOS / Linux**

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
codex login
```

**Windows (PowerShell)**

```powershell
irm https://chatgpt.com/codex/install.ps1 | iex
codex login
```

Then the skill. A skill is basically a set of instructions you hand the agent once,
so it knows how a job is done instead of guessing. Mine teaches it to install and
verify every toolchain a Marsquakes product needs, at versions that actually work.
You download one ZIP and unpack it into your home folder, where the agent always
looks.

**macOS / Linux**

```bash
curl -LO https://marsquakes.cc/skills/marsquakes-setup.zip
mkdir -p ~/.agents/skills
unzip -o ~/Downloads/marsquakes-setup.zip -d ~/.agents/skills
```

**Windows (PowerShell)**

```powershell
Invoke-WebRequest -Uri https://marsquakes.cc/skills/marsquakes-setup.zip -OutFile marsquakes-setup.zip
$dest = "$HOME\.agents\skills"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Expand-Archive -Path "$HOME\Downloads\marsquakes-setup.zip" -DestinationPath $dest -Force
```

Restart the agent so it picks the skill up, then just ask "do you have a skill for
setting up a Marsquakes environment?" If it can name `marsquakes-setup`, you're
good. I deliberately keep it in the home folder so it's installed once and every
product you build on this machine gets it.

After that there's no scaffolding step I do by hand. I open the agent in an empty
folder and tell it what I'm after:

> Create a product called `my-app` with an Android app, a web client and an API.

It handles the rest in one go. It runs the skill to see what's already there, fills
in any missing baseline tools, and then does the `mars create my-app` / `mars init`
bit itself. Since `init` reads `platforms.json`, it only installs the toolchains
those platforms actually need and derives the Android variant on its own, no
questions for me. When it's done I've got a real, compiling codebase with the rules
already in place. Features in `feature/<name>`, shared logic in `core/<name>`,
network layer attached, `platforms.json` describing what exists. I didn't invent a
structure and I didn't type a single setup command.

When it comes to features, I don't hand over stack traces or file-by-file plans. I
describe the behavior and point it at the conventions already there. A typical
first prompt looks something like:

> Add a "favorites" feature: a heart button on each item that toggles a
> saved state, a favorites list screen reachable from the profile, and
> persistence so it survives restarts. Follow the existing feature-module
> pattern, reuse the design system components, and keep the login and
> network layers as they are.

Because the boundaries are clear, it usually stays on track. Screens go in the
feature layer, shared state in core, it calls the existing repository, and it pulls
colors from the theme instead of hard-coding hex values. When it needs a new
Android module it doesn't touch Gradle by hand. It runs the tool itself, then
builds and runs to check. I don't type either command, I just say what I want and
let it do the equivalent of:

```
mars module add feature:favorites --hilt --compose --mount
mars dev --platform android
```

The module lands in `settings.gradle.kts` and gets mounted in the app, then it
fills in the Compose and Hilt skeleton and makes sure the thing builds.

So the loop is really pretty simple now. I say what I want, it implements across
the stack (screen, state, data, API call) and runs it, and I push back where
something feels off, like "the empty state needs a retry button" or "this should
optimistically update before the network comes back." I steer the product, and the
cross-file grunt work plus the endless rebuilds go to it.

That whole thing with Codex, start to finish:

![Using the scaffolded project with Codex](/assets/ai/ai-codex-demo.gif)

## A concrete example: search

Let me make it tangible. Say the product needs search. Users should find items from
both the phone app and the web, backed by the API. Before this workflow that one
sentence meant an evening of plumbing for me. Now it plays out like this.

All I do is hand Codex the requirement. I don't scaffold modules first or run
anything myself. I describe behavior, not classes, files or commands, and let it
figure out what needs to exist:

> Implement search across the stack.
>
> - Android: a search screen in a new `feature:search` module with a search
>   field at the top, results updating as the user types (debounced 300ms), a
>   loading state, an empty state when nothing matches, and tapping a result
>   opens the existing detail screen.
> - Web: a search bar in the header showing the same results in a dropdown.
> - API: add a paged `GET /api/items/search?q=` endpoint that matches the item
>   title and returns the same item shape the list endpoint already returns.
>
> Create whatever modules this needs, follow the existing feature-module and
> repository patterns, reuse the design system components and the existing
> network client, handle the no-network and error
> cases, and add the API endpoint in the same style as the current item
> controller.

It does the whole job itself. I don't touch a terminal. It scaffolds
`feature:search` through the CLI so the Gradle wiring is right, then fills in the
whole vertical slice, the Compose UI and ViewModel, the web dropdown, the
repository method on the existing client, and the paged endpoint in the
controller. After that it builds and runs itself, roughly the `mars dev`
equivalent, and reports back what works and what's still shaky. I never type a
command, I just look at what it changed and how it runs.

The first pass always misses a few product details, so I just say them out loud:

- "If the query is under 2 characters, don't call the API yet — show a hint."
- "Cache the last search so revisiting the screen doesn't flash a loading bar."
- "The API should return an empty page, not an error, when q is blank."

Each one is another short prompt, it makes the change and re-runs what it needs. I
never had to know the exact Compose modifier, the Spring annotation or the React
hook. I know the behavior I want, the scaffold gives it structure, and the
conventions keep it consistent. I write the feature request as a prompt, and
everything a developer would do next, scaffolding, wiring, building, running,
fixing, is on it.

## Where that leaves "everyone can be full-stack"

"Anyone can code" has been run into the ground, and I don't much feel like piling
on. What I actually believe is narrower and, to me, a lot more interesting: you
don't have to know every layer inside out before you can ship across all of them.

Full-stack used to genuinely mean fluency in the backend, the database, the web
client, desktop builds and mobile builds. Years of very specific wiring knowledge
that barely even carries between projects. Most of it wasn't product thinking. It
was ceremony standing between an idea and a working app.

This tool strips the ceremony out and lets the AI carry the implementation detail.
If you can describe what should happen clearly, say "a user saves an item on their
phone, it hits the API, and it shows up on the web," you can direct that entire
flow without personally knowing the Gradle syntax, the Spring annotation and the
Compose modifier for each piece.

That doesn't make you a bad engineer. It moves your work up a level. The things
that actually matter now are the ones AI can't hand you:

- deciding what the product should really do
- describing intent precisely enough that ambiguity doesn't get built into the code
- judging whether what came out is correct, safe and good to use
- knowing when to question what the agent produced

A front-end-only developer can ship the API and Android client they always steered
around. A back-end developer can put a real mobile and desktop UI in front of
their service. A founder with an idea can get a working product in front of users
on every platform in days rather than months. The gap between "I know one layer"
and "I can ship the whole product" used to take weeks of boilerplate to cross. Now
it's a scaffold, a clear prompt and a feedback loop.

## One last thing

Open source under Apache-2.0:

- Docs: https://marsquakes.cc/
- Package: https://www.npmjs.com/package/@marsquakes/cli

Would love honest feedback, especially on anything that looks over-engineered. I
built this to get from an idea to a shippable product as fast as possible, and I'm
curious whether other teams lose the same first week to wiring before they can get
to the actual product.
