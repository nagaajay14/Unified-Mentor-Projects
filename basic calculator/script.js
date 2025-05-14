
let memory = 0;

function append(value) {
  document.getElementById('display').value += value;
}

function clearDisplay() {
  document.getElementById('display').value = '';
}

function calculate() {
  const display = document.getElementById('display');
  try {
    let result = eval(display.value.replace(/%/g, "/100"));
    display.value = result === Infinity ? "Infinity" : result;
  } catch (error) {
    display.value = "Error";
  }
}

function sqrt() {
  const display = document.getElementById('display');
  try {
    let value = parseFloat(display.value);
    if (value < 0) throw "Invalid sqrt";
    display.value = Math.sqrt(value);
  } catch {
    display.value = "Error";
  }
}

function memoryAdd() {
  const value = parseFloat(document.getElementById('display').value);
  if (!isNaN(value)) memory += value;
}

function memorySubtract() {
  const value = parseFloat(document.getElementById('display').value);
  if (!isNaN(value)) memory -= value;
}

function memoryRecall() {
  document.getElementById('display').value = memory;
}

function memoryClear() {
  memory = 0;
}

// Optional: support keyboard input
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (!isNaN(key) || "+-*/.".includes(key)) append(key);
  if (key === "Enter") calculate();
  if (key === "Escape") clearDisplay();
});
