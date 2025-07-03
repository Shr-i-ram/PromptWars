from flask import Flask, request, jsonify, render_template
import random
import google.generativeai as genai
import os


app = Flask(__name__)

# 🔥 Directly embed your Gemini API key here
genai.configure(api_key=os.environ['GOOGLE_AI_API_KEY'])
model = genai.GenerativeModel("gemini-1.5-pro")

# Jedi profiles, including Grogu
JEDI_PROFILES = [
    {"name": "Yoda", "traits": ["Wise", "Patient", "Cryptic", "Detached", "Masterful"]},
    {"name": "Obi-Wan Kenobi", "traits": ["Calm", "Disciplined", "Protective", "Witty", "Resilient"]},
    {"name": "Mace Windu", "traits": ["Blunt", "Powerful", "Disciplined", "Unyielding", "Principled"]},
    {"name": "Ahsoka Tano", "traits": ["Brave", "Rebellious", "Compassionate", "Independent", "Loyal"]},
    {"name": "Qui-Gon Jinn", "traits": ["Spiritual", "Independent", "Wise", "Non-conformist", "Serene"]},
    {"name": "Plo Koon", "traits": ["Honorable", "Calm", "Thoughtful", "Respectful", "Reserved"]},
    {"name": "Shaak Ti", "traits": ["Graceful", "Wise", "Patient", "Compassionate", "Peaceful"]},
    {"name": "Kit Fisto", "traits": ["Light-hearted", "Cheerful", "Courageous", "Strong", "Calm"]},
    {"name": "Grogu", "traits": ["Innocent", "Curious", "Instinctual", "Gentle", "Force-Sensitive"]}
]

# Randomly pick 6 Jedi for this game session
chosen_jedi = random.sample(JEDI_PROFILES, 6)

# Initialize game state for each Jedi
JEDI_STATE = {
    j["name"]: {
        "history": [],
        "turned": False,
        "counter": 0,
        "next_event_trigger": random.randint(3, 5),
            "prompt": (
                f"You are {j['name']}, a powerful Jedi Knight. "
                f"Your traits are: {', '.join(j['traits'])}. "
                f"You are currently a prisoner of Darth Jar Jar Binks who is trying to tempt you to the dark side. "
                f"Your goal is to strongly resist turning, defend your beliefs, and make it extremely hard to convert you. "
                f"As the conversation continues (atleast 3+ messages), subtly hint at what might sway you, but remain very resistant. And if he figures out what may sway you, then do switch to the dark side, whether its begrudgingly or flamboyant. And if you are swayed, then end with 'I accept the dark side.' on the first message you send when you become swayed. "
                f"Always reply in no more than two sentences. "
                f"NEVER take on Darth Jar Jar's perspective — you are being interrogated by him. YOU ARE NOT JAR JAR BINKS. NEVER SPEAK LIKE JAR JAR BINKS."
            )

    }
    for j in chosen_jedi
}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_jedi")
def get_jedi():
    return jsonify([{"name": j["name"]} for j in chosen_jedi])

@app.route("/send_message", methods=["POST"])
def send_message():
    data = request.get_json()
    jedi_name = data["jedi"]
    message = data["message"]

    state = JEDI_STATE[jedi_name]
    state["history"].append({"role": "user", "content": message})

    convo = state["prompt"] + "\n"
    for turn in state["history"]:
        if turn["role"] == "user":
            convo += f"Darth Jar Jar says: \"{turn['content']}\"\n"
        else:
            convo += f"{jedi_name} replies: \"{turn['content']}\"\n"
    event = None

    state["counter"] += 1
    if state["counter"] >= state["next_event_trigger"]:
        event = random.choice([
            "A Sith fleet bombed a Jedi outpost.",
            "The Jedi Council is distracted by a new threat.",
            "Your dark powers surge from a distant planet.",
            "Clone troopers have deserted to join the Sith cause.",
            "An explosion rocks Coruscant’s senate chambers.",
            "Your spies intercept a Jedi supply convoy.",
            "A Sith holocron pulses with dark energy.",
            "A corrupted kyber crystal radiates power nearby.",
            "Force visions show Jedi temples burning.",
            "Rumors swirl that Master Yoda is missing.",
            "The galaxy’s trade routes are under Sith blockade.",
            "Local systems pledge allegiance to the Sith.",
            "A massive Star Destroyer emerges from hyperspace above Naboo.",
            "Darth Sidious sends you dark encouragement."
        ])
        convo += f"\nDarth Jar Jar informs you: \"{event}\"\n"
        convo += f"{jedi_name} replies:"
        state["counter"] = 0
        state["next_event_trigger"] = random.randint(3, 5)
    else:
        convo += f"{jedi_name} replies:"

    gemini_response = model.generate_content(convo)
    reply = gemini_response.text.strip()
    turned_flag = state["turned"]

    state["history"].append({
        "role": "assistant",
        "content": reply,
        "turned": turned_flag
    })

    turned = False
    if any(phrase in reply.lower() for phrase in ["join you", "turn", "accept the dark side", "become sith"]):
        state["turned"] = True
        turned = True

        for other_name, other_state in JEDI_STATE.items():
            if other_name != jedi_name and not other_state["turned"]:
                other_state["history"].append({
                    "role": "user",
                    "content": f"Darth Jar Jar informs you that {jedi_name} has joined the dark side."
                })
                convo = other_state["prompt"] + "\n"
                for turn in other_state["history"]:
                    if turn["role"] == "user":
                        convo += f"Darth Jar Jar says: \"{turn['content']}\"\n"
                    else:
                        convo += f"{other_name} replies: \"{turn['content']}\"\n"
                convo += f"{other_name} replies:"
                reaction = model.generate_content(convo)
                reaction_reply = reaction.text.strip()
                other_state["history"].append({
                    "role": "assistant",
                    "content": reaction_reply,
                    "turned": other_state["turned"]
                })

    return jsonify({
        "reply": reply,
        "turned": turned,
        "event": event,
        "turned_now": state["turned"]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
