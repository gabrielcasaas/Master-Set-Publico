(() => {
  const regions = { kanto: [1, 151], johto: [152, 251], hoenn: [252, 386], sinnoh: [387, 493], unova: [494, 649], kalos: [650, 721], alola: [722, 809], galar: [810, 905], paldea: [906, 1025] };
  const elements = { grid: document.querySelector("#grid"), search: document.querySelector("#search"), region: document.querySelector("#region-filter"), count: document.querySelector("#card-count"), value: document.querySelector("#collection-value"), updated: document.querySelector("#updated-at"), result: document.querySelector("#result-count"), modal: document.querySelector("#card-modal"), close: document.querySelector("#close-modal"), image: document.querySelector("#modal-image"), index: document.querySelector("#modal-index"), name: document.querySelector("#modal-name"), set: document.querySelector("#modal-set"), price: document.querySelector("#modal-price"), liga: document.querySelector("#modal-liga") };
  let cards = [];
  const money = value => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);
  const inRegion = (id, region) => region === "all" || (regions[region] && id >= regions[region][0] && id <= regions[region][1]);
  const ligaUrl = card => {
    const number = String(card.liga?.lookupNumber || card.liga?.number || card.number || ""); const total = String(card.liga?.total || "");
    const url = new URL("https://www.ligapokemon.com.br/"); url.searchParams.set("view", "cards/card"); url.searchParams.set("card", `${card.liga?.name || card.name} (${number}/${total})`); return url;
  };
  function render() {
    const term = elements.search.value.trim().toLowerCase(); const region = elements.region.value;
    const visible = cards.filter(entry => inRegion(entry.pokemonId, region) && (!term || `${entry.name} ${entry.card.name} ${entry.card.set} ${entry.card.number}`.toLowerCase().includes(term)));
    elements.result.textContent = `${visible.length} carta(s) exibida(s)`;
    const fragment = document.createDocumentFragment();
    visible.forEach(entry => { const button = document.createElement("button"); button.className = "tcg-card"; button.type = "button"; button.innerHTML = `<img src="${entry.card.thumbnail || entry.card.image}" alt="Carta ${entry.card.name}" loading="lazy" decoding="async"><span><small>#${String(entry.pokemonId).padStart(4, "0")}</small><strong>${entry.card.name}</strong><em>${entry.card.set} · ${entry.card.number}</em></span>`; button.addEventListener("click", () => openCard(entry)); fragment.append(button); });
    elements.grid.replaceChildren(fragment);
  }
  function openCard(entry) { const card = entry.card; elements.image.src = card.image; elements.image.alt = `Carta ${card.name}`; elements.index.textContent = `Pokédex #${String(entry.pokemonId).padStart(4, "0")}`; elements.name.textContent = card.name; elements.set.textContent = `${card.set} · #${card.number}`; elements.price.textContent = card.price?.currency === "BRL" ? money(card.price.amount) : "Preço não informado"; elements.liga.href = ligaUrl(card); elements.modal.showModal(); }
  async function load() { try { const response = await fetch("collection.json", { cache: "no-store" }); if (!response.ok) throw new Error(); const data = await response.json(); const selections = data.selections || {}; cards = Object.entries(selections).map(([pokemonId, card]) => ({ pokemonId: Number(pokemonId), name: card.name, card })).filter(entry => entry.card?.name).sort((a, b) => a.pokemonId - b.pokemonId); elements.count.textContent = cards.length; elements.value.textContent = money(cards.reduce((sum, entry) => sum + (entry.card.price?.currency === "BRL" ? Number(entry.card.price.amount) || 0 : 0), 0)); elements.updated.textContent = data.exportedAt ? new Date(data.exportedAt).toLocaleDateString("pt-BR") : "—"; render(); } catch { elements.result.textContent = "Não foi possível carregar a coleção. Publique o arquivo collection.json junto com o site."; } }
  elements.search.addEventListener("input", render); elements.region.addEventListener("change", render); elements.close.addEventListener("click", () => elements.modal.close()); elements.modal.addEventListener("click", event => { if (event.target === elements.modal) elements.modal.close(); }); document.querySelector("#year").textContent = new Date().getFullYear(); load();
})();
