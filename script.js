const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle?.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navLinks?.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* EmailJS Configuration */
const EMAILJS_SERVICE_ID = "service_1w66one";
const EMAILJS_TEMPLATE_ID = "template_xtok9cc";
const EMAILJS_PUBLIC_KEY = "37o18MU5-ou0Vy2FD";

if (typeof emailjs !== "undefined") {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

/* EmailJS Contact Form */
const contactForm = document.getElementById("contactForm");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (typeof emailjs === "undefined") {
    alert("Email service is not available. Please try again later.");
    return;
  }

  const submitButton = contactForm.querySelector("button[type='submit']");
  const originalButtonText = submitButton.textContent;

  submitButton.textContent = "Sending...";
  submitButton.disabled = true;

  emailjs
    .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
    .then(() => {
      submitButton.textContent = "Message sent";
      contactForm.reset();

      setTimeout(() => {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }, 3000);
    })
    .catch((error) => {
      console.error("EmailJS Error:", error);
      submitButton.textContent = "Send failed";

      setTimeout(() => {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }, 3000);
    });
});

/* Shared Validation */
function validateLeadInput(value, validationType) {
  const cleanValue = value.trim();

  if (validationType === "name") {
    if (cleanValue.length < 2) {
      return "Please enter your full name with at least 2 characters.";
    }

    if (!/^[a-zA-ZÀ-ÿ' -]+$/.test(cleanValue)) {
      return "Please enter a valid name using letters only.";
    }
  }

  if (validationType === "email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailPattern.test(cleanValue)) {
      return "Please enter a valid email address, for example name@example.com.";
    }
  }

  if (validationType === "phone") {
    const normalizedPhone = cleanValue.replace(/\s+/g, "");
    const phonePattern = /^(\+27|27|0)[6-8][0-9]{8}$/;

    if (!phonePattern.test(normalizedPhone)) {
      return "Please enter a valid South African mobile number, for example 0615426276 or +27615426276.";
    }
  }

  if (validationType === "required") {
    if (cleanValue.length < 3) {
      return "Please provide a little more detail so I can capture the enquiry properly.";
    }
  }

  return "";
}

/* On-page Lead Capture Bot Demo */
const botChatWindow = document.getElementById("botChatWindow");
const botForm = document.getElementById("botForm");
const botInput = document.getElementById("botInput");
const botReset = document.getElementById("botReset");
const flowSteps = document.querySelectorAll(".flow-step");

const leadFlow = [
  {
    type: "message",
    text: "Hi, thanks for your interest. I’ll capture a few details so we can assist you.",
    stepIndex: 0,
  },
  {
    type: "input",
    prompt: "May I have your name?",
    variable: "name",
    validate: "name",
    stepIndex: 1,
  },
  {
    type: "input",
    prompt: "Please share your email address.",
    variable: "email",
    validate: "email",
    stepIndex: 2,
  },
  {
    type: "input",
    prompt: "Please share your phone number. South African format is accepted, e.g. 0615426276 or +27615426276.",
    variable: "phone",
    validate: "phone",
    stepIndex: 3,
  },
  {
    type: "input",
    prompt: "What product or service are you interested in?",
    variable: "query",
    validate: "required",
    stepIndex: 4,
  },
  {
    type: "message",
    text: "Thanks {{name}}. We have captured your request: {{query}}. We will contact you on {{email}} or {{phone}}.",
    stepIndex: 5,
  },
  {
    type: "end",
    text: "Thank you. This lead capture conversation has ended.",
  },
];

let currentFlowIndex = 0;
let leadData = {};

function updateFlowStep(index) {
  flowSteps.forEach((step, stepIndex) => {
    step.classList.toggle("active", stepIndex === index);
  });
}

function renderTemplate(text, dataSource = leadData) {
  return text.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    return dataSource[key.trim()] || "";
  });
}

function addBotMessage(text, sender = "bot") {
  if (!botChatWindow) return;

  const message = document.createElement("div");
  message.className = `bot-message ${sender}`;
  message.textContent = text;

  botChatWindow.appendChild(message);
  botChatWindow.scrollTop = botChatWindow.scrollHeight;
}

function processBotStep() {
  const step = leadFlow[currentFlowIndex];
  if (!step || !botInput) return;

  if (typeof step.stepIndex === "number") {
    updateFlowStep(step.stepIndex);
  }

  if (step.type === "message") {
    addBotMessage(renderTemplate(step.text));
    currentFlowIndex++;
    setTimeout(processBotStep, 700);
    return;
  }

  if (step.type === "input") {
    addBotMessage(renderTemplate(step.prompt));
    botInput.disabled = false;
    botInput.focus();
    return;
  }

  if (step.type === "end") {
    addBotMessage(step.text);
    botInput.disabled = true;
    botInput.placeholder = "Demo complete. Restart to try again.";
  }
}

function startBotDemo() {
  if (!botChatWindow || !botInput) return;

  botChatWindow.innerHTML = "";
  leadData = {};
  currentFlowIndex = 0;

  botInput.value = "";
  botInput.disabled = false;
  botInput.placeholder = "Type your response...";

  updateFlowStep(0);
  processBotStep();
}

botForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const step = leadFlow[currentFlowIndex];
  const value = botInput.value.trim();

  if (!step || step.type !== "input" || !value) return;

  const validationError = validateLeadInput(value, step.validate);

  if (validationError) {
    addBotMessage(validationError, "bot");
    botInput.value = "";
    botInput.focus();
    return;
  }

  addBotMessage(value, "user");

  if (step.variable === "phone") {
    leadData[step.variable] = value.replace(/\s+/g, "");
  } else {
    leadData[step.variable] = value;
  }

  botInput.value = "";
  botInput.disabled = true;

  currentFlowIndex++;
  setTimeout(processBotStep, 700);
});

botReset?.addEventListener("click", startBotDemo);

if (botChatWindow && botForm && botInput) {
  startBotDemo();
}

/* Floating Portfolio Lead Assistant */
const floatingBotLauncher = document.getElementById("floatingBotLauncher");
const floatingBotPanel = document.getElementById("floatingBotPanel");
const floatingBotClose = document.getElementById("floatingBotClose");
const floatingBotWindow = document.getElementById("floatingBotWindow");
const floatingBotForm = document.getElementById("floatingBotForm");
const floatingBotInput = document.getElementById("floatingBotInput");
const floatingBotReset = document.getElementById("floatingBotReset");

const portfolioLeadFlow = [
  {
    type: "message",
    text: "Hi, I’m Keletso’s portfolio assistant. I can help capture your hiring, consulting, or project enquiry.",
  },
  {
    type: "input",
    prompt: "Please share your full name.",
    variable: "name",
    validate: "name",
  },
  {
    type: "input",
    prompt: "Thanks {{name}}. Please share your email address.",
    variable: "email",
    validate: "email",
  },
  {
    type: "input",
    prompt: "Please share your phone number. South African format is accepted, e.g. 0615426276 or +27615426276.",
    variable: "phone",
    validate: "phone",
  },
  {
    type: "input",
    prompt: "What opportunity best describes your enquiry? Example: employment opportunity, consulting engagement, AI project, web development, business analysis, QA transformation, or general enquiry.",
    variable: "opportunityType",
    validate: "required",
  },
  {
    type: "input",
    prompt: "Please give me a short summary of what you would like to discuss with Keletso.",
    variable: "message",
    validate: "required",
  },
  {
    type: "message",
    text: "Thanks {{name}}. I captured your enquiry for: {{opportunityType}}. I’ll send this to Keletso so he can follow up with you.",
  },
  {
    type: "send",
  },
  {
    type: "end",
    text: "Your enquiry has been submitted. Thank you for reaching out.",
  },
];

let floatingFlowIndex = 0;
let floatingLeadData = {};

function addFloatingMessage(text, sender = "bot") {
  if (!floatingBotWindow) return;

  const message = document.createElement("div");
  message.className = `floating-message ${sender}`;
  message.textContent = text;

  floatingBotWindow.appendChild(message);
  floatingBotWindow.scrollTop = floatingBotWindow.scrollHeight;
}

function setFloatingInputState(enabled, placeholder = "Type your response...") {
  if (!floatingBotInput) return;

  floatingBotInput.disabled = !enabled;
  floatingBotInput.placeholder = placeholder;

  if (enabled) {
    floatingBotInput.focus();
  }
}

function processFloatingBotStep() {
  const step = portfolioLeadFlow[floatingFlowIndex];
  if (!step) return;

  if (step.type === "message") {
    addFloatingMessage(renderTemplate(step.text, floatingLeadData));
    floatingFlowIndex++;
    setTimeout(processFloatingBotStep, 700);
    return;
  }

  if (step.type === "input") {
    addFloatingMessage(renderTemplate(step.prompt, floatingLeadData));
    setFloatingInputState(true);
    return;
  }

  if (step.type === "send") {
    sendFloatingLead();
    return;
  }

  if (step.type === "end") {
    addFloatingMessage(step.text);
    setFloatingInputState(false, "Submitted. Restart to send a new enquiry.");
  }
}

function startFloatingBot() {
  if (!floatingBotWindow || !floatingBotInput) return;

  floatingBotWindow.innerHTML = "";
  floatingLeadData = {
    source: "Keletso Lwate Portfolio Floating Assistant",
    submittedAt: new Date().toLocaleString("en-ZA"),
  };
  floatingFlowIndex = 0;

  floatingBotInput.value = "";
  setFloatingInputState(false, "Starting assistant...");

  setTimeout(processFloatingBotStep, 350);
}

function sendFloatingLead() {
  if (typeof emailjs === "undefined") {
    addFloatingMessage("I captured your details, but the email service is not available right now. Please contact Keletso directly at klwate@live.co.za.", "error");
    floatingFlowIndex++;
    setTimeout(processFloatingBotStep, 700);
    return;
  }

  setFloatingInputState(false, "Submitting enquiry...");
  addFloatingMessage("Submitting your enquiry now...");

  const combinedMessage = `
New portfolio lead received.

Name: ${floatingLeadData.name}
Email: ${floatingLeadData.email}
Phone: ${floatingLeadData.phone}
Opportunity Type: ${floatingLeadData.opportunityType}
Message: ${floatingLeadData.message}
Source: ${floatingLeadData.source}
Submitted At: ${floatingLeadData.submittedAt}
`;

  const templateParams = {
    to_email: "klwate@live.co.za",
    name: floatingLeadData.name,
    email: floatingLeadData.email,
    phone: floatingLeadData.phone,
    opportunity_type: floatingLeadData.opportunityType,
    message: combinedMessage,
    source: floatingLeadData.source,
    submitted_at: floatingLeadData.submittedAt,
  };

  emailjs
    .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      floatingFlowIndex++;
      setTimeout(processFloatingBotStep, 700);
    })
    .catch((error) => {
      console.error("Floating Bot EmailJS Error:", error);
      addFloatingMessage("I could not submit the enquiry automatically. Please email Keletso directly at klwate@live.co.za.", "error");
      setFloatingInputState(false, "Submission failed. Restart to try again.");
    });
}

floatingBotLauncher?.addEventListener("click", () => {

    if (!floatingBotPanel) return;

    const isOpen = floatingBotPanel.classList.contains("open");

    if (isOpen) {
        floatingBotPanel.classList.remove("open");
        return;
    }

    floatingBotPanel.classList.add("open");

    if (floatingBotWindow && floatingBotWindow.children.length === 0) {
        startFloatingBot();
    }
});

floatingBotClose?.addEventListener("click", () => {
  floatingBotPanel?.classList.remove("open");
});

floatingBotReset?.addEventListener("click", startFloatingBot);

floatingBotForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const step = portfolioLeadFlow[floatingFlowIndex];
  const value = floatingBotInput?.value.trim();

  if (!step || step.type !== "input" || !value) return;

  const validationError = validateLeadInput(value, step.validate);

  if (validationError) {
    addFloatingMessage(validationError, "error");
    floatingBotInput.value = "";
    floatingBotInput.focus();
    return;
  }

  addFloatingMessage(value, "user");

  if (step.variable === "phone") {
    floatingLeadData[step.variable] = value.replace(/\s+/g, "");
  } else {
    floatingLeadData[step.variable] = value;
  }

  floatingBotInput.value = "";
  setFloatingInputState(false);

  floatingFlowIndex++;
  setTimeout(processFloatingBotStep, 700);
});