const RECEIVER_EMAIL = "bhumikadandare27@gmail.com";

const jobs = [
  {id:1, company:"Google", role:"Software Engineer", location:"Bangalore", degree:"B.Tech / B.E", exp:"Fresher", type:"On-site", salary:"₹12–25 LPA", minSalary:12, skills:["Java","Python","DSA"]},
  {id:2, company:"Microsoft", role:"Software Developer", location:"Hyderabad", degree:"B.Tech / B.E", exp:"0–2 Years", type:"Hybrid", salary:"₹10–22 LPA", minSalary:10, skills:["C++","Java","DSA"]},
  {id:3, company:"Amazon", role:"Cloud Developer", location:"Bangalore", degree:"B.E / B.Tech", exp:"1–3 Years", type:"On-site", salary:"₹9–20 LPA", minSalary:9, skills:["AWS","Python","SQL"]},
  {id:4, company:"Infosys", role:"System Engineer", location:"Pune", degree:"BCA / B.Tech", exp:"Fresher", type:"On-site", salary:"₹4–8 LPA", minSalary:4, skills:["Java","SQL"]},
  {id:5, company:"Accenture", role:"AI Developer", location:"Mumbai", degree:"B.Tech / M.Tech", exp:"0–2 Years", type:"Hybrid", salary:"₹6–14 LPA", minSalary:6, skills:["Python","AI","ML"]},
  {id:6, company:"TCS", role:"Junior Software Engineer", location:"Pune", degree:"B.E / B.Tech", exp:"Fresher", type:"On-site", salary:"₹3.5–7 LPA", minSalary:3, skills:["Java","C++","SQL"]},
  {id:7, company:"IBM", role:"AI/ML Engineer", location:"Bangalore", degree:"M.Tech / B.Tech", exp:"1–3 Years", type:"Remote", salary:"₹8–18 LPA", minSalary:8, skills:["Python","Machine Learning"]},
  {id:8, company:"Adobe", role:"Frontend Developer", location:"Noida", degree:"B.Tech / B.E", exp:"1–2 Years", type:"Remote", salary:"₹8–16 LPA", minSalary:8, skills:["HTML","CSS","JavaScript"]},
  {id:9, company:"Deloitte", role:"Data Analyst", location:"Mumbai", degree:"MCA / B.Tech", exp:"0–2 Years", type:"Hybrid", salary:"₹5–10 LPA", minSalary:5, skills:["Python","SQL","Excel"]},
  {id:10, company:"Wipro", role:"Graduate Engineer Trainee", location:"Pune", degree:"B.E / B.Tech", exp:"Fresher", type:"Hybrid", salary:"₹4–8 LPA", minSalary:4, skills:["Java","SQL","Problem Solving"]},
  {id:11, company:"Capgemini", role:"Associate Software Engineer", location:"Mumbai", degree:"B.E / B.Tech", exp:"Fresher", type:"On-site", salary:"₹4–9 LPA", minSalary:4, skills:["Java","Python","SQL"]}
];

const $ = id => document.getElementById(id);

const inputClass = `
  w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3
  text-sm font-medium outline-none transition
  placeholder:text-slate-400
  focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100
`;

function applyUtilityClasses() {
  document.querySelectorAll(".input").forEach(el => {
    el.className = `${inputClass.trim()} ${el.className.replace(/\binput\b/g, "").trim()}`;
  });

  document.querySelectorAll(".label").forEach(el => {
    el.className = `mb-2 block text-sm font-bold text-slate-700 ${el.className.replace(/\blabel\b/g, "").trim()}`;
  });
}

function getProfile() {
  try {
    return JSON.parse(localStorage.getItem("careerSphereProfile") || "null");
  } catch {
    return null;
  }
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  const target = $(page + "Page");
  if (target) target.classList.remove("hidden");

  window.scrollTo({top:0, behavior:"smooth"});

  if (page === "jobs") renderJobs();
  if (page === "interview") renderInterview();
  if (page === "confirmation") renderConfirmation();
}

function saveProfile(e) {
  e.preventDefault();

  const profile = {
    name: $("name").value.trim(),
    email: $("email").value.trim(),
    phone: $("phone").value.trim(),
    profession: $("profession").value.trim(),
    experience: $("experience").value,
    location: $("location").value.trim(),
    college: $("college").value.trim(),
    degree: $("degree").value.trim(),
    branch: $("branch").value.trim(),
    graduation: $("graduation").value.trim(),
    cgpa: $("cgpa").value.trim(),
    skills: $("skills").value.trim(),
    projects: $("projects").value.trim(),
    github: $("github").value.trim(),
    linkedin: $("linkedin").value.trim(),
    resumeName: $("resume").files[0]?.name || getProfile()?.resumeName || "",
    codingLevel: $("codingLevel").value,
    interest: $("interest").value.trim()
  };

  localStorage.setItem("careerSphereProfile", JSON.stringify(profile));
  showPage("jobs");
}

function getMatch(job) {
  const profile = getProfile();
  if (!profile) return 55;

  const profileSkills = (profile.skills || "").toLowerCase();
  const matchedSkills = job.skills.filter(s => profileSkills.includes(s.toLowerCase())).length;
  const skillScore = (matchedSkills / job.skills.length) * 55;

  const degree = (profile.degree || "").toLowerCase();
  const degreeTokens = degree.split(/[\s/]+/).filter(Boolean);
  const degreeScore = degreeTokens.some(token => token.length > 1 && job.degree.toLowerCase().includes(token)) ? 20 : 8;

  const location = (profile.location || "").toLowerCase();
  const locationScore = location && (
    job.location.toLowerCase().includes(location) ||
    (location === "remote" && job.type.toLowerCase() === "remote")
  ) ? 15 : 7;

  const expScore = profile.experience === job.exp || job.exp === "Fresher" ? 10 : 5;

  return Math.min(99, Math.round(skillScore + degreeScore + locationScore + expScore));
}

function companyIcon(company) {
  const icons = {
    Google:"G", Microsoft:"M", Amazon:"A", Infosys:"I", Accenture:"A",
    TCS:"T", IBM:"IBM", Adobe:"A", Deloitte:"D", Wipro:"W", Capgemini:"C"
  };
  return icons[company] || company[0];
}

function getSalaryFilter() {
  return Number($("salaryFilter")?.value || 0);
}

function renderJobs() {
  const grid = $("jobsGrid");
  if (!grid) return;

  const search = ($("jobSearch")?.value || "").toLowerCase().trim();
  const location = ($("filterLocation")?.value || "").toLowerCase().trim();
  const experience = $("filterExperience")?.value || "";
  const type = $("filterType")?.value || "";
  const company = $("filterCompany")?.value || "";
  const skill = ($("filterSkill")?.value || "").toLowerCase().trim();
  const minSalary = getSalaryFilter();

  const filtered = jobs.filter(job => {
    const searchable = [job.company, job.role, job.location, job.type, job.degree, ...job.skills].join(" ").toLowerCase();

    const matchesSearch = searchable.includes(search);
    const matchesLocation = !location || job.location.toLowerCase() === location || (location === "remote" && job.type.toLowerCase() === "remote");
    const matchesExperience = !experience || job.exp === experience;
    const matchesType = !type || job.type === type;
    const matchesCompany = !company || job.company === company;
    const matchesSkill = !skill || job.skills.some(s => s.toLowerCase() === skill);
    const matchesSalary = job.minSalary >= minSalary;

    return matchesSearch && matchesLocation && matchesExperience && matchesType &&
           matchesCompany && matchesSkill && matchesSalary;
  });

  if ($("salaryValue")) $("salaryValue").textContent = `₹${minSalary} LPA+`;
  if ($("jobCount")) $("jobCount").textContent = `Showing ${filtered.length} of ${jobs.length} jobs`;

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="xl:col-span-2 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <div class="text-4xl">🔎</div>
        <h3 class="mt-4 text-xl font-black">No matching jobs</h3>
        <p class="mt-2 text-slate-500">Try changing one or more filters.</p>
        <button onclick="resetFilters()" class="mt-5 rounded-xl bg-violet-600 px-5 py-3 font-bold text-white">Reset Filters</button>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(job => {
    const match = getMatch(job);
    return `
      <article class="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl">
        <div class="flex items-start justify-between gap-4">
          <div class="flex min-w-0 items-center gap-4">
            <div class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-violet-100 text-xl font-black text-violet-700">${companyIcon(job.company)}</div>
            <div class="min-w-0">
              <p class="font-black">${job.company}</p>
              <h2 class="mt-1 truncate text-lg font-black group-hover:text-violet-700">${job.role}</h2>
            </div>
          </div>
          <span class="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-600">${match}% Match</span>
        </div>

        <div class="mt-5 grid grid-cols-2 gap-2 text-sm">
          <span class="rounded-xl bg-slate-50 px-3 py-2 font-semibold text-slate-600">📍 ${job.location}</span>
          <span class="rounded-xl bg-slate-50 px-3 py-2 font-semibold text-slate-600">💼 ${job.type}</span>
          <span class="rounded-xl bg-slate-50 px-3 py-2 font-semibold text-slate-600">🎓 ${job.degree}</span>
          <span class="rounded-xl bg-slate-50 px-3 py-2 font-semibold text-slate-600">💰 ${job.salary}</span>
        </div>

        <div class="mt-5">
          <p class="text-xs font-black uppercase tracking-wider text-slate-400">Required skills</p>
          <div class="mt-2 flex flex-wrap gap-2">
            ${job.skills.map(skillName => `<span class="rounded-lg bg-violet-50 px-2.5 py-1.5 text-xs font-bold text-violet-700">${skillName}</span>`).join("")}
          </div>
        </div>

        <div class="mt-5 rounded-2xl bg-slate-50 p-3 text-xs text-slate-500">
          <span class="font-black text-slate-700">Before applying:</span> Check degree, experience and required skills.
        </div>

        <button onclick="selectJob(${job.id})" class="mt-5 w-full rounded-2xl bg-slate-900 px-5 py-3.5 font-black text-white transition hover:bg-violet-600">
          View Role & Prepare →
        </button>
      </article>`;
  }).join("");
}

function syncMobileSearch() {
  if ($("jobSearch")) {
    $("jobSearch").value = $("jobSearchMobile").value;
    renderJobs();
  }
}

function applyRecommendedFilters() {
  const profile = getProfile();

  if (!profile) {
    alert("Please create your profile first.");
    showPage("profile");
    return;
  }

  const location = (profile.location || "").trim();
  const experience = profile.experience || "";
  const skills = (profile.skills || "").split(",").map(s => s.trim()).filter(Boolean);

  if ($("filterLocation")) {
    const locationOption = [...$("filterLocation").options].find(
      option => option.value.toLowerCase() === location.toLowerCase()
    );
    $("filterLocation").value = locationOption ? locationOption.value : "";
  }

  if ($("filterExperience")) {
    const expOption = [...$("filterExperience").options].find(
      option => option.value === experience
    );
    $("filterExperience").value = expOption ? experience : "";
  }

  if ($("filterSkill") && skills.length) {
    const skillOption = [...$("filterSkill").options].find(
      option => option.value.toLowerCase() === skills[0].toLowerCase()
    );
    $("filterSkill").value = skillOption ? skillOption.value : "";
  }

  renderJobs();
}

function resetFilters() {
  ["jobSearch", "filterLocation", "filterExperience", "filterType", "filterCompany", "filterSkill"].forEach(id => {
    if ($(id)) $(id).value = "";
  });

  if ($("salaryFilter")) $("salaryFilter").value = 0;
  if ($("jobSearchMobile")) $("jobSearchMobile").value = "";

  renderJobs();
}

function selectJob(id) {
  const job = jobs.find(j => j.id === id);
  if (!job) return;

  localStorage.setItem("selectedJob", JSON.stringify(job));
  showPage("interview");
}

function renderInterview() {
  const job = JSON.parse(localStorage.getItem("selectedJob") || "null");
  const profile = getProfile();

  if (!job) {
    $("selectedJobBox").innerHTML = `
      <div class="rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <p class="font-bold text-slate-600">Please select a job first.</p>
        <button onclick="showPage('jobs')" class="mt-4 rounded-xl bg-violet-600 px-5 py-3 font-bold text-white">Browse Jobs</button>
      </div>`;
    return;
  }

  const match = getMatch(job);

  $("selectedJobBox").innerHTML = `
    <div class="rounded-3xl border border-violet-100 bg-white p-7 shadow-glow">
      <div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p class="font-bold text-violet-600">${job.company}</p>
          <h2 class="mt-1 text-2xl font-black">${job.role}</h2>
          <p class="mt-2 text-sm text-slate-500">${job.location} · ${job.type} · ${job.exp} · ${job.salary}</p>
        </div>
        <div class="rounded-2xl bg-emerald-50 px-5 py-4 text-center">
          <p class="text-xs font-black text-emerald-600">PROFILE MATCH</p>
          <p class="mt-1 text-3xl font-black text-emerald-700">${match}%</p>
        </div>
      </div>

      <div class="mt-6 border-t border-slate-100 pt-5">
        <p class="text-sm font-black text-slate-700">Requirements before applying</p>
        <div class="mt-3 grid gap-3 sm:grid-cols-3">
          <div class="rounded-2xl bg-slate-50 p-4"><p class="text-xs font-bold text-slate-400">Education</p><p class="mt-1 font-black">${job.degree}</p></div>
          <div class="rounded-2xl bg-slate-50 p-4"><p class="text-xs font-bold text-slate-400">Experience</p><p class="mt-1 font-black">${job.exp}</p></div>
          <div class="rounded-2xl bg-slate-50 p-4"><p class="text-xs font-bold text-slate-400">Work Mode</p><p class="mt-1 font-black">${job.type}</p></div>
        </div>
      </div>

      <div class="mt-6 border-t border-slate-100 pt-5">
        <p class="text-sm font-black text-slate-700">Required skills</p>
        <div class="mt-3 flex flex-wrap gap-2">
          ${job.skills.map(s => `<span class="rounded-xl bg-violet-50 px-3 py-2 text-sm font-bold text-violet-700">${s}</span>`).join("")}
        </div>
      </div>
    </div>`;

  fillApplicationForm(profile);
}

function fillApplicationForm(profile) {
  if (!profile) return;

  const fields = {
    applicationName: profile.name,
    applicationEmail: profile.email,
    applicationPhone: profile.phone,
    applicationCollege: profile.college,
    applicationDegree: profile.degree,
    applicationSkills: profile.skills,
    applicationResume: profile.resumeName ? `Selected resume: ${profile.resumeName}` : "No resume selected"
  };

  Object.entries(fields).forEach(([id, value]) => {
    if ($(id)) {
      if (id === "applicationResume") {
        $(id).textContent = value;
      } else if (!$(id).value) {
        $(id).value = value || "";
      }
    }
  });
}

async function submitApplication(e) {
  e.preventDefault();

  const profile = getProfile();
  const job = JSON.parse(localStorage.getItem("selectedJob") || "null");

  if (!profile) {
    alert("Please create your profile before applying.");
    showPage("profile");
    return;
  }

  if (!job) {
    alert("Please select a job first.");
    showPage("jobs");
    return;
  }

  const application = {
    applicant: $("applicationName").value.trim(),
    email: $("applicationEmail").value.trim(),
    phone: $("applicationPhone").value.trim(),
    college: $("applicationCollege").value.trim(),
    degree: $("applicationDegree").value.trim(),
    skills: $("applicationSkills").value.trim(),
    message: $("applicationMessage").value.trim(),
    resumeName: profile.resumeName || "Not selected",
    company: job.company,
    role: job.role,
    location: job.location,
    type: job.type,
    match: getMatch(job),
    submittedAt: new Date().toLocaleString()
  };

  if (!application.email) {
    alert("Please enter a valid email address.");
    return;
  }

  localStorage.setItem("lastApplication", JSON.stringify(application));

  const form = document.createElement("form");
  form.method = "POST";
  form.action = `https://formsubmit.co/${RECEIVER_EMAIL}`;
  form.target = "careerSphereMailFrame";
  form.style.display = "none";

  const fields = {
    _subject: `New CareerSphere Application - ${job.role} at ${job.company}`,
    _template: "table",
    _captcha: "false",
    _replyto: application.email,
    _honey: "",
    name: application.applicant,
    email: application.email,
    phone: application.phone,
    college: application.college,
    degree: application.degree,
    skills: application.skills,
    role: application.role,
    company: application.company,
    job_location: application.location,
    work_mode: application.type,
    profile_match: `${application.match}%`,
    resume: application.resumeName,
    message: application.message || "No additional message provided.",
    submitted_at: application.submittedAt
  };

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);

  const button = $("applicationForm").querySelector("button[type='submit']");
  if (button) {
    button.disabled = true;
    button.textContent = "Sending Application...";
  }

  form.submit();

  setTimeout(() => {
    form.remove();
    if (button) {
      button.disabled = false;
      button.textContent = "Send Application →";
    }
    showPage("confirmation");
  }, 1200);
}

function renderConfirmation() {
  const app = JSON.parse(localStorage.getItem("lastApplication") || "null");

  if (!app) {
    $("confirmationDetails").innerHTML = `<p class="text-slate-500">No recent application found.</p>`;
    return;
  }

  $("confirmationDetails").innerHTML = `
    <div class="grid gap-4 sm:grid-cols-2">
      <div><p class="text-xs font-black uppercase tracking-wider text-slate-400">Applicant</p><p class="mt-1 font-black">${app.applicant}</p></div>
      <div><p class="text-xs font-black uppercase tracking-wider text-slate-400">Email</p><p class="mt-1 font-black">${app.email}</p></div>
      <div><p class="text-xs font-black uppercase tracking-wider text-slate-400">Company</p><p class="mt-1 font-black">${app.company}</p></div>
      <div><p class="text-xs font-black uppercase tracking-wider text-slate-400">Role</p><p class="mt-1 font-black">${app.role}</p></div>
      <div><p class="text-xs font-black uppercase tracking-wider text-slate-400">Profile Match</p><p class="mt-1 font-black text-emerald-600">${app.match}%</p></div>
      <div><p class="text-xs font-black uppercase tracking-wider text-slate-400">Submitted</p><p class="mt-1 font-black">${app.submittedAt}</p></div>
    </div>

    <div class="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
      <b>Application sent:</b> Your application was submitted to the configured CareerSphere receiving email.
    </div>`;
}

window.showPage = showPage;
window.renderJobs = renderJobs;
window.selectJob = selectJob;
window.resetFilters = resetFilters;
window.applyRecommendedFilters = applyRecommendedFilters;
window.syncMobileSearch = syncMobileSearch;

document.addEventListener("DOMContentLoaded", () => {
  applyUtilityClasses();

  if ($("profileForm")) {
    $("profileForm").addEventListener("submit", saveProfile);
  }

  if ($("applicationForm")) {
    $("applicationForm").addEventListener("submit", submitApplication);
  }

  const profile = getProfile();

  if (profile) {
    Object.keys(profile).forEach(key => {
      const el = $(key);
      if (el && key !== "resumeName" && typeof profile[key] === "string") {
        el.value = profile[key];
      }
    });
  }

  renderJobs();
});
