# “Darth Jar Jar - The Sith Temptation”
The Product of Team 'Sith Lords' from the Hackathon 'Prompt Wars' hosted by VIT's Android Club.
<br>
<br><br>
<b>💡 Concept</b><br>
This is a Star Wars–themed interactive web game, where you play as Darth Jar Jar Binks, a secret Sith Lord.
Your mission:

Corrupt 6 captured Jedi through text conversations and lure them to the dark side.

Each Jedi is powered by an LLM personality (Gemini) that embodies their unique character traits — from Yoda’s cryptic wisdom to Ahsoka’s fierce independence.
It’s designed to be extremely hard to convince them, requiring clever manipulation.
<br><br><br>

<b>🔥 Gameplay Mechanics</b><br>
Simulates a Dark Side Direct Messaging interface, with each Jedi in a separate DM thread.

Jedi respond in character and resist your temptations, slowly revealing hints on what might sway them if the conversation drags on.

Periodic random events (like Sith fleets attacking Jedi temples) can influence or shake their resolve.

Once a Jedi turns to the dark side, the conversation UI transforms with a red Sith theme, and other Jedi are notified, reflecting galaxy-wide consequences.

When you corrupt 3 Jedi, a new sidebar tab unlocks, letting you proceed to the next phase of Sith domination.
<br><br><br>

<b>✨ UI & Aesthetics</b><br>
Uses Tailwind CSS for styling, tuned to a dark Star Wars-inspired theme.

Each Jedi’s chat has holographic neon blue text, mimicking holograms. Once turned, they shift to menacing red.

A lightsaber swipe animation triggers every time a Jedi succumbs, replacing typical confetti celebrations.

Responsive design — plays well on desktop and mobile.

<br><br><br>
<b>🧪 Tech Stack</b><br>
Python Flask (backend server)

Gemini (Google Generative AI) for generating Jedi responses with custom personality instructions.

HTML + TailwindCSS + Vanilla JS on frontend, hosted on Replit for rapid iteration.

<br><br><br>
<b>🚀 What’s innovative here?</b>

✅ It’s not just a chatbot — it’s a multi-threaded LLM game with distinct personalities and goals, maintaining individual states for each Jedi.
✅ Incorporates dynamic world events that affect conversations.
✅ Live tracks how many Jedi are corrupted and evolves the UI & game logic as you progress.

<br><br><br>
<b>🌌 Sith GeoGuessr</b><br>

As you progress in your dark campaign, you unlock a mini strategy game: Sith GeoGuessr.

<br><br><br>
<b>⚔️ What it is</b><br>
A Star Wars–themed geographic guessing game where you:

Get a cryptic clue or image hint about a famous Star Wars planet (like “an icy planet home to rebel hideouts”).

Have to choose between multiple options (Endor, Tatooine, Jakku, Hoth) and you get to see it on a real-world Earth map location where these scenes were filmed.

For example:

Hoth is actually the Hardangerjøkulen Glacier in Norway.

Tatooine scenes were filmed in Tunisia.

It cleverly blends Star Wars lore with actual Earth filming sites, testing both your galactic and cinematic knowledge.

<br><br><br>
<b>🚀 Features</b><br>
✅ Simple interface — click your guess, see instantly if you’re right.
✅ Uses Leaflet.js for interactive maps.
✅ Themed with Sith red & black UI, tying into your main game’s dark side aesthetic.
✅ Could easily be expanded into more planets or even time-based scoring for competitive play.
