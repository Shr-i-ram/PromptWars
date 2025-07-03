const apiKey = "AIzaSyD4FunWMVfYKDNL2gPNCshMKRPUEpwV5pk";

const chatBox = document.getElementById("chatBox");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");

async function askSithAI(message) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are a Sith Lord AI. Respond with power, confidence, darkness, and menace.\n\nUser: ${message}`
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();
  const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "The Dark Side is silent...";
  displayMessage("Sith AI", aiReply);
}

function displayMessage(sender, text) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", () => {
  const message = userInput.value.trim();
  if (!message) return;
  displayMessage("You", message);
  userInput.value = "";
  askSithAI(message);
});

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
document.getElementById("backHomeBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});
