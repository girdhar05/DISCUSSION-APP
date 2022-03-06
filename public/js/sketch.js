//white-board code....
const colorInput = document.getElementById('color');
const weight = document.getElementById('weight');
const clear = document.getElementById('clear');
const paths = [];
let currentPath = [];
let delPath = [];
let color = 0;
var data;
var socket;

socket = io.connect('http://localhost:3000');
function setup() {
  createCanvas((window.innerWidth * 80) / 100, window.innerHeight);
  background(255);
  socket.on('mouse', (newData) => {
    noFill();
    beginShape();
    newData.forEach((point) => {
      stroke(point.color);
      strokeWeight(point.weight);
      vertex(point.x, point.y);
    });
    endShape();
  });
}

function now() {
  noFill();
  if (mouseIsPressed) {
    const point = {
      x: mouseX,
      y: mouseY,
      color: 0,
      weight: 3,
    };
    currentPath.push(point);
    socket.emit('path', currentPath);
  }
  paths.forEach((path) => {
    beginShape();
    path.forEach((point) => {
      stroke(point.color);
      strokeWeight(point.weight);
      vertex(point.x, point.y);
    });
  });
  endShape();
}

function draw() {
  now();
}

function mousePressed() {
  currentPath = [];
  paths.push(currentPath);
}

// text-chat

const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const name = document.getElementById('hiddenUserName').innerText;

//appendMessage('You joined');
socket.emit('NewClient', name);

socket.on('chat-message', (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-connected', (name) => {
  appendMessage(`${name} connected`);
});

socket.on('user-disconnected', (name) => {
  appendMessage(`${name} disconnected`);
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`);
  socket.emit('send-chat-message', message);
  messageInput.value = '';
});

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
