/* Settings live in config.js */

const $ = (s) => document.querySelector(s);
const toast = $("#toast");

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* Footer year */
if ($("#year")) $("#year").textContent = new Date().getFullYear();

/* Nav background on scroll */
const nav = $("#nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* Live / pending state */
const isLive = Boolean(CONFIG.serverIp);
if (isLive && $("#statusChip")) {
  $("#statusChip").classList.remove("chip-pending");
  $("#statusChip").classList.add("chip-pending", "live");
  $("#statusText").textContent = "Server Live";
  if ($("#notice")) {
    $("#notice").classList.add("live");
    $("#noticeText").textContent = "Server online — jump in";
  }
}

/* Copy IP */
async function copyIp() {
  if (!CONFIG.serverIp) {
    showToast("Server link pending — check back soon");
    return;
  }
  try {
    await navigator.clipboard.writeText(CONFIG.serverIp);
    showToast("Server IP copied");
  } catch {
    showToast("Couldn't copy — " + CONFIG.serverIp);
  }
}
$("#copyIpNav").addEventListener("click", copyIp);
document.querySelectorAll("[data-join]").forEach((el) =>
  el.addEventListener("click", (e) => {
    e.preventDefault();
    // Join the City always goes to Discord (Copy IP in the nav copies the server IP).
    if (CONFIG.discordUrl) {
      window.open(CONFIG.discordUrl, "_blank", "noopener");
      return;
    }
    copyIp();
  })
);

/* External links */
function wire(id, url, label) {
  const el = $(id);
  if (!el) return;
  if (url) {
    el.href = url;
  } else {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showToast(label + " link coming soon");
    });
  }
}
wire("#applyLink", CONFIG.whitelistUrl, "Whitelist");
wire("#discordLink", CONFIG.discordUrl, "Discord");

/* Hide broken gallery images gracefully */
document.querySelectorAll("#galleryGrid img").forEach((img) =>
  img.addEventListener("error", () => {
    img.style.display = "none";
    img.parentElement.style.background =
      "repeating-linear-gradient(45deg,#14111a,#14111a 10px,#1a1620 10px,#1a1620 20px)";
  })
);
