// Dear Sis Data Assistant — compact, single-panel redesign.
// Keeps the existing portfolio answer logic and uses a small launcher when closed.
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("portfolio-chat-window")) return;

  const button = document.createElement("button");
  button.id = "portfolio-chat-button";
  button.type = "button";
  button.setAttribute("aria-label", "Open Dear Sis Data Assistant");
  button.innerHTML = `
    <img src="images/felicia-avata.png" alt="">
    <span>ASK FELICIA AI</span>
  `;
  document.body.appendChild(button);

  const chat = document.createElement("section");
  chat.id = "portfolio-chat-window";
  chat.setAttribute("aria-label", "Dear Sis Data Assistant");
  chat.innerHTML = `
    <header class="portfolio-chat-header">
      <img class="portfolio-chat-header-avatar" src="images/felicia-avata.png" alt="Felicia avatar">
      <div class="portfolio-chat-brand-text">
        <h3>Dear Sis Data</h3>
        <p><span class="portfolio-chat-online-dot"></span> AI Assistant · Felicia's data journey</p>
      </div>
      <div class="portfolio-chat-window-actions">
        <button class="chat-minimize" type="button" aria-label="Minimise assistant" title="Minimise">−</button>
        <button class="chat-expand" type="button" aria-label="Toggle assistant size" title="Toggle size">□</button>
        <button class="chat-close" type="button" aria-label="Close assistant" title="Close">×</button>
      </div>
    </header>

    <div class="portfolio-chat-content">
      <div class="portfolio-chat-messages-wrap">
        <div id="portfolio-chat-messages" aria-live="polite">
          <div class="portfolio-chat-row bot">
            <img src="images/felicia-avata.png" alt="" class="portfolio-chat-avatar">
            <div class="portfolio-chat-message bot">
              <span class="portfolio-chat-greeting-title">Hi! 👋 I'm Felicia's assistant.</span>
              Ask me about her projects, experience, skills, tools, certifications or portfolio design service.
            </div>
          </div>
        </div>
      </div>

      <section class="portfolio-chat-shortcuts" aria-label="Quick questions">
        <p class="portfolio-chat-section-title"><span>✦</span> QUICK QUESTIONS</p>
        <div class="portfolio-chat-suggestions-grid">
          <button class="portfolio-chat-suggestion" type="button" data-question="Show me Felicia's Power BI projects">
            <span class="suggestion-icon">▥</span><span class="suggestion-label">Power BI projects</span><b>›</b>
          </button>
          <button class="portfolio-chat-suggestion" type="button" data-question="What tools and technologies does Felicia use?">
            <span class="suggestion-icon">⚙</span><span class="suggestion-label">Skills &amp; tools</span><b>›</b>
          </button>
          <button class="portfolio-chat-suggestion" type="button" data-question="Tell me about Felicia's work experience">
            <span class="suggestion-icon">♙</span><span class="suggestion-label">Work experience</span><b>›</b>
          </button>
          <button class="portfolio-chat-suggestion" type="button" data-question="Tell me about Felicia's portfolio website design service">
            <span class="suggestion-icon">✧</span><span class="suggestion-label">Portfolio service</span><b>›</b>
          </button>
        </div>
      </section>

      <form id="portfolio-chat-form">
        <span class="portfolio-chat-paperclip" aria-hidden="true">⌁</span>
        <input id="portfolio-chat-input" type="text" placeholder="Ask Felicia anything..." aria-label="Type your question" autocomplete="off" required>
        <button class="portfolio-chat-clear" type="button" aria-label="Clear chat" title="Clear conversation"><span class="clear-icon" aria-hidden="true">✦</span><span>Clear</span></button>
        <button class="portfolio-chat-send" type="submit" aria-label="Send question" title="Send">➤</button>
      </form>
    </div>
  `;
  document.body.appendChild(chat);

  const messages = chat.querySelector("#portfolio-chat-messages");
  const form = chat.querySelector("#portfolio-chat-form");
  const input = chat.querySelector("#portfolio-chat-input");
  const clearButton = chat.querySelector(".portfolio-chat-clear");

  const greetingHTML = `
    <div class="portfolio-chat-row bot">
      <img src="images/felicia-avata.png" alt="" class="portfolio-chat-avatar">
      <div class="portfolio-chat-message bot">
        <span class="portfolio-chat-greeting-title">Hi! 👋 I'm Felicia's assistant.</span>
        Ask me about her projects, experience, skills, tools, certifications or portfolio design service.
      </div>
    </div>
  `;

  clearButton.addEventListener("click", function () {
    messages.innerHTML = greetingHTML;
    chat.classList.remove("has-started");
    input.value = "";
    messages.scrollTop = 0;
    input.focus();
  });

  function openChat() {
    chat.classList.add("chat-open");
    button.classList.add("launcher-hidden");
    input.focus();
  }

  function closeChat() {
    chat.classList.remove("chat-open");
    button.classList.remove("launcher-hidden");
  }

  button.addEventListener("click", openChat);
  chat.querySelector(".chat-minimize").addEventListener("click", closeChat);
  chat.querySelector(".chat-close").addEventListener("click", closeChat);
  chat.querySelector(".chat-expand").addEventListener("click", function () {
    chat.classList.toggle("chat-expanded");
    this.textContent = chat.classList.contains("chat-expanded") ? "▣" : "□";
  });

  function askQuestion(question) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    chat.classList.add("has-started");
    addMessage(cleanQuestion, "user");
    addMessage(getAnswer(cleanQuestion), "bot");
  }

  chat.querySelectorAll("[data-question]").forEach(function (item) {
    item.addEventListener("click", function () {
      askQuestion(item.getAttribute("data-question") || "");
    });
  });

  function addMessage(text, sender) {
    const row = document.createElement("div");
    row.className = `portfolio-chat-row ${sender}`;

    if (sender === "bot") {
      const avatar = document.createElement("img");
      avatar.src = "images/felicia-avata.png";
      avatar.alt = "";
      avatar.className = "portfolio-chat-avatar";
      row.appendChild(avatar);
    }

    const message = document.createElement("div");
    message.className = `portfolio-chat-message ${sender}`;
    message.textContent = text;
    row.appendChild(message);

    if (sender === "user") {
      const userAvatar = document.createElement("span");
      userAvatar.className = "portfolio-chat-user-avatar";
      userAvatar.setAttribute("aria-label", "You");
      userAvatar.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.2" r="4.1"/><path d="M4.2 21c.3-4.7 3.2-7.3 7.8-7.3s7.5 2.6 7.8 7.3z"/></svg>';
      row.appendChild(userAvatar);
    }

    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  function getAnswer(question) {
    const q = question.toLowerCase();

    // About Felicia
    if (
        q.includes("who is felicia") ||
        q.includes("about felicia") ||
        q.includes("about you") ||
         q.includes("Where is Felicia's location?") ||
        q.includes("who are you")
    ) {
        return "Felicia Mabena, known through her Dear Sis Data brand, is a Data Quality and Governance professional and Data Analyst based in South Africa. She has 7 years of professional experience across data quality, data governance, data management, business intelligence, analytics and dashboard development. She also offers portfolio website design services for data professionals.";
    }

    // Years of experience
    if (
        q.includes("how many years") ||
        q.includes("years of experience") ||
        q.includes("how much experience") ||
        q.includes("years experience") ||
        q.includes("work experience")
    ) {
        return "Felicia has 7 years of professional experience across data quality, data governance, data management, data analysis, business intelligence and reporting.";
    }

    // Project count
    if (
        q.includes("how many project") ||
        q.includes("number of project") ||
        q.includes("count of project")
    ) {
        return "Felicia's portfolio covers Power BI, SQL, Excel, Tableau, Data Quality and Data Governance. Her projects include fuel and cost-of-living analysis, Smart Property Intelligence, Recruitment Intelligence, HR analysis, healthcare analysis and other business intelligence projects.";
    }

    // Portfolio website design service
    if (
        q.includes("portfolio website") ||
        q.includes("portfolio design") ||
        q.includes("build my portfolio") ||
        q.includes("design my portfolio") ||
        q.includes("portfolio service")
    ) {
        return "Felicia offers portfolio website design for data professionals. The service brings your projects together in one professional website, with project images, descriptions and links to platforms such as GitHub. Contact Felicia to discuss your portfolio requirements.";
    }

    // Skills and tools
    if (
        q.includes("skill") ||
        q.includes("tool") ||
        q.includes("technology") ||
        q.includes("software")
    ) {
        return "Felicia's skills include Power BI, DAX, Power Query, SQL, Excel, Tableau, Microsoft Fabric, Data Quality, Data Governance, Data Management, Metadata Management, Data Catalogue, Data Analysis, Data Visualisation, Dashboard Design, SAP and Salesforce.";
    }

    // Power BI projects
    if (q.includes("power bi") || q.includes("powerbi")) {
        return "Felicia's Power BI projects include the South Africa Fuel & Cost of Living Dashboard, Smart Property Intelligence Dashboard, AI-Powered Recruitment Intelligence Dashboard, HR Staff Analysis Dashboard, Healthcare Analysis Dashboard, South Africa Starbucks 2024 Analysis Dashboard, Shoe Store Analysis Project and South Africa Economy Comparison by President.";
    }

    // General project overview
    if (
        q.includes("show me felicia's projects") ||
        q === "projects" ||
        q.includes("all projects") ||
        q.includes("list her projects") ||
        q.includes("portfolio projects")
    ) {
        return "Felicia's portfolio includes the South Africa Fuel & Cost of Living Dashboard, Smart Property Intelligence Dashboard, AI-Powered Recruitment Intelligence Dashboard, HR Staff Analysis Dashboard, Healthcare Analysis Dashboard, SQL HR Employee Project, SQL Healthcare Data Cleaning Project, Excel Billionaires Dashboard, Healthcare Excel Dashboard, Woolworths South Africa Sales Performance Analysis, Tableau Dashboard Projects, and a Data Quality & Data Governance Project.";
    }

    // Fuel and cost of living
    if (q.includes("fuel") || q.includes("cost of living")) {
        return "The South Africa Fuel & Cost of Living Dashboard focuses on South African fuel prices and cost-of-living trends. It explores how fuel prices and living costs change over time, with provincial cost-of-living analysis.";
    }

    // Smart Property Intelligence
    if (
        q.includes("smart property") ||
        q.includes("property dashboard") ||
        q.includes("property intelligence")
    ) {
        return "The Smart Property Intelligence Dashboard brings together rental income, occupancy, energy consumption, sustainability and maintenance performance. Built using Power BI, DAX, data modelling, KPI development and interactive filtering, it also incorporates Licia, an AI-powered data assistant.";
    }

    // Recruitment Intelligence
    if (
        q.includes("recruitment") ||
        q.includes("recruitment dashboard") ||
        q.includes("recruitment intelligence")
    ) {
        return "The AI-Powered Recruitment Intelligence Dashboard covers candidate screening, AI-powered candidate recommendations, interactive candidate profiles, recruitment KPIs, interview scheduling, hiring pipeline analytics, recruitment source analysis and recruitment activity tracking. It was designed using Power BI, DAX, data modelling and interactive report design.";
    }

    // SQL projects
    if (q.includes("sql")) {
        return "Felicia's SQL portfolio includes an HR Employee Project and a Healthcare Data Cleaning Project. Her broader experience also covers data analysis, data cleaning and data management.";
    }

    // Excel projects
    if (q.includes("excel")) {
        return "Felicia's Excel projects include an Excel Billionaires Dashboard, Healthcare Analysis Project and Woolworths South Africa Sales Performance Analysis.";
    }

    // Tableau projects
    if (
        q.includes("tableau") ||
        q.includes("executive overview") ||
        q.includes("profit ratio") ||
        q.includes("geography dashboard") ||
        q.includes("hr staff analysis") ||
        q.includes("staff analysis dashboard")
    ) {
        return "Felicia's Tableau portfolio includes an Executive Overview dashboard and an HR Staff Analysis Dashboard. The Executive Overview includes a Profit Ratio by Geography map, with state-level comparisons and a percentile-of-profit-margin filter. The HR Staff Analysis Dashboard explores department headcounts, employee gender breakdown, age ranges, highest-paid employees, hiring trends over time, salary patterns by education level, and leave balances across Sales and Marketing roles. These projects demonstrate dashboard design, data visualisation, and the use of interactive views to explore business data.";
    }

    // Data Quality and Governance project
    if (
         q.includes("data quality") ||
         q.includes("data governance") ||
         q.includes("data catalogue") ||
         q.includes("data catalog") ||
         q.includes("metadata") ||
         q.includes("data management") ||
         q.includes("policies and standards") ||
         q.includes("policies & standards") ||
         q.includes("strong data foundation")
    ) {
         return "Felicia's Data Quality and Data Governance project explains how to build a strong data foundation through five connected areas: Data Quality, Data Governance, Policies & Standards, Data Catalogue, and Metadata. Data Quality focuses on reliable, accurate and trusted data. Data Governance covers people, processes and accountability. Policies & Standards establish clear rules and consistent practices. A Data Catalogue helps people find and understand data, while Metadata describes the data itself. Together, these areas help organisations manage data more consistently and make better-informed decisions. The project presents these topics as a practical overview of the foundations of data management.";
    }

    // Microsoft Fabric
    if (q.includes("fabric")) {
        return "Microsoft Fabric is among the technologies Felicia works with, alongside Power BI, SQL, Excel and Tableau.";
    }

    // GitHub repositories
    if (
        q.includes("github") ||
        q.includes("source code") ||
        q.includes("repository")
    ) {
        return "You can explore Felicia's project repositories on GitHub: https://github.com/FeliciaTheAnalyst/Portfolio-Projects";
    }

    // Portfolio design enquiries
    if (
        q.includes("contact") ||
        q.includes("linkedin") ||
        q.includes("hire") ||
        q.includes("recruiter")
    ) {
        return "You can contact Felicia at liciaanalyst@gmail.com or connect with her on LinkedIn: https://www.linkedin.com/in/feliciasisdata";
    }

    // Greeting
    if (
        q.includes("hello") ||
        q === "hi" ||
        q.startsWith("hi ") ||
        q.includes("hey")
    ) {
        return "Hello! 👋 I'm Felicia's Dear Sis Data Assistant. Ask me about her 7 years of experience, projects, skills, Data Governance background or portfolio website design service.";
    }

    // Default response
    return "I can help you explore Felicia's 7 years of experience, Power BI projects, SQL and Excel work, Data Quality and Governance skills, portfolio website design service and contact details. What would you like to know?";
}

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    askQuestion(question);
    input.value = "";
    input.focus();
  });
});
