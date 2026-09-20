document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-button");
  const navLinks = document.querySelector(".nav-links");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      menuButton.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
    });
    navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.textContent = "☰";
    }));
  }

  const nftGrid = document.getElementById("nftGrid");
  const loadMore = document.getElementById("loadMore");
  const filters = document.querySelectorAll(".filter");
  const totalNFTs = 44;
  let visibleNFTs = 12;
  let currentFilter = "all";

  function getTrait(index) {
    const traits = ["cool","rare","mystery","cool","rare","cool","mystery","rare"];
    return traits[(index - 1) % traits.length];
  }

  function createNFT(index) {
    const number = String(index).padStart(4, "0");
    const trait = getTrait(index);
    const card = document.createElement("article");
    card.className = "nft-card";
    card.dataset.trait = trait;

    const image = document.createElement("div");
    image.className = "nft-image";

    const img = document.createElement("img");
    img.src = `nft-${index}.png`;
    img.alt = `Catzovia NFT #${number}`;
    img.loading = "lazy";
    img.onerror = () => {
      image.innerHTML = "";
      const fallback = document.createElement("div");
      fallback.style.cssText = "width:100%;height:100%;display:grid;place-items:center;color:white;font-family:monospace;font-size:12px;";
      fallback.textContent = `CAT #${number}`;
      image.appendChild(fallback);
    };
    image.appendChild(img);

    const info = document.createElement("div");
    info.className = "nft-info";
    info.innerHTML = `<span class="nft-name">CAT #${number}</span><span class="nft-trait">${trait.toUpperCase()}</span>`;

    card.appendChild(image);
    card.appendChild(info);
    return card;
  }

  function getAvailableCount() {
    if (currentFilter === "all") return totalNFTs;
    let count = 0;
    for (let i = 1; i <= totalNFTs; i++) if (getTrait(i) === currentFilter) count++;
    return count;
  }

  function renderNFTs() {
    if (!nftGrid) return;
    nftGrid.innerHTML = "";
    let displayed = 0;

    for (let i = 1; i <= totalNFTs; i++) {
      if (currentFilter !== "all" && getTrait(i) !== currentFilter) continue;
      if (displayed >= visibleNFTs) break;
      nftGrid.appendChild(createNFT(i));
      displayed++;
    }

    animateNFTCards();

    if (loadMore) loadMore.style.display = displayed < getAvailableCount() ? "block" : "none";
  }

  function animateNFTCards() {
    if (!nftGrid) return;

    const cards = nftGrid.querySelectorAll(".nft-card");

    cards.forEach((card, index) => {
      card.style.transitionDelay = `${Math.min(index * 55, 440)}ms`;
    });

    if (!("IntersectionObserver" in window)) {
      cards.forEach(card => card.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    cards.forEach(card => observer.observe(card));
  }

  if (loadMore) loadMore.addEventListener("click", () => {
    visibleNFTs += 8;
    renderNFTs();
  });

  filters.forEach(filter => {
    filter.addEventListener("click", () => {
      filters.forEach(button => button.classList.remove("active"));
      filter.classList.add("active");
      currentFilter = filter.dataset.filter;
      visibleNFTs = 12;
      renderNFTs();
    });
  });

  renderNFTs();

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const walletForm = document.getElementById("walletForm");
  const formStatus = document.getElementById("formStatus");

  if (walletForm) {
    walletForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (formStatus) {
        formStatus.className = "form-status";
        formStatus.textContent = "Submitting...";
      }

      const wallet = document.getElementById("wallet");
      if (!wallet || wallet.value.trim().length < 8) {
        if (formStatus) {
          formStatus.className = "form-status error";
          formStatus.textContent = "Please enter a valid wallet address.";
        }
        return;
      }

      try {
        const response = await fetch(walletForm.action, {
          method: "POST",
          body: new FormData(walletForm),
          headers: { "Accept": "application/json" }
        });

        if (!response.ok) throw new Error("Submission failed");

        walletForm.reset();
        if (formStatus) {
          formStatus.className = "form-status success";
          formStatus.textContent = "Submitted Successfully! 🐾";
        }
      } catch (error) {
        if (formStatus) {
          formStatus.className = "form-status error";
          formStatus.textContent = "Something went wrong. Please try again.";
        }
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
});
