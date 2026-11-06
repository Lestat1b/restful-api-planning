const list = document.getElementById("breed-list");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const count = document.getElementById("result-count");
let allBreeds = [];

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Accept": "application/json", ...(options.headers || {}) },
    ...options
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
  return payload;
}

function makeList(items) {
  const ul = document.createElement("ul");
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });
  return ul;
}

function renderBreeds(breeds) {
  list.replaceChildren();
  count.textContent = `${breeds.length} breed profile(s)`;
  if (!breeds.length) {
    const empty = document.createElement("p");
    empty.className = "message";
    empty.textContent = "No breeds match those filters.";
    list.appendChild(empty);
    return;
  }

  breeds.forEach(breed => {
    const card = document.createElement("article");
    card.className = "breed-card";

    const heading = document.createElement("h2");
    heading.textContent = breed.name;
    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = `${breed.group} Group · ${breed.size} · ${breed.lifespan}`;

    const temperament = document.createElement("p");
    temperament.textContent = breed.temperament;

    const stats = document.createElement("div");
    stats.className = "stats";
    [["Activity", breed.activity], ["Grooming", breed.grooming]].forEach(([label, value]) => {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = `${label}: `;
      p.append(strong, document.createTextNode(value));
      stats.appendChild(p);
    });

    const prosTitle = document.createElement("h3");
    prosTitle.textContent = "Pros";
    const consTitle = document.createElement("h3");
    consTitle.textContent = "Cons";
    const columns = document.createElement("div");
    columns.className = "pros-cons";
    const pros = document.createElement("div");
    pros.className = "pros";
    const cons = document.createElement("div");
    cons.className = "cons";
    pros.append(prosTitle, makeList(breed.pros));
    cons.append(consTitle, makeList(breed.cons));
    columns.append(pros, cons);

    const link = document.createElement("a");
    link.href = breed.akc_url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "View AKC breed page";

    card.append(heading, meta, temperament, stats, columns, link);
    list.appendChild(card);
  });
}

async function loadBreeds() {
  loading.hidden = false;
  errorBox.textContent = "";
  const params = new URLSearchParams();
  const q = document.getElementById("search").value.trim();
  const group = document.getElementById("group").value;
  const size = document.getElementById("size").value;
  const activity = document.getElementById("activity").value;
  if (q) params.set("q", q);
  if (group) params.set("group", group);
  if (size) params.set("size", size);
  if (activity) params.set("activity", activity);

  try {
    const result = await fetchJSON(`/api/breeds?${params.toString()}`);
    renderBreeds(result.breeds);
  } catch (err) {
    errorBox.textContent = `Could not load breeds: ${err.message}`;
  } finally {
    loading.hidden = true;
  }
}

async function initialize() {
  try {
    const [result, groupResult] = await Promise.all([
      fetchJSON("/api/breeds"),
      fetchJSON("/api/groups")
    ]);
    allBreeds = result.breeds;
    const groupSelect = document.getElementById("group");
    groupResult.groups.forEach(group => {
      const option = document.createElement("option");
      option.value = group;
      option.textContent = group;
      groupSelect.appendChild(option);
    });
    ["compare-a", "compare-b"].forEach(id => {
      const select = document.getElementById(id);
      allBreeds.forEach(breed => {
        const option = document.createElement("option");
        option.value = breed.slug;
        option.textContent = breed.name;
        select.appendChild(option);
      });
    });
    renderBreeds(allBreeds);
  } catch (err) {
    errorBox.textContent = `Application could not start: ${err.message}`;
  } finally {
    loading.hidden = true;
  }
}

["search", "group", "size", "activity"].forEach(id => {
  document.getElementById(id).addEventListener(id === "search" ? "input" : "change", loadBreeds);
});

document.getElementById("compare-button").addEventListener("click", async () => {
  const a = document.getElementById("compare-a").value;
  const b = document.getElementById("compare-b").value;
  const target = document.getElementById("comparison");
  target.replaceChildren();
  if (!a || !b || a === b) {
    target.textContent = "Choose two different breeds to compare.";
    return;
  }
  try {
    const [first, second] = await Promise.all([
      fetchJSON(`/api/breeds/${encodeURIComponent(a)}`),
      fetchJSON(`/api/breeds/${encodeURIComponent(b)}`)
    ]);
    const table = document.createElement("table");
    const rows = [
      ["Characteristic", first.name, second.name],
      ["Group", first.group, second.group],
      ["Size", first.size, second.size],
      ["Lifespan", first.lifespan, second.lifespan],
      ["Activity", first.activity, second.activity],
      ["Grooming", first.grooming, second.grooming]
    ];
    rows.forEach((values, index) => {
      const tr = document.createElement("tr");
      values.forEach(value => {
        const cell = document.createElement(index === 0 ? "th" : "td");
        cell.textContent = value;
        tr.appendChild(cell);
      });
      table.appendChild(tr);
    });
    target.appendChild(table);
  } catch (err) {
    target.textContent = `Comparison failed: ${err.message}`;
  }
});

document.getElementById("add-form").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const message = document.getElementById("form-message");
  message.textContent = "";
  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  data.pros = data.pros.split(";").map(s => s.trim()).filter(Boolean);
  data.cons = data.cons.split(";").map(s => s.trim()).filter(Boolean);

  try {
    const saved = await fetchJSON("/api/breeds", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    });
    message.textContent = `${saved.name} was saved.`;
    form.reset();
    await initialize();
  } catch (err) {
    message.textContent = `Could not save profile: ${err.message}`;
  }
});

initialize();
