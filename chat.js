const bar = document.getElementById("msgbar");
const send = document.getElementById("sendbutton");
const exit = document.getElementById("exitbutton");

const MAXLENGTH = 2000;
const DISALLOWED = [
  'badpig',
  'badpiggy',
  'h8',
  'wh1te',
  'Wh1te',
  'not',
  'hate',
  "I'm racist",
  'I flipping hate ',
  'I flipping hate ',
  'I flipping hate ',
  "I'm white",
  'im racist',
  'Im racist',
  'fuck',
  'shit',
  'bitch',
  'nigger',
  'dick',
];

let valid = (message) => {
  if (message.length > MAXLENGTH) {
    return false;
  }
  for (word of DISALLOWED) {
    if (message.includes(word)) {
      return false;
    }
  }
  return true;
}

const msgs = document.getElementById("msgs");

const socket = io(window.sessionStorage.getItem("livechat-address"));
socket.on("connect", () => {
  socket.emit("myjoin", window.sessionStorage.getItem("livechat-name"));
});

socket.on("message", msg => {
  const newmessage = document.createElement("div");
  const name = document.createElement("span");
  name.className = "name";
  name.textContent = msg.name;
  newmessage.appendChild(name);
  newmessage.appendChild(document.createElement("br"));
  const mesag = document.createElement("li");
  mesag.className = "other";
  mesag.innerHTML = marked(msg.text);
  newmessage.appendChild(mesag);
  msgs.appendChild(newmessage);
  newmessage.scrollIntoView(true);
});

socket.on("join", name => {
  let jointxt = document.createElement("div");
  jointxt.style.textAlign = "center";
  let nametxt = document.createElement("span");
  nametxt.className = "name";
  nametxt.textContent = name + " joined the chat.";
  jointxt.appendChild(nametxt);
  msgs.appendChild(jointxt);
});

socket.on("leave", name => {
  const jointxt = document.createElement("div");
  jointxt.style.textAlign = "center";
  const nametxt = document.createElement("span");
  nametxt.className = "name";
  nametxt.textContent = name + " left the chat.";
  jointxt.appendChild(nametxt);
  msgs.appendChild(jointxt);
});

const sendmsg = () => {
  if (bar.value.trim() != "") {
    let eyebrow = document.getElementsByClassName("eyebrow-worried")[0].querySelector('img');
    if (valid(bar.value)) {
      const newmessage = document.createElement("div");
      newmessage.className = "youcontainer";
      const name = document.createElement("span");
      name.className = "name";
      name.textContent = "You";
      newmessage.appendChild(name);
      newmessage.appendChild(document.createElement("br"));
      const mesag = document.createElement("li");
      mesag.className = "you";
      const msgtxt = document.createElement("span");
      msgtxt.textContent = bar.value;
      mesag.innerHTML = marked(msgtxt.innerHTML);
      bar.value = "";
      newmessage.appendChild(mesag);
      msgs.appendChild(newmessage);
      newmessage.scrollIntoView(true);
      socket.emit("message", {
        name: window.sessionStorage.getItem("livechat-name"),
        text: msgtxt.innerHTML, 
      });
      eyebrow.style.display = 'none';
    } else {
      eyebrow.style.display = 'inline';
      setTimeout(() => {
        eyebrow.style.display = 'none';
      }, 5000);
    }
  }
}

send.onclick = sendmsg;

exit.onclick = () => {
  window.location.href = "/";
}

bar.addEventListener("keyup", e => {
  if (e.keyCode === 13) {
    e.preventDefault();
    send.click();
  }
});

window.onbeforeunload = e => {
  socket.emit("myleave", window.sessionStorage.getItem("livechat-name"));
  e.returnValue = "";
}
