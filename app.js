// ---------- tabs (hash based, so #part1 / #part2 links can be shared) ----------
const TABS = ["start", "part1", "part2"];

function tabFor(hash) {
  const id = (hash || "").replace("#", "");
  if (TABS.includes(id)) return { tab: id, anchor: null };
  // a deep link such as #p2-s4 opens the right tab and scrolls to the section
  const el = id && document.getElementById(id);
  const panel = el && el.closest(".panel");
  if (panel) return { tab: panel.id.replace("tab-", ""), anchor: el };
  return { tab: "start", anchor: null };
}

function showTab() {
  const { tab, anchor } = tabFor(location.hash);
  for (const id of TABS) document.getElementById("tab-" + id).hidden = id !== tab;
  document.querySelectorAll(".tabs a").forEach(a =>
    a.setAttribute("aria-selected", a.dataset.tab === tab ? "true" : "false"));
  if (anchor) anchor.scrollIntoView();
  else window.scrollTo(0, 0);
}

window.addEventListener("hashchange", showTab);
showTab();
// deep links into a hidden panel: scroll again once layout and images have settled
window.addEventListener("load", () => { const { anchor } = tabFor(location.hash); if (anchor) anchor.scrollIntoView(); });

// keep the tab bar visible when scrolling: the header slides up by its own height minus the tabs
function setHeaderOffset() {
  const header = document.querySelector(".site-header");
  const tabs = document.querySelector(".tabs");
  header.style.setProperty("--hdr", (header.offsetHeight - tabs.offsetHeight) + "px");
}
window.addEventListener("resize", setHeaderOffset);
setHeaderOffset();

// ---------- copy to clipboard ----------
const toast = document.getElementById("toast");
let toastTimer;

function flash(msg) {
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 1400);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // fallback for browsers without clipboard API permission
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

document.addEventListener("click", async e => {
  const btn = e.target.closest("button.copy");
  if (btn) {
    const box = btn.closest(".seq, .code");
    let text = box.querySelector("pre").textContent;
    // sequences go to the server as one unbroken line
    if (box.classList.contains("seq")) text = text.replace(/\s+/g, "");
    await copyText(text);
    const old = btn.textContent;
    btn.textContent = "Copied";
    btn.classList.add("done");
    setTimeout(() => { btn.textContent = old; btn.classList.remove("done"); }, 1400);
    return;
  }
  const inline = e.target.closest(".inline-copy");
  if (inline) {
    await copyText(inline.dataset.copy);
    flash("Copied " + inline.dataset.copy);
  }
});

// ---------- sequence lengths ----------
document.querySelectorAll(".seq").forEach(box => {
  const pre = box.querySelector("pre");
  const len = box.querySelector(".len");
  if (!pre.classList.contains("muted")) len.textContent = pre.textContent.replace(/\s+/g, "").length + " aa";
});

// ---------- trimmer for the minimal complex ----------
const FULL = {
  ift52: document.querySelectorAll("#p2-s1 ~ .job .seq pre")[0].textContent.replace(/\s+/g, ""),
  ift46: document.querySelectorAll("#p2-s1 ~ .job .seq pre")[1].textContent.replace(/\s+/g, ""),
};

document.querySelectorAll(".trim").forEach(row => {
  const full = FULL[row.dataset.src];
  const from = row.querySelector(".from");
  const to = row.querySelector(".to");
  const pre = row.querySelector("pre");
  const len = row.querySelector(".len");
  const btn = row.querySelector("button.copy");

  function update() {
    const a = parseInt(from.value, 10);
    const b = parseInt(to.value, 10);
    if (!a || !b) {
      pre.textContent = "Enter a range above."; pre.classList.add("muted");
      len.textContent = ""; btn.disabled = true; return;
    }
    if (a < 1 || b > full.length || a > b) {
      pre.textContent = `Range must be within 1–${full.length}, with "from" ≤ "to".`;
      pre.classList.add("muted"); len.textContent = ""; btn.disabled = true; return;
    }
    const s = full.slice(a - 1, b);
    pre.textContent = s; pre.classList.remove("muted");
    len.textContent = `residues ${a}–${b}, ${s.length} aa`;
    btn.disabled = false;
  }
  from.addEventListener("input", update);
  to.addEventListener("input", update);
});
