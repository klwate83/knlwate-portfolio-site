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

/* EmailJS Contact Form */
const EMAILJS_SERVICE_ID = "service_1w66one";
const EMAILJS_TEMPLATE_ID = "template_xtok9cc";
const EMAILJS_PUBLIC_KEY = "37o18MU5-ou0Vy2FD";

if (typeof emailjs !== "undefined") {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

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