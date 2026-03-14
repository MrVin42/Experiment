(() => {
  const MAX_PILLS = 400;
  const MAX_SURFERS = 120;
  const PILL_GRID_CELL_SIZE = 120;
  const MAX_PILL_COLLISION_RADIUS = 32;
  const SURFER_COLLISION_HZ = 30;
  const SURFER_SPLIT_COOLDOWN_MS = 1200;
  const SURFER_MAX_SPLIT_DEPTH = 2;
  const SURFER_SPLIT_BUDGET_PER_SECOND = 10;
  const SURFER_HIT_SPLIT_CAP = 2;
  const PILL_SPRITE_SCALE = 2;
  const MAX_PILL_BURSTS_PER_SECOND = 5;
  const LAUNCHER_SIZE = 58;
  const LAUNCHER_RADIUS = LAUNCHER_SIZE * 0.5;
  const UPGRADE_UNLOCK_AURA = 10;
  const FLEX_CHAIN = ["flex1", "flex2", "gigaFlex", "shakaBruddah"];
  const BRO_TYPE_CHAIN = [
    "braDialect",
    "brotherDialect",
    "broskiDialect",
    "brosquitoDialect",
    "bruvDialect",
    "broasurusRexDialect",
    "bratholomewDialect"
  ];
  const LAUNCHER_CHAIN = [
    "bruhCore",
    "bruhLonger",
    "bruhSquad",
    "waveRider"
  ];
  const AUTO_BRUH_CHAIN = ["autoBruh", "broAi"];
  const PROGRESSIVE_TREES = [FLEX_CHAIN, BRO_TYPE_CHAIN, LAUNCHER_CHAIN, AUTO_BRUH_CHAIN];

  const COLORS = [
    "linear-gradient(135deg, #28f1cd, #3fa4ff)",
    "linear-gradient(135deg, #ff7dbd, #ffe176)",
    "linear-gradient(135deg, #ffe176, #28f1cd)",
    "linear-gradient(135deg, #85f7ff, #ff9fd0)",
    "linear-gradient(135deg, #9be15d, #00e3ae)"
  ];

  const FLAVOR_LINES = [
    "That was disrespectfully bro.",
    "Bra energy is peaking.",
    "Brotherhood stocks are pumping.",
    "Unreal deltoid-based economics.",
    "Every click adds 1% more lore.",
    "No cap: this is professional bro science.",
    "You are now the chief bra officer.",
    "The crowd is chanting BRO in 4/4 time."
  ];

  const UPGRADE_DEFS_RAW = [
    {
      id: "flex1",
      name: "Flex On Em",
      description: "Unlock flex cursor and nearby-smash click aura.",
      baseCost: 10,
      prerequisites: [],
      apply: (fx) => {
        fx.cursorEnabled = true;
        fx.cursorSize = "36px";
        fx.hitRadius = Math.max(fx.hitRadius, 70);
      }
    },
    {
      id: "flex2",
      name: "Flex On Em XL",
      description: "Wider hit aura and bigger cursor flex.",
      baseCost: 28,
      prerequisites: ["flex1"],
      apply: (fx) => {
        fx.hitRadius = Math.max(fx.hitRadius, 110);
        fx.cursorSize = "46px";
      }
    },
    {
      id: "gigaFlex",
      name: "Giga Flex Mythic",
      description: "Massive click aura. Deltoids now legally classified as weather.",
      baseCost: 80,
      prerequisites: ["flex2"],
      apply: (fx) => {
        fx.hitRadius = Math.max(fx.hitRadius, 155);
        fx.cursorSize = "58px";
      }
    },
    {
      id: "shakaBruddah",
      name: "Shaka Bruddah",
      description: "Final flex form. Cursor becomes a giant shaka and the click aura gets even wider.",
      baseCost: 120,
      prerequisites: ["gigaFlex"],
      apply: (fx) => {
        fx.hitRadius = Math.max(fx.hitRadius, 185);
        fx.cursorSize = "87px";
        fx.cursorGlyph = "\u{1F919}";
      }
    },
    {
      id: "broconomics",
      name: "Broconomics 101",
      description: "Gain +1 Aura per smash.",
      baseCost: 22,
      prerequisites: [],
      apply: (fx) => {
        fx.auraPerHit += 1;
      }
    },
    {
      id: "splitCore",
      name: "Split Core",
      description: "Pills split harder when smashed.",
      baseCost: 36,
      prerequisites: ["broconomics"],
      apply: (fx) => {
        fx.splitCount += 2;
      }
    },
    {
      id: "chainReaction",
      name: "Chain Reaction",
      description: "25% chance for bonus split burst on smash.",
      baseCost: 66,
      prerequisites: ["splitCore"],
      apply: (fx) => {
        fx.chainChance = 0.25;
        fx.chainExtraSplit = 3;
      }
    },
    {
      id: "braDialect",
      name: "Bra Dialect",
      description: "New pill vocabulary: bra joins the rotation.",
      baseCost: 30,
      prerequisites: [],
      apply: (fx) => {
        fx.vocab.push({ text: "bra", weight: 1, voice: "bra", auraBonus: 1 });
      }
    },
    {
      id: "brotherDialect",
      name: "Brother Dialect",
      description: "Add brother pills and bigger payout from them.",
      baseCost: 54,
      prerequisites: ["braDialect"],
      apply: (fx) => {
        fx.vocab.push({ text: "brother", weight: 0.6, voice: "brother", auraBonus: 2 });
      }
    },
    {
      id: "broskiDialect",
      name: "Broski",
      description: "Unlock Broski pills. Each smash gives extra Aura.",
      baseCost: 70,
      prerequisites: ["brotherDialect"],
      apply: (fx) => {
        fx.vocab.push({ text: "broski", weight: 0.5, voice: "broski", auraBonus: 3 });
      }
    },
    {
      id: "brosquitoDialect",
      name: "Brosquito",
      description: "Unlock Brosquito pills with even higher Aura payout.",
      baseCost: 95,
      prerequisites: ["broskiDialect"],
      apply: (fx) => {
        fx.vocab.push({ text: "brosquito", weight: 0.42, voice: "brosquito", auraBonus: 4 });
      }
    },
    {
      id: "bruvDialect",
      name: "Bruv",
      description: "Unlock Bruv pills. More rare, more valuable.",
      baseCost: 130,
      prerequisites: ["brosquitoDialect"],
      apply: (fx) => {
        fx.vocab.push({ text: "bruv", weight: 0.35, voice: "bruv", auraBonus: 7 });
      }
    },
    {
      id: "broasurusRexDialect",
      name: "Broasurus Rex",
      description: "Ancient bro DNA: huge Aura per smash.",
      baseCost: 180,
      prerequisites: ["bruvDialect"],
      apply: (fx) => {
        fx.vocab.push({ text: "broasurus rex", weight: 0.24, voice: "broasurus", auraBonus: 9 });
      }
    },
    {
      id: "bratholomewDialect",
      name: "Bratholomew",
      description: "Legendary bro form. Massive Aura payout per click.",
      baseCost: 240,
      prerequisites: ["broasurusRexDialect"],
      apply: (fx) => {
        fx.vocab.push({ text: "bratholomew", weight: 0.18, voice: "bratholomew", auraBonus: 14 });
      }
    },
    {
      id: "bruhCore",
      name: "Bruh Launcher",
      description: "Clicks spawn BRUH launchers that ricochet and smash pills.",
      baseCost: 44,
      prerequisites: [],
      apply: (fx) => {
        fx.launcherEnabled = true;
        fx.launcherMax = Math.max(fx.launcherMax, 1);
        fx.launcherLifetimeMs = Math.max(fx.launcherLifetimeMs, 10000);
      }
    },
    {
      id: "bruhLonger",
      name: "Extended Bruh Mix",
      description: "Launchers stay alive longer.",
      baseCost: 75,
      prerequisites: ["bruhCore"],
      apply: (fx) => {
        fx.launcherLifetimeMs = Math.max(fx.launcherLifetimeMs, 17000);
      }
    },
    {
      id: "bruhSquad",
      name: "Bruh Squad",
      description: "Increase active BRUH launcher cap to 3.",
      baseCost: 110,
      prerequisites: ["bruhCore", "bruhLonger"],
      apply: (fx) => {
        fx.launcherMax = Math.max(fx.launcherMax, 3);
      }
    },
    {
      id: "waveRider",
      name: "Wave Rider",
      description: "Surfer launcher gains a temporary speed boost after each hit chain.",
      baseCost: 140,
      prerequisites: ["bruhSquad"],
      apply: (fx) => {
        fx.launcherChainBoost = Math.max(fx.launcherChainBoost, 0.22);
      }
    },
    {
      id: "autoBruh",
      name: "Auto Bruh Engine",
      description: "Automatically spawn BRUH launchers every 5 seconds.",
      baseCost: 145,
      prerequisites: ["waveRider"],
      apply: (fx) => {
        fx.autoLauncherMs = Math.min(fx.autoLauncherMs, 5000);
      }
    },
    {
      id: "broAi",
      name: "Bro AI",
      description: "Auto Bruh spawns every 3 seconds and passive Aura trickles in.",
      baseCost: 220,
      prerequisites: ["autoBruh"],
      apply: (fx) => {
        fx.autoLauncherMs = Math.min(fx.autoLauncherMs, 3000);
        fx.passiveAuraPerSecond += 1;
      }
    },
    {
      id: "auraPrinter",
      name: "Aura Printer",
      description: "Passive Aura generation +2 per second.",
      baseCost: 160,
      prerequisites: ["brotherDialect"],
      apply: (fx) => {
        fx.passiveAuraPerSecond += 2;
      }
    },
    {
      id: "bruther",
      name: "BRUTHER",
      description: "Unlock BRUTHER button. It wipes almost all pills in one callout.",
      baseCost: 280,
      prerequisites: ["gigaFlex", "bruhSquad", "brotherDialect"],
      apply: (fx) => {
        fx.brutherEnabled = true;
      }
    }
  ];

    function scaleUpgradeCost(index, totalUpgrades) {
    const minCost = 10;
    const maxCost = 1000000;
    if (totalUpgrades <= 1) return minCost;
    const t = index / (totalUpgrades - 1);
    const logMin = Math.log10(minCost);
    const logMax = Math.log10(maxCost);
    const value = Math.pow(10, logMin + (logMax - logMin) * t);
    return Math.round(value);
  }

  const UPGRADE_DEFS = UPGRADE_DEFS_RAW.map((upgrade, index, all) => ({
    ...upgrade,
    cost: scaleUpgradeCost(index, all.length)
  }));

  const BRO_CLICK_TYPES = ["bro", "bra", "brother", "broski", "brosquito", "bruv", "broasurus", "bratholomew"];
  const BRO_CLICK_LABELS = {
    bro: "Bro",
    bra: "Bra",
    brother: "Brother",
    broski: "Broski",
    brosquito: "Brosquito",
    bruv: "Bruv",
    broasurus: "Broasurus Rex",
    bratholomew: "Bratholomew"
  };

  const elements = {
    appRoot: document.getElementById("appRoot"),
    broButton: document.getElementById("broButton"),
    pillContainer: document.getElementById("pillContainer"),
    auraDisplay: document.getElementById("auraDisplay"),
    auraCount: document.getElementById("auraCount"),
    statsToggle: document.getElementById("statsToggle"),
    statsMenu: document.getElementById("statsMenu"),
    statsClose: document.getElementById("statsClose"),
    statTotalBros: document.getElementById("statTotalBros"),
    statSurferBrosCreated: document.getElementById("statSurferBrosCreated"),
    statAuraFarmed: document.getElementById("statAuraFarmed"),
    statBrosClicked: document.getElementById("statBrosClicked"),
    devToggle: document.getElementById("devToggle"),
    upgradeMenu: document.getElementById("upgradeMenu"),
    upgradeTree: document.getElementById("upgradeTree"),
    menuClose: document.getElementById("menuClose"),
    customCursor: document.getElementById("customCursor"),
    subtitle: document.getElementById("subtitle"),
    brutherButton: document.getElementById("brutherButton")
  };

  const state = {
    started: false,
    aura: 0,
    purchased: new Set(),
    pills: [],
    launchers: [],
    dirtyPills: false,
    pillGrid: new Map(),
    effects: null,
    lastFrameTs: performance.now(),
    lastAutoLauncherAt: 0,
    lastFlavorAt: 0,
    nextPassiveTickAt: 0,
    cursorX: -999,
    cursorY: -999,
    launcherCollisionAccumulator: 0,
    surferSplitBudget: SURFER_SPLIT_BUDGET_PER_SECOND,
    lastBruhVoiceAt: 0,
    lastSurferVoiceAt: 0,
    burstWindowStartAt: 0,
    burstCountInWindow: 0,
    devMode: false,
    statsDirty: true,
    pillCanvas: null,
    pillCtx: null,
    pillSprites: new Map(),
    canvasDirty: true,
    sessionStats: {
      totalBros: 0,
      surferBrosCreated: 0,
      auraFarmed: 0,
      brosClicked: Object.fromEntries(BRO_CLICK_TYPES.map((type) => [type, 0]))
    }
  };


  function createSoundboard() {
    const base = "experiment/Sounds";
    const clips = {
      bro: ["Bro1.ogg", "Bro2.ogg", "Bro3.ogg", "Bro4.ogg", "Bro5.ogg", "Bro6.ogg", "Bro7.ogg"],
      bra: ["Brah1.ogg", "Brah2.ogg"],
      brother: ["Brother.ogg"],
      broski: ["Broski.ogg"],
      brosquito: ["Brosquito.ogg"],
      bruv: ["Bruv.ogg", "Bruv1.ogg"],
      broasurus: ["BrosarusRex.ogg"],
      bratholomew: ["Bratholomew.ogg"],
      surfer: ["HangTen.ogg", "HangTen1.ogg"],
      hellYeahBrother: ["HellYeahBrother.ogg"]
    };

    function pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    const MAX_ACTIVE_SOUNDS = 3;
    const MAX_QUEUED_SOUNDS = 3;
    let activeSounds = 0;
    const soundQueue = [];

    function tryPlayNext() {
      while (activeSounds < MAX_ACTIVE_SOUNDS && soundQueue.length > 0) {
        const queued = soundQueue.shift();
        const audio = new Audio(`${base}/${queued.filename}`);
        audio.volume = queued.opts.volume ?? 0.9;
        const jitter = queued.opts.jitter ?? 0.04;
        const baseRate = queued.opts.rate ?? 1;
        audio.playbackRate = Math.max(0.75, Math.min(1.35, baseRate + randomFloat(-jitter, jitter)));

        activeSounds += 1;
        const release = () => {
          activeSounds = Math.max(0, activeSounds - 1);
          tryPlayNext();
        };

        audio.addEventListener("ended", release, { once: true });
        audio.addEventListener("error", release, { once: true });
        audio.play().catch(release);
      }
    }

    function playClip(filename, opts = {}) {
      if (!filename) return false;
      if (soundQueue.length >= MAX_QUEUED_SOUNDS) {
        soundQueue.shift();
      }
      soundQueue.push({ filename, opts });
      tryPlayNext();
      return true;
    }

    function playVoice(key, opts = {}) {
      const arr = clips[key];
      if (!arr || !arr.length) return false;
      return playClip(pick(arr), opts);
    }

    function normalizeName(name) {
      return String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    }

    function playUpgradeName(name) {
      const keyMap = {
        broski: "broski",
        brosquito: "brosquito",
        bruv: "bruv",
        broasurusrex: "broasurus",
        bratholomew: "bratholomew",
        bradialect: "bra",
        brotherdialect: "brother"
      };

      const normalized = normalizeName(name);
      const mapped = keyMap[normalized] || "bro";
      return playVoice(mapped, { rate: 1.06, volume: 0.95 });
    }

    function playBruther() {
      if (Math.random() < 0.65) {
        return playVoice("hellYeahBrother", { rate: 0.97, volume: 1, jitter: 0.02 });
      }
      return playVoice("brother", { rate: 0.92, volume: 1, jitter: 0.02 });
    }

    function playSurfer() {
      return playVoice("surfer", { rate: 1.02, volume: 0.9, jitter: 0.03 });
    }

    return { playVoice, playUpgradeName, playBruther, playSurfer };
  }
  const soundboard = createSoundboard();

  function randomFloat(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getAuraMultiplier() {
    return 1;
  }



  function updateDevModeVisuals() {
    if (!elements.devToggle) return;
    elements.devToggle.classList.toggle("active", state.devMode);
    elements.devToggle.textContent = state.devMode ? "DEV MODE: ON" : "DEV MODE: OFF";
    elements.devToggle.setAttribute("aria-pressed", state.devMode ? "true" : "false");
    elements.auraDisplay.disabled = !(state.devMode || state.aura >= UPGRADE_UNLOCK_AURA);
  }
  function chooseVocabEntry() {
    const vocab = state.effects.vocab;
    const total = vocab.reduce((sum, item) => sum + item.weight, 0);
    let r = Math.random() * total;
    for (const entry of vocab) {
      r -= entry.weight;
      if (r <= 0) return entry;
    }
    return vocab[0];
  }

  function computeEffects() {
    const fx = {
      cursorEnabled: false,
      cursorSize: "32px",
      cursorGlyph: "\u{1F4AA}",
      hitRadius: 0,
      auraPerHit: 1,
      splitCount: 4,
      chainChance: 0,
      chainExtraSplit: 0,
      launcherEnabled: false,
      launcherLifetimeMs: 8000,
      launcherMax: 0,
      launcherChainBoost: 0,
      autoLauncherMs: Number.POSITIVE_INFINITY,
      passiveAuraPerSecond: 0,
      brutherEnabled: false,
      vocab: [{ text: "bro", weight: 1, voice: "bro" }]
    };

    for (const upgrade of UPGRADE_DEFS) {
      if (state.purchased.has(upgrade.id)) {
        upgrade.apply(fx);
      }
    }

    return fx;
  }
  function chainDependencyMet(chain, upgradeId) {
    const idx = chain.indexOf(upgradeId);
    if (idx <= 0) return true;
    return state.purchased.has(chain[idx - 1]);
  }

  function isCurrentTreeStep(chain, upgradeId) {
    const nextId = chain.find((id) => !state.purchased.has(id));
    if (!nextId) return false;
    return nextId === upgradeId;
  }

  function hasUpgradeDependencies(upgrade) {
    for (const dep of upgrade.prerequisites) {
      if (!state.purchased.has(dep)) return false;
    }
    if (!chainDependencyMet(FLEX_CHAIN, upgrade.id)) return false;
    if (!chainDependencyMet(BRO_TYPE_CHAIN, upgrade.id)) return false;
    if (!chainDependencyMet(LAUNCHER_CHAIN, upgrade.id)) return false;
    if (!chainDependencyMet(AUTO_BRUH_CHAIN, upgrade.id)) return false;
    return true;
  }

  function isUpgradeUnlockedForStore(upgrade) {
    if (state.devMode) return true;
    return hasUpgradeDependencies(upgrade);
  }

  function shouldRenderUpgrade(upgrade) {
    if (state.devMode) return true;

    for (const tree of PROGRESSIVE_TREES) {
      if (tree.includes(upgrade.id)) {
        return isCurrentTreeStep(tree, upgrade.id);
      }
    }

    if (state.purchased.has(upgrade.id)) return true;
    return hasUpgradeDependencies(upgrade);
  }

  function canPurchase(upgrade) {
    if (state.purchased.has(upgrade.id)) return false;
    if (!isUpgradeUnlockedForStore(upgrade)) return false;
    if (state.devMode) return true;
    if (state.aura < upgrade.cost) return false;
    return true;
  }

  function bumpAura(amount) {
    state.aura += amount;
    elements.auraCount.textContent = String(state.aura);

    if (amount > 0) {
      state.sessionStats.auraFarmed += amount;
      state.statsDirty = true;
    }

    if (state.devMode || state.aura >= UPGRADE_UNLOCK_AURA) {
      elements.auraDisplay.disabled = false;
    }
  }

  function incrementTotalBros() {
    state.sessionStats.totalBros += 1;
    state.statsDirty = true;
  }

  function incrementSurferBrosCreated() {
    state.sessionStats.surferBrosCreated += 1;
    state.statsDirty = true;
  }

  function incrementBroClicked(type) {
    const key = BRO_CLICK_LABELS[type] ? type : "bro";
    state.sessionStats.brosClicked[key] += 1;
    state.statsDirty = true;
  }

  function renderStatsPanel() {
    if (!state.statsDirty) return;
    if (!elements.statTotalBros || !elements.statBrosClicked) return;

    elements.statTotalBros.textContent = String(state.sessionStats.totalBros);
    elements.statSurferBrosCreated.textContent = String(state.sessionStats.surferBrosCreated);
    elements.statAuraFarmed.textContent = String(state.sessionStats.auraFarmed);

    const frag = document.createDocumentFragment();
    for (const type of BRO_CLICK_TYPES) {
      const row = document.createElement("div");
      row.className = "stats-row";

      const label = document.createElement("span");
      label.textContent = BRO_CLICK_LABELS[type];

      const value = document.createElement("strong");
      value.textContent = String(state.sessionStats.brosClicked[type] || 0);

      row.append(label, value);
      frag.append(row);
    }

    elements.statBrosClicked.replaceChildren(frag);
    state.statsDirty = false;
  }

  function openStats() {
    renderStatsPanel();
    elements.statsMenu.classList.add("open");
    elements.statsMenu.setAttribute("aria-hidden", "false");
  }

  function closeStats() {
    elements.statsMenu.classList.remove("open");
    elements.statsMenu.setAttribute("aria-hidden", "true");
  }

  function isOverlayOpen() {
    return elements.upgradeMenu.classList.contains("open") || elements.statsMenu.classList.contains("open");
  }

  function showFlavor(text) {
    elements.subtitle.textContent = text;
  }

  function pulseScreen() {
    elements.appRoot.classList.remove("shake");
    void elements.appRoot.offsetWidth;
    elements.appRoot.classList.add("shake");
  }

  function syncCursorVisuals() {
    const fx = state.effects;
    if (fx.cursorEnabled) {
      document.body.classList.add("flex-cursor");
      elements.customCursor.hidden = false;
      elements.customCursor.textContent = fx.cursorGlyph;
      elements.customCursor.style.fontSize = fx.cursorSize;
    } else {
      document.body.classList.remove("flex-cursor");
      elements.customCursor.hidden = true;
      elements.customCursor.textContent = "\u{1F4AA}";
    }

    elements.brutherButton.hidden = !fx.brutherEnabled;
  }

  function purchaseUpgrade(id) {
    const upgrade = UPGRADE_DEFS.find((u) => u.id === id);
    if (!upgrade || !canPurchase(upgrade)) return;

    if (!state.devMode) {
      state.aura -= upgrade.cost;
    }
    state.purchased.add(upgrade.id);
    elements.auraCount.textContent = String(state.aura);

    state.effects = computeEffects();
    syncCursorVisuals();
    ensurePillCanvas();
    renderUpgrades();

    showFlavor(`Upgrade purchased: ${upgrade.name}.`);
    soundboard.playUpgradeName(upgrade.name);
  }

  function renderUpgrades() {
    const frag = document.createDocumentFragment();

    for (const upgrade of UPGRADE_DEFS) {
      if (!shouldRenderUpgrade(upgrade)) continue;

      const purchased = state.purchased.has(upgrade.id);
      const available = canPurchase(upgrade);
      const prereqMissing = !isUpgradeUnlockedForStore(upgrade);

      const node = document.createElement("div");
      node.className = "upgrade-node";
      if (purchased) node.classList.add("purchased");
      else if (available) node.classList.add("available");
      else if (prereqMissing) node.classList.add("locked");

      const head = document.createElement("div");
      head.className = "upgrade-node-header";

      const name = document.createElement("span");
      name.className = "upgrade-node-name";
      name.textContent = upgrade.name;

      const cost = document.createElement("span");
      cost.className = "upgrade-node-cost";
      cost.textContent = purchased ? "Owned" : state.devMode ? "DEV: Free" : `${upgrade.cost} Aura`;

      head.append(name, cost);

      const desc = document.createElement("div");
      desc.className = "upgrade-node-desc";
      desc.textContent = upgrade.description;

      node.append(head, desc);

      if (!purchased) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "upgrade-node-btn";
        btn.textContent = "Purchase";
        btn.disabled = !available;
        btn.addEventListener("click", () => purchaseUpgrade(upgrade.id));
        node.append(btn);
      }

      frag.append(node);
    }

    elements.upgradeTree.replaceChildren(frag);
  }

  function pillVisualSize(text) {
    const normalizedLength = String(text || "").replace(/\s+/g, "").length;
    const width = Math.max(64, Math.min(180, 26 + normalizedLength * 10));
    const height = 32;
    return { w: width, h: height, r: Math.max(26, Math.floor(width * 0.5)) };
  }

  function getPillStyleKey(pill) {
    return pill.voice || "bro";
  }

  function getPillStyle(styleKey) {
    const byVoice = {
      bro: { fg: "#061018", bgA: "#28f1cd", bgB: "#3fa4ff" },
      bra: { fg: "#1f0d24", bgA: "#ff7dbd", bgB: "#ffe176" },
      brother: { fg: "#1a1100", bgA: "#ffe176", bgB: "#ffb85a" },
      broski: { fg: "#061018", bgA: "#85f7ff", bgB: "#00d4ff" },
      brosquito: { fg: "#06201a", bgA: "#9be15d", bgB: "#00e3ae" },
      bruv: { fg: "#14081c", bgA: "#cda0ff", bgB: "#ff9fd0" },
      broasurus: { fg: "#13230a", bgA: "#b4ff6a", bgB: "#39d98a" },
      bratholomew: { fg: "#210f00", bgA: "#ffd37a", bgB: "#ff8f5c" }
    };
    return byVoice[styleKey] || byVoice.bro;
  }

  function ensurePillCanvas() {
    if (state.pillCanvas) return;
    const canvas = document.createElement("canvas");
    canvas.className = "pill-canvas";
    elements.pillContainer.prepend(canvas);
    state.pillCanvas = canvas;
    state.pillCtx = canvas.getContext("2d", { alpha: true });
    resizePillCanvas();
  }

  function resizePillCanvas() {
    if (!state.pillCanvas || !state.pillCtx) return;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const width = Math.max(1, Math.floor(window.innerWidth));
    const height = Math.max(1, Math.floor(window.innerHeight));
    state.pillCanvas.width = Math.floor(width * dpr);
    state.pillCanvas.height = Math.floor(height * dpr);
    state.pillCanvas.style.width = `${width}px`;
    state.pillCanvas.style.height = `${height}px`;
    state.pillCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    state.canvasDirty = true;
  }

  function getOrCreatePillSprite(styleKey, text, w, h) {
    const spriteKey = `${styleKey}:${text}:${w}:${h}`;
    const existing = state.pillSprites.get(spriteKey);
    if (existing) return existing;

    const sw = Math.ceil(w * PILL_SPRITE_SCALE);
    const sh = Math.ceil(h * PILL_SPRITE_SCALE);
    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    const style = getPillStyle(styleKey);

    const grad = ctx.createLinearGradient(0, 0, sw, sh);
    grad.addColorStop(0, style.bgA);
    grad.addColorStop(1, style.bgB);

    const radius = Math.floor(sh * 0.5);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(sw - radius, 0);
    ctx.quadraticCurveTo(sw, 0, sw, radius);
    ctx.lineTo(sw, sh - radius);
    ctx.quadraticCurveTo(sw, sh, sw - radius, sh);
    ctx.lineTo(radius, sh);
    ctx.quadraticCurveTo(0, sh, 0, sh - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = style.fg;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let fontSize = Math.max(13, Math.floor(sh * 0.44));
    while (fontSize > 12) {
      ctx.font = `700 ${fontSize}px Space Grotesk`;
      if (ctx.measureText(text).width <= sw - 18) break;
      fontSize -= 1;
    }
    ctx.font = `700 ${fontSize}px Space Grotesk`;
    ctx.fillText(text, sw / 2, sh / 2 + 1);

    const sprite = { canvas, w, h };
    state.pillSprites.set(spriteKey, sprite);
    return sprite;
  }

  function renderPillsCanvas() {
    if (!state.pillCtx || !state.pillCanvas) return;
    if (!state.canvasDirty) return;

    const ctx = state.pillCtx;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const pill of state.pills) {
      if (!pill.alive) continue;
      const sprite = getOrCreatePillSprite(getPillStyleKey(pill), pill.text, pill.w, pill.h);
      ctx.drawImage(sprite.canvas, pill.x, pill.y, pill.w, pill.h);
    }

    state.canvasDirty = false;
  }

  function findPillAtPoint(clientX, clientY) {
    let best = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (const pill of state.pills) {
      if (!pill.alive) continue;
      const cx = pill.x + pill.w * 0.5;
      const cy = pill.y + pill.h * 0.5;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const distSq = dx * dx + dy * dy;
      if (distSq <= pill.r * pill.r && distSq < bestScore) {
        best = pill;
        bestScore = distSq;
      }
    }

    return best;
  }

  function createPill(x, y, speedMultiplier = 1) {
    if (state.pills.length >= MAX_PILLS) return null;

    const vocab = chooseVocabEntry();
    const size = pillVisualSize(vocab.text);
    const angle = randomFloat(0, Math.PI * 2);
    const speed = randomFloat(55, 120) * speedMultiplier;
    const style = getPillStyle(vocab.voice);

    const pill = {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      w: size.w,
      h: size.h,
      r: size.r,
      text: vocab.text,
      voice: vocab.voice,
      auraBonus: vocab.auraBonus || 0,
      bg: `linear-gradient(135deg, ${style.bgA}, ${style.bgB})`,
      alive: true
    };

    state.pills.push(pill);
    state.canvasDirty = true;
    incrementTotalBros();
    return pill;
  }

  function renderPill(pill) {
    state.canvasDirty = true;
  }

  function removePill(pill) {
    if (!pill.alive) return;
    pill.alive = false;
    state.dirtyPills = true;
    state.canvasDirty = true;
  }

  function cleanPillsIfNeeded() {
    if (!state.dirtyPills) return;
    state.pills = state.pills.filter((p) => p.alive);
    state.dirtyPills = false;
  }

  function pillGridKey(cellX, cellY) {
    return `${cellX}|${cellY}`;
  }

  function rebuildPillSpatialIndex() {
    const grid = state.pillGrid;
    grid.clear();

    for (const pill of state.pills) {
      if (!pill.alive) continue;
      const centerX = pill.x + pill.w * 0.5;
      const centerY = pill.y + pill.h * 0.5;
      const cellX = Math.floor(centerX / PILL_GRID_CELL_SIZE);
      const cellY = Math.floor(centerY / PILL_GRID_CELL_SIZE);
      const key = pillGridKey(cellX, cellY);
      let bucket = grid.get(key);
      if (!bucket) {
        bucket = [];
        grid.set(key, bucket);
      }
      bucket.push(pill);
    }
  }

  function forEachNearbyPill(x, y, radius, visitor) {
    const minCellX = Math.floor((x - radius) / PILL_GRID_CELL_SIZE);
    const maxCellX = Math.floor((x + radius) / PILL_GRID_CELL_SIZE);
    const minCellY = Math.floor((y - radius) / PILL_GRID_CELL_SIZE);
    const maxCellY = Math.floor((y + radius) / PILL_GRID_CELL_SIZE);

    for (let cellY = minCellY; cellY <= maxCellY; cellY += 1) {
      for (let cellX = minCellX; cellX <= maxCellX; cellX += 1) {
        const bucket = state.pillGrid.get(pillGridKey(cellX, cellY));
        if (!bucket) continue;
        for (const pill of bucket) {
          visitor(pill);
        }
      }
    }
  }

  function spawnPillBreakBurst(pill) {
    const now = performance.now();
    if (now - state.burstWindowStartAt >= 1000) {
      state.burstWindowStartAt = now;
      state.burstCountInWindow = 0;
    }
    if (state.burstCountInWindow >= MAX_PILL_BURSTS_PER_SECOND) return;
    state.burstCountInWindow += 1;
    const burst = document.createElement("div");
    burst.className = "pill-burst";
    burst.style.transform = `translate3d(${pill.x + pill.w * 0.5}px, ${pill.y + pill.h * 0.5}px, 0)`;

    const shardCount = 12;
    for (let i = 0; i < shardCount; i += 1) {
      const shard = document.createElement("span");
      shard.className = "pill-shard";
      shard.style.background = pill.bg || randomItem(COLORS);
      shard.style.setProperty("--dx", `${randomFloat(-64, 64)}px`);
      shard.style.setProperty("--dy", `${randomFloat(-58, 54)}px`);
      shard.style.setProperty("--rot", `${randomFloat(-150, 150)}deg`);
      burst.append(shard);
    }

    const sparkleCount = 16;
    for (let i = 0; i < sparkleCount; i += 1) {
      const sparkle = document.createElement("span");
      sparkle.className = "pill-spark";
      sparkle.style.background = "rgba(255, 255, 255, 0.95)";
      sparkle.style.setProperty("--dx", `${randomFloat(-92, 92)}px`);
      sparkle.style.setProperty("--dy", `${randomFloat(18, 150)}px`);
      burst.append(sparkle);
    }

    elements.pillContainer.append(burst);
    setTimeout(() => burst.remove(), 700);
  }

  function hitPill(pill, cause, options = {}) {
    const { spawnSplit = true } = options;
    if (!pill || !pill.alive) return;

    spawnPillBreakBurst(pill);
    removePill(pill);

    const gainBase = state.effects.auraPerHit + pill.auraBonus;
    const gain = Math.max(1, Math.round(gainBase * getAuraMultiplier()));
    bumpAura(gain);

    if (spawnSplit) {
      let splitCount = state.effects.splitCount;
      if (cause === "bruh") {
        splitCount = Math.min(splitCount, SURFER_HIT_SPLIT_CAP);
      }
      if (cause !== "bruh" && state.effects.chainChance > 0 && Math.random() < state.effects.chainChance) {
        splitCount += state.effects.chainExtraSplit;
        pulseScreen();
      }

      for (let i = 0; i < splitCount; i += 1) {
        if (state.pills.length >= MAX_PILLS) break;
        createPill(pill.x + randomFloat(-14, 14), pill.y + randomFloat(-14, 14), 1.15);
      }
    }

    if (cause === "click") {
      incrementBroClicked(pill.voice);
      soundboard.playVoice(pill.voice, { volume: 0.9 });
    } else if (cause === "bruh") {
      const now = performance.now();
      if (!isOverlayOpen() && now - state.lastBruhVoiceAt > 180) {
        state.lastBruhVoiceAt = now;
        soundboard.playVoice("bro", { volume: 0.82, jitter: 0.03 });
      }
    }
  }

  function createLauncher(x, y, options = {}) {
    const fx = state.effects;
    if (!fx.launcherEnabled) return;

    const {
      ignoreUpgradeCap = false,
      speedScale = 1,
      fromSplit = false,
      splitDepth = 0
    } = options;
    if (!ignoreUpgradeCap && state.launchers.length >= fx.launcherMax) return;
    if (state.launchers.length >= MAX_SURFERS) return;
    if (fromSplit) {
      if (state.surferSplitBudget < 1) return;
      state.surferSplitBudget -= 1;
    }

    const angle = randomFloat(0, Math.PI * 2);
    const speed = randomFloat(180, 235) * speedScale;

    const el = document.createElement("span");
    el.className = "bruh-launcher";
    el.setAttribute("aria-label", "bruh launcher");
    el.innerHTML = "<span class=\"bruh-face\" aria-hidden=\"true\">\u{1F3C4}</span>";

    const launcher = {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      baseSpeed: speed,
      r: LAUNCHER_RADIUS,
      expiresAt: performance.now() + fx.launcherLifetimeMs,
      splitCooldownUntil: 0,
      splitDepth,
      alive: true,
      el
    };

    state.launchers.push(launcher);
    elements.pillContainer.append(el);
    renderLauncher(launcher);
    incrementSurferBrosCreated();
    const now = performance.now();
    if (!isOverlayOpen() && now - state.lastSurferVoiceAt > 320) {
      state.lastSurferVoiceAt = now;
      soundboard.playSurfer();
    }
  }

  function renderLauncher(launcher) {
    launcher.el.style.transform = `translate3d(${launcher.x}px, ${launcher.y}px, 0)`;
  }

  function removeLauncher(launcher) {
    launcher.alive = false;
    launcher.el.remove();
  }

  function splitSurferAtCorner(launcher, now) {
    if (state.launchers.length >= MAX_SURFERS) return;
    if (launcher.splitDepth >= SURFER_MAX_SPLIT_DEPTH) return;
    if (now < launcher.splitCooldownUntil) return;

    launcher.splitCooldownUntil = now + SURFER_SPLIT_COOLDOWN_MS;
    for (let i = 0; i < 3; i += 1) {
      if (state.launchers.length >= MAX_SURFERS) break;
      createLauncher(launcher.x + randomFloat(-10, 10), launcher.y + randomFloat(-10, 10), {
        ignoreUpgradeCap: true,
        speedScale: randomFloat(0.9, 1.2),
        fromSplit: true,
        splitDepth: launcher.splitDepth + 1
      });
    }
  }

  function openUpgrades() {
    if (!state.devMode && state.aura < UPGRADE_UNLOCK_AURA) return;
    renderUpgrades();
    elements.upgradeMenu.classList.add("open");
    elements.upgradeMenu.setAttribute("aria-hidden", "false");
  }

  function closeUpgrades() {
    elements.upgradeMenu.classList.remove("open");
    elements.upgradeMenu.setAttribute("aria-hidden", "true");
  }

  function spawnInitialPills() {
    const rect = elements.broButton.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 64;

    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2;
      const dist = randomFloat(60, 240);
      createPill(cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist);
    }
  }

  function smashNearPointer(clientX, clientY) {
    if (state.effects.hitRadius <= 0) return false;
    if (!state.pills.length) return false;

    const rangeSq = state.effects.hitRadius * state.effects.hitRadius;
    let closest = null;
    let closestSq = rangeSq;

    for (const pill of state.pills) {
      const cx = pill.x + pill.w / 2;
      const cy = pill.y + pill.h / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const distSq = dx * dx + dy * dy;
      if (distSq < closestSq) {
        closest = pill;
        closestSq = distSq;
      }
    }

    if (!closest) return false;
    hitPill(closest, "click");
    return true;
  }

  function handleBruther() {
    if (!state.effects.brutherEnabled) return;
    if (!state.pills.length) return;

    const pillsNow = state.pills.filter((pill) => pill.alive);
    const survivors = Math.min(5, pillsNow.length);
    const keep = new Set();
    while (keep.size < survivors) {
      keep.add(Math.floor(Math.random() * pillsNow.length));
    }

    for (let i = 0; i < pillsNow.length; i += 1) {
      if (!keep.has(i)) {
        hitPill(pillsNow[i], "bruther", { spawnSplit: false });
      }
    }

    showFlavor("BRUTHER activated. Remaining survivors are traumatized.");
    pulseScreen();
    soundboard.playBruther();
  }

  function updatePills(dt, width, height) {
    for (const pill of state.pills) {
      if (!pill.alive) continue;
      pill.x += pill.vx * dt;
      pill.y += pill.vy * dt;

      const maxX = width - pill.w;
      const maxY = height - pill.h;

      if (pill.x <= 0) {
        pill.x = 0;
        pill.vx *= -1;
      } else if (pill.x >= maxX) {
        pill.x = maxX;
        pill.vx *= -1;
      }

      if (pill.y <= 0) {
        pill.y = 0;
        pill.vy *= -1;
      } else if (pill.y >= maxY) {
        pill.y = maxY;
        pill.vy *= -1;
      }

      renderPill(pill);
    }
  }

  function updateLaunchers(dt, now, width, height, runCollisionChecks) {
    for (const launcher of state.launchers) {
      if (!launcher.alive) continue;

      const speedNow = Math.hypot(launcher.vx, launcher.vy);
      if (speedNow > launcher.baseSpeed) {
        const target = Math.max(launcher.baseSpeed, speedNow - 120 * dt);
        const scale = target / speedNow;
        launcher.vx *= scale;
        launcher.vy *= scale;
      }

      launcher.x += launcher.vx * dt;
      launcher.y += launcher.vy * dt;

      const maxX = width - LAUNCHER_SIZE;
      const maxY = height - LAUNCHER_SIZE;

      let hitX = false;
      let hitY = false;

      if (launcher.x <= 0) {
        launcher.x = 0;
        launcher.vx *= -1;
        hitX = true;
      } else if (launcher.x >= maxX) {
        launcher.x = maxX;
        launcher.vx *= -1;
        hitX = true;
      }

      if (launcher.y <= 0) {
        launcher.y = 0;
        launcher.vy *= -1;
        hitY = true;
      } else if (launcher.y >= maxY) {
        launcher.y = maxY;
        launcher.vy *= -1;
        hitY = true;
      }

      if (hitX && hitY) {
        splitSurferAtCorner(launcher, now);
      }

      if (runCollisionChecks) {
        const launcherCenterX = launcher.x + LAUNCHER_SIZE * 0.5;
        const launcherCenterY = launcher.y + LAUNCHER_SIZE * 0.5;
        const searchRadius = launcher.r + MAX_PILL_COLLISION_RADIUS;

        forEachNearbyPill(launcherCenterX, launcherCenterY, searchRadius, (pill) => {
          if (!pill.alive) return;

          const dx = (pill.x + pill.w * 0.5) - launcherCenterX;
          const dy = (pill.y + pill.h * 0.5) - launcherCenterY;
          const hitDistance = pill.r + launcher.r;
          if (dx * dx + dy * dy <= hitDistance * hitDistance) {
            hitPill(pill, "bruh");

            if (state.effects.launcherChainBoost > 0) {
              const boost = 1 + state.effects.launcherChainBoost;
              launcher.vx *= boost;
              launcher.vy *= boost;
              const boostedMag = Math.hypot(launcher.vx, launcher.vy);
              if (boostedMag > 460) {
                const s = 460 / boostedMag;
                launcher.vx *= s;
                launcher.vy *= s;
              }
            }
          }
        });
      }

      if (now >= launcher.expiresAt) {
        removeLauncher(launcher);
      } else {
        renderLauncher(launcher);
      }
    }

    state.launchers = state.launchers.filter((l) => l.alive);
  }

  function maybeAutoLauncher(now, width, height) {
    if (!Number.isFinite(state.effects.autoLauncherMs)) return;
    if (now - state.lastAutoLauncherAt < state.effects.autoLauncherMs) return;

    state.lastAutoLauncherAt = now;
    createLauncher(randomFloat(20, width - 80), randomFloat(20, height - 80));
  }

  function maybePassiveAura(now) {
    if (state.effects.passiveAuraPerSecond <= 0) return;

    if (state.nextPassiveTickAt === 0) {
      state.nextPassiveTickAt = now + 1000;
      return;
    }

    if (now >= state.nextPassiveTickAt) {
      const gain = Math.max(1, Math.round(state.effects.passiveAuraPerSecond * getAuraMultiplier(now)));
      bumpAura(gain);
      state.nextPassiveTickAt = now + 1000;
    }
  }

  function maybeFlavorLine(now) {
    if (now - state.lastFlavorAt < 2800) return;
    if (Math.random() > 0.06) return;
    state.lastFlavorAt = now;
    showFlavor(randomItem(FLAVOR_LINES));
  }

  function tick(now) {
    const dt = Math.min(0.05, (now - state.lastFrameTs) / 1000);
    state.lastFrameTs = now;

    const width = window.innerWidth;
    const height = window.innerHeight;

    state.surferSplitBudget = Math.min(
      SURFER_SPLIT_BUDGET_PER_SECOND,
      state.surferSplitBudget + dt * SURFER_SPLIT_BUDGET_PER_SECOND
    );
    state.launcherCollisionAccumulator += dt;
    const runLauncherCollisionChecks = state.launcherCollisionAccumulator >= (1 / SURFER_COLLISION_HZ);
    if (runLauncherCollisionChecks) {
      state.launcherCollisionAccumulator = 0;
    }

    updatePills(dt, width, height);
    rebuildPillSpatialIndex();
    updateLaunchers(dt, now, width, height, runLauncherCollisionChecks);
    cleanPillsIfNeeded();
    renderPillsCanvas();

    maybeAutoLauncher(now, width, height);
    maybePassiveAura(now);
    maybeFlavorLine(now);
    renderStatsPanel();

    requestAnimationFrame(tick);
  }

  function bindEvents() {
    elements.broButton.addEventListener("click", () => {
      if (state.started) return;
      state.started = true;

      elements.broButton.classList.add("animate-out");
      setTimeout(() => {
        elements.broButton.hidden = true;
      }, 600);

      spawnInitialPills();
      bumpAura(1);
      showFlavor("The bro economy is open for business.");
      soundboard.playVoice("bro", { volume: 0.95 });
    });

    elements.pillContainer.addEventListener("click", (event) => {
      const pill = findPillAtPoint(event.clientX, event.clientY);
      if (!pill) return;
      event.stopPropagation();
      hitPill(pill, "click");
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (
        target.closest("#upgradeMenu") ||
        target.closest("#statsMenu") ||
        target.closest("#auraDisplay") ||
        target.closest("#statsToggle") ||
        target.closest("#broButton") ||
        target.closest("#brutherButton")
      ) {
        return;
      }

      if (smashNearPointer(event.clientX, event.clientY)) {
        event.preventDefault();
      }

      createLauncher(event.clientX, event.clientY);
    }, true);

    window.addEventListener("resize", resizePillCanvas);

    document.addEventListener("mousemove", (event) => {
      state.cursorX = event.clientX;
      state.cursorY = event.clientY;
      elements.customCursor.style.left = `${state.cursorX}px`;
      elements.customCursor.style.top = `${state.cursorY}px`;
    });

    elements.auraDisplay.addEventListener("click", openUpgrades);
    elements.menuClose.addEventListener("click", closeUpgrades);
    elements.upgradeMenu.addEventListener("click", (event) => {
      if (event.target === elements.upgradeMenu) closeUpgrades();
    });

    if (elements.statsToggle) {
      elements.statsToggle.addEventListener("click", openStats);
    }
    if (elements.statsClose) {
      elements.statsClose.addEventListener("click", closeStats);
    }
    if (elements.statsMenu) {
      elements.statsMenu.addEventListener("click", (event) => {
        if (event.target === elements.statsMenu) closeStats();
      });
    }

    elements.brutherButton.addEventListener("click", handleBruther);

    if (elements.devToggle) {
      elements.devToggle.addEventListener("click", () => {
        state.devMode = !state.devMode;
        updateDevModeVisuals();
        renderUpgrades();
      });
    }

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeUpgrades();
        closeStats();
      }
    });
  }

  function init() {
    state.effects = computeEffects();
    syncCursorVisuals();
    ensurePillCanvas();
    renderUpgrades();
    renderStatsPanel();
    bindEvents();
    requestAnimationFrame(tick);
  }

  init();
})();





















































































