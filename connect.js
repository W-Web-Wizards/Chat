let address;
let socket;

const addressbar = document.getElementById("address");
const joinbutton = document.getElementById("join");
const officialbutton = document.getElementById("official");
const errspace = document.getElementById("errtxt");
const namebar = document.getElementById("name");

joinbutton.onclick = () => {
  if (namebar.value.trim() == "") {
    errspace.innerHTML = "Error: you cannot have an empty name.";
    return;
  }
  joinbutton.innerHTML = "Connecting...";
  socket = io(addressbar.value);
  socket.on("connect_error", (error) => {
    errspace.innerHTML = error;
    joinbutton.innerHTML = "Join Server";
  });
  socket.on("connect", () => {
    socket.emit("livechatping");
    socket.on("livechatpong", () => {
      joinbutton.onclick = undefined;
      officialbutton.onclick = undefined;
      joinbutton.innerHTML = "Connected...";
      window.sessionStorage.setItem("livechat-address", addressbar.value);
      window.sessionStorage.setItem("livechat-name", namebar.value);
      window.location.href = "/chat.html";
    });
    
  });
}

officialbutton.onclick = () => {
  if (namebar.value.trim() == "") {
    errspace.innerHTML = "Error: you cannot have an empty name.";
    return;
  }
  officialbutton.innerHTML = "Connecting...";
  socket = io("https://Chat-Server.dhub.repl.co");
  socket.on("connect_error", (error) => {
    errspace.innerHTML = error;
    officialbutton.innerHTML = "Connect to official server.";
  });
  socket.on("connect", () => {
    socket.emit("livechatping");
    socket.on("livechatpong", () => {
      officialbutton.onclick = undefined;
      joinbutton.onclick = undefined;
      officialbutton.innerHTML = "Connected...";
      window.sessionStorage.setItem("livechat-address", "https://Chat-Server.dhub.repl.co");
      window.sessionStorage.setItem("livechat-name", namebar.value);
      window.location.href = "/chat.html";
    });
    
  });
}
