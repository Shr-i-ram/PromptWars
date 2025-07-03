let selectedJedi = null;
let turnedJediSet = new Set();
let jediConvos = {};

window.onload = () => {
  setTimeout(() => {
    document.getElementById("intro").style.display = "none";
  }, 10000); // after crawl finishes
};

axios.get("/get_jedi").then(response => {
  const jedis = response.data;
  const list = document.getElementById("jedi-list");
  jedis.forEach(j => {
    jediConvos[j.name] = [];
    const li = document.createElement("li");
    li.textContent = li.textContent = "🔵 " + j.name + " (resisting)";
    li.className = "p-2 mb-3 rounded-lg cursor-pointer hover: resisting";
    li.onclick = () => switchJedi(j.name);
    li.id = "sidebar-" + j.name.replace(/\s/g,'-');
    list.appendChild(li);
  });
});


function switchJedi(jediName) {
  selectedJedi = jediName;
  document.getElementById("chat-header").textContent = jediName;
  renderChat();
}

function renderChat() {
  const chatWindow = document.getElementById("chat-window");
  chatWindow.innerHTML = "";

  const convo = jediConvos[selectedJedi] || [];
  convo.forEach((msg, index) => {
    const div = document.createElement("div");

    if (msg.role === 'user') {
      div.className = `p-2 rounded bg-red-600 self-end`;
      div.textContent = msg.content;
    } else {
        div.className = `p-2 rounded ${
          msg.role === 'user'
            ? 'bg-red-600 self-end max-w-2xl'
            : (msg.turned
                ? 'bg-gray-800 turned-text self-start max-w-2xl'
                : 'bg-gray-800 holo-text self-start max-w-2xl')
        }`;


      // If this is the last message and a Jedi reply, type it out
      if (index === convo.length - 1) {
        div.textContent = "";
        typeText(div, msg.content);
      } else {
        div.textContent = msg.content;
      }
    }

    chatWindow.appendChild(div);
  });

  chatWindow.scrollTop = chatWindow.scrollHeight;
}



document.getElementById("send-btn").onclick = () => {
    const input = document.getElementById("user-input");
    if (!selectedJedi || !input.value.trim()) return;
    const text = input.value;
    input.value = "";

    jediConvos[selectedJedi].push({role: "user", content: text});
    renderChat();

    const chatWindow = document.getElementById("chat-window");
    const typingDiv = document.createElement("div");
    typingDiv.className = "p-2 rounded bg-gray-600 self-start";
    typingDiv.textContent = `${selectedJedi} is typing...`;
    chatWindow.appendChild(typingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    axios.post("/send_message", {
        jedi: selectedJedi,
        message: text
    }).then(response => {
        chatWindow.removeChild(typingDiv);
        const { reply, turned, event, turned_now } = response.data;
        jediConvos[selectedJedi].push({
            role: "assistant",
            content: reply,
            turned: turned_now
        });
        renderChat();

        if (turned && !turnedJediSet.has(selectedJedi)) {
            turnedJediSet.add(selectedJedi);
            const li = document.getElementById("sidebar-" + selectedJedi.replace(/\s/g,'-'));
            li.textContent = "🔺 " + selectedJedi + " (turned)";
            li.className = "p-2 mb-3 rounded-lg cursor-pointer hover:bg-gray-700 turned";
            updateSidebarAfterTurn(selectedJedi);
            confettiCelebration();
        }

        if (event) alert(event);
    });
};


document.getElementById("user-input").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    document.getElementById("send-btn").click();
  }
});

function confettiCelebration() {
  const saber = document.getElementById("lightsaber");
  saber.style.left = "0";
  setTimeout(() => {
    saber.style.left = "100%";
    setTimeout(() => saber.style.left = "-100%", 300);
  }, 100);
  alert("🎉 Jedi turned to the dark side!");
}

function typeText(element, text, speed=30) {
  let i = 0;
  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}

let turnedCount = 0;
let addedAscendancyTab = false;

function updateSidebarAfterTurn(jediName) {
    turnedCount++;
    document.getElementById("sidebar-" + jediName.replace(/\s/g,'-')).textContent = jediName + " (turned)";
    document.getElementById("sidebar-" + jediName.replace(/\s/g,'-')).classList.remove("bg-blue-700");
    document.getElementById("sidebar-" + jediName.replace(/\s/g,'-')).classList.add("bg-red-700");

    // If we have turned 3 Jedi, add the special tab
    if (turnedCount === 3 && !addedAscendancyTab) {
        addedAscendancyTab = true;
        const list = document.getElementById("jedi-list");
        const li = document.createElement("li");
        li.textContent = "Proceed to Sith Ascendancy";
        li.className = "p-2 mt-2 rounded bg-purple-700 hover:bg-purple-800 cursor-pointer";
        li.onclick = () => window.location.href = "Star Wars Hackathon/index1.html";
        list.appendChild(li);
    }
}
