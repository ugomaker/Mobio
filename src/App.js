import React, { useState, useEffect, useRef } from "react";

// ── Thèmes ─────────────────────────────────────────────────────────────────
const LIGHT = {
  bg: "#fafafa", card: "#ffffff", input: "#f5f5f5",
  border: "#e8e8e8", bsub: "#f0f0f0",
  text: "#1a1a2e", sub: "#888", muted: "#bbb",
  nav: "#ffffff", nborder: "#e5e5e5", accent: "#1a1a2e",
};
const DARK = {
  bg: "#0f0f14", card: "#1c1c27", input: "#252535",
  border: "#2e2e42", bsub: "#252535",
  text: "#f0f0f5", sub: "#8888aa", muted: "#55556a",
  nav: "#1c1c27", nborder: "#2e2e42", accent: "#6366f1",
};

// ── Données ────────────────────────────────────────────────────────────────
const PLATFORMS = {
  uber:   { name: "Uber",   short: "Ub", color: "#000",    tc: "#fff", base: 1.5, pKm: 1.20, pMin: 0.22, stars: 4.6, appUrl: "https://apps.apple.com/fr/app/uber-demandez-une-course/id368677368", categories: [{label:"UberX", seats:4},{label:"Uber Comfort", seats:4},{label:"Uber XL", seats:6},{label:"Uber Van", seats:7}] },
  bolt:   { name: "Bolt",   short: "Bt", color: "#34d186", tc: "#fff", base: 1.1, pKm: 0.95, pMin: 0.18, stars: 4.8, appUrl: "https://apps.apple.com/fr/app/bolt-commandez-une-course/id675033630", categories: [{label:"Bolt Standard", seats:4},{label:"Bolt XL", seats:6}] },
  heetch: { name: "Heetch", short: "He", color: "#ff1c5b", tc: "#fff", base: 1.3, pKm: 1.05, pMin: 0.20, stars: 4.7, appUrl: "https://apps.apple.com/fr/app/heetch-vtc/id899361275", categories: [{label:"Heetch", seats:4},{label:"Heetch XL", seats:6}] },
  marcel: { name: "Marcel", short: "Ma", color: "#1a1a2e", tc: "#fff", base: 2.0, pKm: 1.45, pMin: 0.28, stars: 4.9, appUrl: "https://apps.apple.com/fr/app/marcel-vtc/id1043720189", categories: [{label:"Marcel Berline", seats:4},{label:"Marcel Van", seats:7}] },
};
// Scooters partagés (permis requis, à deux places, ~50cm3 électrique)
const MOPEDS = {
  yego:      { name: "Yego",      short: "Yg", color: "#FF6B00", tc: "#fff", base: 0, pKm: 0, pMin: 0.39, stars: 4.3,
    cities: ["paris", "bordeaux", "toulouse", "nice"],
    label: "Scooter électrique", seats: 2, speed: 50,
    info: "2 casques inclus · Permis AM/B requis",
    appUrl: "https://apps.apple.com/fr/app/yego-mobility/id1181020675" },
  cityscoot: { name: "Cityscoot", short: "Cs", color: "#00C4B4", tc: "#fff", base: 0, pKm: 0, pMin: 0.35, stars: 4.5,
    cities: ["paris", "nice"],
    label: "Scooter électrique", seats: 1, speed: 45,
    info: "1 casque inclus · Assurance incluse · Permis AM/B requis",
    appUrl: "https://apps.apple.com/fr/app/cityscoot/id1010654011" },
};

const SCOOTERS = {
  lime_sc:  { name: "Lime",   short: "Lm", color: "#00c853", tc: "#fff", unlock: 1.0, pMin: 0.25, type: "scooter", label: "Trottinette",  bat: 78,  appUrl: "https://apps.apple.com/fr/app/lime/id1199780189" },
  lime_bk:  { name: "Lime",   short: "Lm", color: "#00c853", tc: "#fff", unlock: 1.0, pMin: 0.20, type: "bike",    label: "Vélo libre",   bat: 65,  appUrl: "https://apps.apple.com/fr/app/lime/id1199780189" },
  dott:     { name: "Dott",   short: "Dt", color: "#ff4a17", tc: "#fff", unlock: 1.0, pMin: 0.20, type: "scooter", label: "Trottinette",  bat: 91,  appUrl: "https://apps.apple.com/fr/app/dott/id1434242987" },
  bird:     { name: "Bird",   short: "Bd", color: "#111111", tc: "#fff", unlock: 1.0, pMin: 0.26, type: "scooter", label: "Trottinette",  bat: 60,  appUrl: "https://apps.apple.com/fr/app/bird/id1260842311" },
  voi:      { name: "Voi",    short: "Vo", color: "#ff3366", tc: "#fff", unlock: 1.0, pMin: 0.23, type: "scooter", label: "Trottinette",  bat: 72,  appUrl: "https://apps.apple.com/fr/app/voi-scooters/id1445268803" },
  velib:    { name: "Vélib'", short: "Vb", color: "#0072b9", tc: "#fff", unlock: 0,   pMin: 0.17, type: "station", label: "Vélo en station", bat: null },
};
const HISTORY_DATA = [
  { id: 1, plId: "bolt",   from: "Gare du Nord", to: "Tour Eiffel",  price: 8.20,  dur: 14, date: "Aujourd'hui", saved: 3.20, eco: true  },
  { id: 2, plId: "lime_sc",   from: "République",   to: "Bastille",     price: 5.40,  dur: 18, date: "Hier",        saved: null, eco: true, sc: true },
  { id: 3, plId: "heetch", from: "Châtelet",     to: "Montmartre",   price: 12.80, dur: 22, date: "Hier",        saved: null, eco: false },
  { id: 4, plId: "uber",   from: "Opéra",        to: "Saint-Lazare", price: 7.60,  dur: 9,  date: "Lundi",       saved: null, eco: false },
];
const MONTHLY = [
  { mo: "Jan", val: 62 }, { mo: "Fév", val: 88 }, { mo: "Mar", val: 74 },
  { mo: "Avr", val: 105 }, { mo: "Mai", val: 83 },
];
const PLACES = [
  { label: "Gare du Nord, Paris", lat: 48.8809, lng: 2.3553 },
  { label: "Gare de Lyon, Paris", lat: 48.8448, lng: 2.3735 },
  { label: "Gare Montparnasse, Paris", lat: 48.8410, lng: 2.3210 },
  { label: "Gare Saint-Lazare, Paris", lat: 48.8759, lng: 2.3247 },
  { label: "Gare de l'Est, Paris", lat: 48.8767, lng: 2.3590 },
  { label: "Tour Eiffel, Paris", lat: 48.8584, lng: 2.2945 },
  { label: "Musée du Louvre, Paris", lat: 48.8606, lng: 2.3376 },
  { label: "Notre-Dame de Paris", lat: 48.8530, lng: 2.3499 },
  { label: "Arc de Triomphe, Paris", lat: 48.8738, lng: 2.2950 },
  { label: "Sacré-Cœur, Montmartre", lat: 48.8867, lng: 2.3431 },
  { label: "Musée d'Orsay, Paris", lat: 48.8600, lng: 2.3266 },
  { label: "Centre Pompidou, Paris", lat: 48.8606, lng: 2.3522 },
  { label: "Opéra Garnier, Paris", lat: 48.8719, lng: 2.3316 },
  { label: "Invalides, Paris", lat: 48.8566, lng: 2.3122 },
  { label: "Bastille, Paris", lat: 48.8533, lng: 2.3692 },
  { label: "République, Paris", lat: 48.8675, lng: 2.3636 },
  { label: "Châtelet, Paris", lat: 48.8585, lng: 2.3469 },
  { label: "Nation, Paris", lat: 48.8483, lng: 2.3954 },
  { label: "Champs-Élysées, Paris", lat: 48.8698, lng: 2.3078 },
  { label: "Jardin du Luxembourg", lat: 48.8462, lng: 2.3372 },
  { label: "Le Marais, Paris 4e", lat: 48.8566, lng: 2.3578 },
  { label: "Montmartre, Paris 18e", lat: 48.8867, lng: 2.3431 },
  { label: "Saint-Germain-des-Prés", lat: 48.8540, lng: 2.3337 },
  { label: "Canal Saint-Martin", lat: 48.8710, lng: 2.3622 },
  { label: "Pigalle, Paris 9e", lat: 48.8826, lng: 2.3347 },
  { label: "La Défense", lat: 48.8924, lng: 2.2380 },
  { label: "Neuilly-sur-Seine", lat: 48.8847, lng: 2.2683 },
  { label: "Boulogne-Billancourt", lat: 48.8355, lng: 2.2408 },
  { label: "Saint-Denis", lat: 48.9362, lng: 2.3574 },
  { label: "Vincennes", lat: 48.8476, lng: 2.4390 },
  { label: "Versailles", lat: 48.8014, lng: 2.1301 },
  { label: "Aéroport CDG Terminal 1", lat: 49.0097, lng: 2.5479 },
  { label: "Aéroport CDG Terminal 2", lat: 49.0079, lng: 2.5693 },
  { label: "Aéroport d'Orly", lat: 48.7233, lng: 2.3794 },
  { label: "Stade de France, Saint-Denis", lat: 48.9244, lng: 2.3601 },
  { label: "Parc des Princes, Paris", lat: 48.8414, lng: 2.2530 },
  { label: "Accor Arena Bercy, Paris", lat: 48.8383, lng: 2.3790 },
  { label: "Disneyland Paris", lat: 48.8722, lng: 2.7759 },
  { label: "Galeries Lafayette, Paris", lat: 48.8739, lng: 2.3320 },
  { label: "Sorbonne, Paris 5e", lat: 48.8485, lng: 2.3431 },
  { label: "Sciences Po, Paris", lat: 48.8541, lng: 2.3281 },
  { label: "Levallois-Perret", lat: 48.8953, lng: 2.2874 },
  { label: "Issy-les-Moulineaux", lat: 48.8237, lng: 2.2723 },
];


// ── Logo Enhax (base64) ───────────────────────────────────────────────────────
var ENHAX_LOGO = "data:image/png;base64,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";

// ── JCDecaux API Key ──────────────────────────────────────────────────────────
// 👉 Clé gratuite sur developer.jcdecaux.com
var JCDECAUX_KEY = "eda50bf626d4fb2030eef046f308a30c0ce0fe8c";

// ── Mapbox Token (module level) ───────────────────────────────────────────
// 👉 Remplace par ton token sur https://mapbox.com
var MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || "";

// ── Notifications ──────────────────────────────────────────────────────────
var NOTIF_TEMPLATES = [
  { id: 1, type: "prix dynamiques",   icon: "⚡", title: "Prix dynamiques détectés",         body: "Certaines plateformes ont augmenté leurs prix. Comparez avant de partir.",  time: "À l'instant", read: false },
  { id: 2, type: "scooter", icon: "🛴", title: "Lime disponible près de toi", body: "Une trottinette Lime à 85m de ta position. Batterie 78%.",   time: "Il y a 3 min", read: false },
  { id: 3, type: "saving",  icon: "💰", title: "Tu as économisé 3,20 €",      body: "En choisissant Bolt plutôt qu'Uber ce matin.",               time: "Il y a 2h",   read: true  },
  { id: 4, type: "weekly",  icon: "📊", title: "Ton résumé de la semaine",    body: "7 trajets · 34,60 € dépensés · 8,40 € économisés vs Uber.", time: "Hier",        read: true  },
];


// ── Textes légaux ───────────────────────────────────────────────────────────
var CGU_TEXT = [
  { title: "1. Éditeur de l'application", content: "L'application Mobio est éditée par Ugo Azoulay, auto-entrepreneur immatriculé sous le numéro SIRET 91812281300028, domicilié à 207 rue du Rouet, 13008 Marseille, France. Contact : ugo.azoulay@gmail.com" },
  { title: "2. Description du service", content: "Mobio est une application de comparaison de prix permettant aux utilisateurs de comparer en temps réel les tarifs des plateformes de VTC (Uber, Bolt, Heetch, Marcel) et de micro-mobilité (Lime, Tier, Dott, Vélib'). Mobio n'est pas une plateforme de réservation et n'est affiliée à aucune des plateformes comparées." },
  { title: "3. Accès au service", content: "L'accès à Mobio est gratuit. Certaines fonctionnalités avancées nécessitent un abonnement Pro. L'utilisateur doit être âgé d'au moins 18 ans pour utiliser le service. L'éditeur se réserve le droit de suspendre ou modifier le service à tout moment." },
  { title: "4. Responsabilité", content: "Les prix affichés sur Mobio sont des estimations basées sur les grilles tarifaires publiques des plateformes. Mobio ne garantit pas l'exactitude des prix en temps réel, qui peuvent varier selon les conditions de trafic, la demande et les politiques tarifaires des plateformes. L'éditeur ne saurait être tenu responsable des écarts entre les prix affichés et les prix effectivement facturés par les plateformes." },
  { title: "5. Propriété intellectuelle", content: "L'application Mobio, son design, son code source et ses contenus sont la propriété exclusive de l'éditeur. Toute reproduction, modification ou distribution sans autorisation écrite préalable est interdite." },
  { title: "6. Droit applicable", content: "Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents. Tout différend sera soumis à une tentative de médiation préalable." },
  { title: "7. Modification des CGU", content: "L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification significative par notification dans l'application. La date de dernière mise à jour est indiquée en bas de ce document." },
  { title: "Dernière mise à jour", content: "Juin 2026" },
];

var PRIVACY_TEXT = [
  { title: "1. Responsable du traitement", content: "Le responsable du traitement des données est Ugo Azoulay, auto-entrepreneur, domicilié à 207 rue du Rouet, 13008 Marseille, France. Contact DPO : ugo.azoulay@gmail.com" },
  { title: "2. Données collectées", content: "Mobio collecte les données suivantes : données de localisation (avec votre consentement), adresses de départ et d'arrivée saisies, adresses favorites enregistrées, historique des trajets consultés, préférences de l'application. Aucune donnée bancaire n'est collectée directement par Mobio." },
  { title: "3. Finalités du traitement", content: "Vos données sont utilisées pour : fournir le service de comparaison de prix, améliorer les recommandations et l'expérience utilisateur, envoyer des notifications (avec votre consentement), établir des statistiques d'usage anonymisées." },
  { title: "4. Base légale", content: "Le traitement de vos données est fondé sur : votre consentement (localisation, notifications), l'exécution du contrat (fourniture du service), l'intérêt légitime (amélioration du service, sécurité)." },
  { title: "5. Durée de conservation", content: "Vos données sont conservées pendant toute la durée de votre utilisation de l'application. L'historique des trajets est conservé 12 mois. En cas de suppression du compte, vos données sont effacées sous 30 jours." },
  { title: "6. Vos droits (RGPD)", content: "Conformément au RGPD, vous disposez des droits suivants : droit d'accès à vos données, droit de rectification, droit à l'effacement (droit à l'oubli), droit à la portabilité, droit d'opposition au traitement. Pour exercer ces droits, contactez : ugo.azoulay@gmail.com. Vous pouvez également adresser une réclamation à la CNIL (www.cnil.fr)." },
  { title: "7. Partage des données", content: "Mobio ne vend jamais vos données personnelles à des tiers. Vos données peuvent être partagées avec : Mapbox (cartographie, politique de confidentialité sur mapbox.com), les plateformes VTC/mobilité uniquement lors d'un clic de redirection vers leur application." },
  { title: "8. Cookies", content: "Mobio utilise des cookies techniques nécessaires au fonctionnement de l'application et des cookies de mesure d'audience anonymisée. Vous pouvez gérer vos préférences cookies depuis les paramètres de l'application." },
  { title: "Dernière mise à jour", content: "Juin 2026" },
];

// ── Utilitaires ────────────────────────────────────────────────────────────
// Formate une durée en minutes vers "Xh Ymin" si >= 60min
function formatDuration(mins) {
  if (mins < 60) return mins + " min";
  var h = Math.floor(mins / 60);
  var m = mins % 60;
  return m === 0 ? h + "h" : h + "h" + (m < 10 ? "0" : "") + m;
}

function haversine(la1, ln1, la2, ln2) {
  var R = 6371;
  var dLat = (la2 - la1) * Math.PI / 180;
  var dLng = (ln2 - ln1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos(la1 * Math.PI / 180) * Math.cos(la2 * Math.PI / 180)
        * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

function calcVtcPrice(plId, km, mins) {
  var p = PLATFORMS[plId];
  return Math.round((p.base + km * p.pKm + mins * p.pMin) * 100) / 100;
}

function calcMopedPrice(mopedId, km, mins) {
  var m = MOPEDS[mopedId];
  return Math.round(m.pMin * mins * 100) / 100;
}

function calcScPrice(scId, mins) {
  var s = SCOOTERS[scId];
  return Math.round((s.unlock + mins * s.pMin) * 100) / 100;
}

function filterPlaces(query) {
  if (!query || query.length < 1) return [];
  var q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return PLACES.filter(function(p) {
    return p.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(q) >= 0;
  }).slice(0, 6);
}

function getSurge() {
  var now = new Date();
  var h = now.getHours();
  var d = now.getDay();
  var morningRush  = d >= 1 && d <= 5 && h >= 7  && h < 10;
  var eveningRush  = d >= 1 && d <= 5 && h >= 17 && h < 20;
  var weekendNight = (d === 5 || d === 6) && (h >= 23 || h < 3);
  var evening      = h >= 20 && h < 23;

  var reasons = [];
  if (morningRush || eveningRush) reasons.push("Forte demande");
  if (weekendNight) reasons.push("Forte demande nocturne");
  if (evening) reasons.push("Demande élevée");

  var hasSurge = morningRush || eveningRush || weekendNight || evening;

  var multipliers = {
    uber:   morningRush || eveningRush ? 1.8 : weekendNight ? 2.1 : evening ? 1.4 : 1.0,
    bolt:   morningRush || eveningRush ? 1.3 : weekendNight ? 1.5 : evening ? 1.2 : 1.0,
    heetch: morningRush || eveningRush ? 1.5 : weekendNight ? 1.7 : evening ? 1.3 : 1.0,
    marcel: 1.0,
  };

  return { hasSurge: hasSurge, reasons: reasons, multipliers: multipliers };
}

// ── Composants partagés ────────────────────────────────────────────────────
function Logo(props) {
  var sz = props.size || 38;
  return (
    <div style={{
      width: sz, height: sz, borderRadius: sz * 0.26,
      background: props.color, color: props.tc,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: sz * 0.28, fontWeight: 700, flexShrink: 0,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {props.short}
    </div>
  );
}

function Toggle(props) {
  return (
    <div
      onClick={props.toggle}
      style={{
        width: 36, height: 20, borderRadius: 10,
        background: props.on ? "#34d186" : "#ccc",
        position: "relative", cursor: "pointer",
        transition: "background .2s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 2,
        left: props.on ? 18 : 2,
        width: 16, height: 16, borderRadius: "50%",
        background: "#fff", transition: "left .2s",
      }} />
    </div>
  );
}

function BottomNav(props) {
  var T = props.T;
  var tabs = [
    ["compare", "⊞", "Comparer"],
    ["map",     "◎", "Carte"],
    ["history", "↺", "Historique"],
    ["profile", "◉", "Profil"],
  ];
  return (
    <div style={{
      display: "flex", borderTop: "1px solid " + T.nborder,
      background: T.nav, paddingBottom: 16, paddingTop: 10, flexShrink: 0,
    }}>
      {tabs.map(function(t) {
        var id = t[0], ic = t[1], lb = t[2];
        var active = props.tab === id;
        return (
          <button
            key={id}
            onClick={function() { props.setTab(id); }}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3,
              border: "none", background: "none", cursor: "pointer",
              color: active ? T.text : T.muted,
            }}
          >
            <span style={{ fontSize: 20 }}>{ic}</span>
            <span style={{ fontSize: 9, fontFamily: "'DM Sans',sans-serif", fontWeight: active ? 700 : 400 }}>{lb}</span>
          </button>
        );
      })}
    </div>
  );
}

function AddrInput(props) {
  var T = props.T;
  var [query, setQuery] = useState(props.value || "");
  var [suggestions, setSuggestions] = useState([]);
  var [open, setOpen] = useState(false);
  var [loading, setLoading] = useState(false);
  var wrapRef   = useRef(null);
  var timerRef  = useRef(null);

  useEffect(function() {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return function() { document.removeEventListener("mousedown", handleClick); };
  }, []);

  function searchMapbox(val) {
    if (!val || val.length < 2) { setSuggestions([]); return; }

    // Fallback local si pas de token
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "COLLE_TON_TOKEN_ICI") {
      setSuggestions(filterPlaces(val));
      return;
    }

    clearTimeout(timerRef.current);
    setLoading(true);
    timerRef.current = setTimeout(function() {
      fetch(
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        encodeURIComponent(val) +
        ".json?access_token=" + MAPBOX_TOKEN +
        "&language=fr&limit=6&types=address,place,poi,locality,neighborhood"
      )
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (!data.features) { setSuggestions([]); return; }
        var results = data.features.map(function(f) {
          return {
            label: f.place_name,
            lat:   f.center[1],
            lng:   f.center[0],
          };
        });
        setSuggestions(results);
        setLoading(false);
      })
      .catch(function() {
        setSuggestions(filterPlaces(val));
        setLoading(false);
      });
    }, 350);
  }

  function handleChange(e) {
    var val = e.target.value;
    setQuery(val);
    setOpen(true);
    searchMapbox(val);
  }

  function handleFocus() {
    setOpen(true);
    if (query.length >= 2) searchMapbox(query);
    else setSuggestions(filterPlaces(query));
  }

  function handleSelect(place) {
    setQuery(place.label);
    props.onSelect(place);
    setOpen(false);
    setSuggestions([]);
    // Fermer le clavier
    if (document.activeElement) document.activeElement.blur();
  }

  function handleClear() {
    setQuery("");
    setSuggestions([]);
  }

  return (
    <div ref={wrapRef} style={{ position: "relative", flex: 1 }}>
      <div style={{
        background: T.input, borderRadius: 10, padding: "9px 12px",
        display: "flex", alignItems: "center", gap: 7,
        border: open ? "1.5px solid " + T.accent : "1.5px solid transparent",
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: props.dot, flexShrink: 0, display: "inline-block" }} />
        <input
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={props.ph}
          style={{
            border: "none", background: "none", fontSize: 12,
            color: T.text, fontFamily: "'DM Sans',sans-serif",
            width: "100%", outline: "none",
          }}
        />
        {query.length > 0 && (
          <span
            onMouseDown={handleClear}
            style={{ fontSize: 14, color: T.muted, cursor: "pointer", flexShrink: 0 }}
          >×</span>
        )}
      </div>
      {open && loading && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200, background: T.card, borderRadius: 12, border: "1px solid " + T.border, padding: "12px 14px", fontSize: 12, color: T.muted, fontFamily: "'DM Sans',sans-serif", textAlign: "center" }}>
          Recherche en cours…
        </div>
      )}
      {open && !loading && suggestions.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          zIndex: 200, background: T.card, borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,.18)",
          border: "1px solid " + T.border, overflow: "hidden",
        }}>
          {suggestions.map(function(s, i) {
            return (
              <div
                key={i}
                onMouseDown={function() { handleSelect(s); }}
                style={{
                  padding: "10px 14px", fontSize: 12, color: T.text,
                  fontFamily: "'DM Sans',sans-serif", cursor: "pointer",
                  borderBottom: i < suggestions.length - 1 ? "1px solid " + T.bsub : "none",
                  display: "flex", alignItems: "center", gap: 8,
                }}
                onMouseEnter={function(e) { e.currentTarget.style.background = T.input; }}
                onMouseLeave={function(e) { e.currentTarget.style.background = T.card; }}
              >
                <span>📍</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Onboarding ─────────────────────────────────────────────────────────────
function Onboarding(props) {
  var [step, setStep] = useState(0);

  var steps = [
    { emoji: "🚗", title: "Tous tes transports,\nun seul endroit",   sub: "Uber, Bolt, Heetch, Lime, Tier…\nCompare tout en quelques secondes.", dark: true  },
    { emoji: "💰", title: "Le bon prix,\nau bon moment",              sub: "Certaines plateformes augmentent leurs prix aux heures de pointe. On te montre qui reste normal.", dark: false },
    { emoji: "⚡", title: "Prix dynamiques ?\nOn te prévient.",         sub: "Certaines plateformes augmentent leurs prix selon la demande. On t'indique qui reste au prix standard.", dark: false },
    { emoji: "📍", title: "Prêt à démarrer",                         sub: "Autorise la localisation pour voir les véhicules autour de toi.", dark: false },
  ];

  var s = steps[step];
  var isLast = step === steps.length - 1;
  var isDark = s.dark;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: isDark ? "#1a1a2e" : "#fff",
      display: "flex", flexDirection: "column",
      fontFamily: "'DM Sans', sans-serif",
      transition: "background .35s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "36px 24px 0" }}>
      <img src={ENHAX_LOGO} alt="Enhax" style={{ height: 20, opacity: 0.45 }} />
        {!isLast && (
          <button
            onClick={props.onDone}
            style={{ background: "none", border: "none", fontSize: 13, color: isDark ? "rgba(255,255,255,.4)" : "#ccc", cursor: "pointer", fontWeight: 600 }}
          >Passer →</button>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: isDark ? "rgba(255,255,255,.08)" : "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, marginBottom: 16 }}>
          {s.emoji}
        </div>

        {step === 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[["Ub", "#000"], ["Bt", "#34d186"], ["He", "#ff1c5b"], ["Lm", "#00c853"], ["Tr", "#1B5EF7"]].map(function(item) {
              return (
                <div key={item[0]} style={{ width: 34, height: 34, borderRadius: 9, background: item[1], color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>
                  {item[0]}
                </div>
              );
            })}
          </div>
        )}

        {step === 1 && (
          <div style={{ marginTop: 8, marginBottom: 0, width: "100%", maxWidth: 260 }}>
            {[["Bolt", "8,20 €", "#34d186", true], ["Heetch", "9,50 €", "#ff1c5b", false], ["Uber", "11,40 €", "#000", false]].map(function(item) {
              return (
                <div key={item[0]} style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8f8f8", borderRadius: 10, padding: "6px 10px", marginBottom: 4, border: item[3] ? "1.5px solid #1a1a2e" : "1px solid #eee" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: item[2], color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>{item[0].slice(0, 2)}</div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e", flex: 1 }}>{item[0]}</span>
                  {item[3] && <span style={{ fontSize: 9, fontWeight: 700, background: "#1a1a2e", color: "#fff", padding: "2px 6px", borderRadius: 4 }}>Meilleur prix</span>}
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{item[1]}</span>
                </div>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 12, padding: "8px 14px", fontSize: 12, fontWeight: 700, color: "#854f0b" }}>Hausse +80%</div>
            <div style={{ background: "#e1f5ee", border: "1px solid #34d186", borderRadius: 12, padding: "8px 14px", fontSize: 12, fontWeight: 700, color: "#085041" }}>Prix standard</div>
          </div>
        )}

        <div style={{ fontSize: 22, fontWeight: 700, color: isDark ? "#fff" : "#1a1a2e", lineHeight: 1.25, marginBottom: 10, whiteSpace: "pre-line", letterSpacing: -0.5 }}>
          {s.title}
        </div>
        <div style={{ fontSize: 13, color: isDark ? "rgba(255,255,255,.55)" : "#888", lineHeight: 1.5, maxWidth: 280, whiteSpace: "pre-line" }}>
          {s.sub}
        </div>
      </div>

      <div style={{ padding: "0 24px 28px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 7, marginBottom: 24 }}>
          {steps.map(function(_, j) {
            return (
              <div
                key={j}
                onClick={function() { setStep(j); }}
                style={{
                  height: 6, width: j === step ? 22 : 6, borderRadius: 3,
                  background: j === step ? (isDark ? "#fff" : "#1a1a2e") : (isDark ? "rgba(255,255,255,.2)" : "#e0e0e0"),
                  transition: "all .3s", cursor: "pointer",
                }}
              />
            );
          })}
        </div>

        <button
          onClick={function() { isLast ? props.onDone() : setStep(function(x) { return x + 1; }); }}
          style={{
            width: "100%", padding: 16, borderRadius: 16, border: "none",
            background: isDark ? "#fff" : "#1a1a2e",
            color: isDark ? "#1a1a2e" : "#fff",
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif", marginBottom: 10,
          }}
        >
          {isLast ? "Autoriser la localisation" : "Continuer"}
        </button>

        {step > 0 && (
          <button
            onClick={function() { setStep(function(x) { return x - 1; }); }}
            style={{ width: "100%", padding: 10, borderRadius: 16, border: "none", background: "transparent", color: isDark ? "rgba(255,255,255,.35)" : "#ccc", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: 6 }}
          >← Retour</button>
        )}

        {isLast && (
          <button
            onClick={props.onDone}
            style={{ width: "100%", padding: 10, borderRadius: 16, border: "none", background: "transparent", color: "#bbb", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
          >Pas maintenant</button>
        )}
      </div>
    </div>
  );
}


// ── Vélib' temps réel (OpenData Paris) ────────────────────────────────────
function useVelib(lat, lng) {
  var [stations, setStations] = useState([]);
  var [loading,  setLoading]  = useState(false);
  var [error,    setError]    = useState(null);

  useEffect(function() {
    if (!lat || !lng) return;
    setLoading(true);

    // API OpenData Paris - données temps réel Vélib'
    var url = "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel/records" +
      "?limit=5" +
      "&where=distance(coordonnees_geo%2C%20geom%27POINT(" + lng + "%20" + lat + ")%27%2C%20800m)" +
      "&order_by=distance(coordonnees_geo%2C%20geom%27POINT(" + lng + "%20" + lat + ")%27)";
    fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (!data.results) { setLoading(false); return; }
        var formatted = data.results.map(function(s) {
          var coords = s.coordonnees_geo;
          var sLat = coords ? coords.lat : lat;
          var sLng = coords ? coords.lon : lng;
          var dist = Math.round(haversine(lat, lng, sLat, sLng) * 1000);
          return {
            id:        s.stationcode,
            name:      s.name,
            dist:      dist,
            lat:       sLat,
            lng:       sLng,
            mechaDispo: s.numbikesavailable - (s.ebike || 0),
            elecDispo:  s.ebike || 0,
            totalDispo: s.numbikesavailable || 0,
            docks:      s.numdocksavailable || 0,
            isOpen:     s.is_installed === "OUI" && s.is_renting === "OUI",
          };
        }).filter(function(s) { return s.isOpen && s.totalDispo > 0; });
        setStations(formatted);
        setLoading(false);
      })
      .catch(function(e) {
        setError("Impossible de charger les données Vélib'");
        setLoading(false);
      });
  }, [lat, lng]);

  return { stations: stations, loading: loading, error: error };
}


// ── GBFS Micro-mobilité temps réel (Lime, Dott, Bird, Voi) ─────────────────
// Passe par le proxy Mobio (Vercel) pour contourner le blocage CORS.
// Politique "zéro simulation" : si aucune donnée réelle n'est trouvée, l'opérateur n'apparaît simplement pas.
var GBFS_PROXY = "https://mobio-proxy.vercel.app/api/gbfs?url=";

// Opérateurs avec un schéma d'URL prévisible par ville (vérifié via le catalogue officiel MobilityData systems.csv)
var GBFS_OPERATORS_TEMPLATED = [
  { id: "lime", urlTpl: "https://data.lime.bike/api/partners/v2/gbfs/{city}/free_bike_status.json" },
  { id: "dott", urlTpl: "https://gbfs.api.ridedott.com/public/v2/{city}/gbfs.json" },
  { id: "bird", urlTpl: "https://mds.bird.co/gbfs/v2/public/{city}/gbfs.json" },
];

// Voi utilise un identifiant unique par déploiement (pas de schéma par ville) — on doit le confirmer ville par ville
var GBFS_VOI_URLS = {
  marseille: "https://api.voiapp.io/gbfs/fr/6bb6b5dc-1cda-4da7-9216-d3023a0bc54a/v2/66/gbfs.json",
};

// Récupère les vélos/trottinettes depuis une URL GBFS, qu'elle soit un fichier
// "free_bike_status.json" direct ou un fichier de découverte "gbfs.json"
function fetchGbfsBikes(entryUrl) {
  return fetch(GBFS_PROXY + encodeURIComponent(entryUrl))
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data && data.data && Array.isArray(data.data.bikes)) {
        return data.data.bikes; // déjà un free_bike_status.json
      }
      // Sinon c'est un fichier de découverte gbfs.json — trouver le sous-flux free_bike_status
      var feeds = (data && data.data && (data.data.en || data.data.fr || Object.values(data.data || {})[0]));
      var feedList = feeds ? feeds.feeds : null;
      if (!feedList) return [];
      var match = feedList.filter(function(f) { return f.name === "free_bike_status"; })[0];
      if (!match) return [];
      return fetch(GBFS_PROXY + encodeURIComponent(match.url))
        .then(function(r2) { return r2.json(); })
        .then(function(data2) { return (data2 && data2.data && data2.data.bikes) || []; });
    });
}

function useGBFS(lat, lng) {
  var [vehicles, setVehicles] = useState({});
  var [loading,  setLoading]  = useState(false);

  useEffect(function() {
    if (!lat || !lng) { setVehicles({}); return; }

    var cityId = detectCity(lat, lng);
    if (!cityId) { setVehicles({}); return; }

    setLoading(true);
    var sources = GBFS_OPERATORS_TEMPLATED.map(function(op) {
      return { id: op.id, url: op.urlTpl.replace("{city}", cityId) };
    });
    if (GBFS_VOI_URLS[cityId]) sources.push({ id: "voi", url: GBFS_VOI_URLS[cityId] });

    var results = {};
    var pending = sources.length;
    if (pending === 0) { setVehicles({}); setLoading(false); return; }

    function done() {
      pending--;
      if (pending <= 0) {
        setVehicles(results); setLoading(false);
      }
    }

    sources.forEach(function(src) {
      fetchGbfsBikes(src.url)
        .then(function(bikes) {
          // Exclure les véhicules déjà réservés ou hors service — pas vraiment "disponibles"
          var available = bikes.filter(function(b) { return !b.is_reserved && !b.is_disabled; });
          var nearby = available.filter(function(b) {
            if (!b.lat || !b.lon) return false;
            return haversine(lat, lng, b.lat, b.lon) * 1000 < 800;
          }).map(function(b) {
            var dist = Math.round(haversine(lat, lng, b.lat, b.lon) * 1000);
            var isBike = (b.vehicle_type || "").toLowerCase().indexOf("bike") >= 0 || (b.vehicle_type_id || "") === "3";
            var bat = b.current_range_meters ? Math.min(100, Math.round(b.current_range_meters / 400 * 100) / 100 * 100) : null;
            return { id: b.bike_id, dist: dist, bat: bat, isBike: isBike, lat: b.lat, lng: b.lon, rentalUris: b.rental_uris || null };
          }).sort(function(a, b) { return a.dist - b.dist; });

          if (nearby.length > 0) results[src.id] = nearby;
        })
        .catch(function() { /* opérateur indisponible dans cette ville — pas de fallback simulé */ })
        .then(done);
    });
  }, [lat, lng]);

  return { vehicles: vehicles, loading: loading };
}


// ── JCDecaux vélos en libre-service (toutes villes françaises) ─────────────
// Paris géré par Smovengo (Vélib') — pas JCDecaux
var JCDECAUX_CITIES = {
  lyon:       { contract: "lyon",       name: "Lyon",       color: "#e2001a",  service: "Velo'v",      unlock: 0, pMin: 0.10, freeMins: 30 },
  bordeaux:   { contract: "bordeaux",   name: "Bordeaux",   color: "#6f3996", service: "V3",           unlock: 0, pMin: 0.10, freeMins: 30 },
  marseille:  { contract: "marseille",  name: "Marseille",  color: "#009fe3", service: "Le Velo",      unlock: 0, pMin: 0.10, freeMins: 30 },
  toulouse:   { contract: "toulouse",   name: "Toulouse",   color: "#f0a500", service: "VeloToulouse", unlock: 0, pMin: 0.10, freeMins: 30 },
  nantes:     { contract: "nantes",     name: "Nantes",     color: "#00a550", service: "Bicloo",       unlock: 0, pMin: 0.10, freeMins: 30 },
  lille:      { contract: "lille",      name: "Lille",      color: "#e2001a", service: "V'Lille",     unlock: 0, pMin: 0.10, freeMins: 30 },
  rennes:     { contract: "rennes",     name: "Rennes",     color: "#003189", service: "Star",         unlock: 0, pMin: 0.10, freeMins: 30 },
  strasbourg: { contract: "strasbourg", name: "Strasbourg", color: "#e2001a", service: "Velhop",      unlock: 0, pMin: 0.10, freeMins: 30 },
  rouen:      { contract: "rouen",      name: "Rouen",      color: "#009fe3", service: "Cy'clic",     unlock: 0, pMin: 0.10, freeMins: 30 },
  amiens:     { contract: "amiens",     name: "Amiens",     color: "#0072b9", service: "Velam",        unlock: 0, pMin: 0.10, freeMins: 30 },
  nancy:      { contract: "nancy",      name: "Nancy",      color: "#e2001a", service: "velo+",        unlock: 0, pMin: 0.10, freeMins: 30 },
  creteil:    { contract: "creteil",    name: "Créteil",    color: "#0072b9" },
};

// Détecte la ville selon les coordonnées GPS
function detectCity(lat, lng) {
  var cities = [
    { id: "paris",           lat: 48.8566, lng: 2.3522,   radius: 0.3  },
    { id: "lyon",            lat: 45.7640, lng: 4.8357,   radius: 0.2  },
    { id: "bordeaux",        lat: 44.8378, lng: -0.5792,  radius: 0.15 },
    { id: "marseille",       lat: 43.2965, lng: 5.3698,   radius: 0.2  },
    { id: "toulouse",        lat: 43.6047, lng: 1.4442,   radius: 0.15 },
    { id: "nantes",          lat: 47.2184, lng: -1.5536,  radius: 0.15 },
    { id: "lille",           lat: 50.6292, lng: 3.0573,   radius: 0.15 },
    { id: "rennes",          lat: 48.1173, lng: -1.6778,  radius: 0.12 },
    { id: "strasbourg",      lat: 48.5734, lng: 7.7521,   radius: 0.12 },
    { id: "rouen",           lat: 49.4432, lng: 1.0993,   radius: 0.12 },
    { id: "amiens",          lat: 49.8942, lng: 2.2957,   radius: 0.10 },
    { id: "nancy",           lat: 48.6921, lng: 6.1844,   radius: 0.10 },
    { id: "creteil",         lat: 48.7904, lng: 2.4558,   radius: 0.10 },
    { id: "besancon",        lat: 47.2378, lng: 6.0241,   radius: 0.10 },
    { id: "mulhouse",        lat: 47.7508, lng: 7.3359,   radius: 0.10 },
    { id: "aix-en-provence", lat: 43.5297, lng: 5.4474,   radius: 0.10 },
    { id: "cergy-pontoise",  lat: 49.0369, lng: 2.0752,   radius: 0.12 },
    { id: "montbeliard",     lat: 47.5100, lng: 6.7983,   radius: 0.08 },
    { id: "brest",           lat: 48.3904, lng: -4.4861,  radius: 0.10 },
    { id: "caen",            lat: 49.1829, lng: -0.3707,  radius: 0.10 },
    { id: "montpellier",     lat: 43.6108, lng: 3.8767,   radius: 0.15 },
  ];
  for (var i = 0; i < cities.length; i++) {
    var c = cities[i];
    var dist = Math.sqrt(Math.pow(lat - c.lat, 2) + Math.pow(lng - c.lng, 2));
    if (dist < c.radius) return c.id;
  }
  return null;
}

function useJCDecaux(lat, lng) {
  var [stations, setStations] = useState([]);
  var [loading,  setLoading]  = useState(false);
  var [cityName, setCityName] = useState(null);

  useEffect(function() {
    if (!lat || !lng) return;
    if (!JCDECAUX_KEY || JCDECAUX_KEY === "COLLE_TA_CLE_JCDECAUX") return;

    var cityId = detectCity(lat, lng);
    if (!cityId) return; // Pas de vélos JCDecaux dans cette ville

    var city = JCDECAUX_CITIES[cityId];
    if (!city) return; // Ville non couverte par JCDecaux
    setCityName(city.name);
    setLoading(true);

    fetch(
      "https://api.jcdecaux.com/vls/v1/stations?contract=" + city.contract +
      "&apiKey=" + JCDECAUX_KEY
    )
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!Array.isArray(data)) { setLoading(false); return; }

      // Trouver les 3 stations les plus proches
      var withDist = data
        .filter(function(s) { return s.status === "OPEN" && s.available_bikes > 0; })
        .map(function(s) {
          var sLat = s.position.lat;
          var sLng = s.position.lng;
          var dist = Math.round(haversine(lat, lng, sLat, sLng) * 1000);
          return {
            id:          s.number,
            name:        s.name,
            dist:        dist,
            lat:         sLat,
            lng:         sLng,
            mechaDispo:  s.available_bikes || 0,
            elecDispo:   0,
            totalDispo:  s.available_bikes || 0,
            docks:       s.available_bike_stands || 0,
            city:        city,
          };
        })
        .sort(function(a, b) { return a.dist - b.dist; })
        .slice(0, 3);

      setStations(withDist);
      setLoading(false);
    })
    .catch(function() { setLoading(false); });
  }, [lat, lng]);

  return { stations: stations, loading: loading, cityName: cityName };
}


// ── Compare ────────────────────────────────────────────────────────────────
function Compare(props) {
  var T = props.T;
  // props.onBell, props.unreadCount passed from App
  var from    = props.fromAddr;
  var to      = props.toAddr || null;
  var setFrom = props.setFromAddr;
  var setTo   = props.setToAddr;
  var geoLoading = props.geoLoading;
  var [tab,   setTab]   = useState("vtc");
  var [microFilter, setMicroFilter] = useState("all");
  var [scSort, setScSort] = useState("dist"); // "dist" ou "bat"
  var [vtcSubFilter, setVtcSubFilter] = useState("vtc"); // "vtc" ou "moped"
  var [sort,  setSort]  = useState("price_asc");
  var [flash, setFlash] = useState(false);
  var [passengers, setPassengers] = useState(1);
  // Vélib' uniquement à Paris (lat ~48.8, lng ~2.3)
  var isInParis = from.lat > 48.7 && from.lat < 49.0 && from.lng > 2.1 && from.lng < 2.6;
  var velib = useVelib(isInParis ? from.lat : null, isInParis ? from.lng : null);
  var gbfs  = useGBFS(from.lat, from.lng);
  var jcdecaux = useJCDecaux(from.lat, from.lng);

  var km   = to ? Math.max(0.5, haversine(from.lat, from.lng, to.lat, to.lng) * 1.35) : 5.2;
  var mins = Math.round(km / 0.38);
  var scMins = Math.round(km * 60 / 14);

  var cityId = detectCity(from.lat, from.lng) || "";
  var mopedList = Object.keys(MOPEDS).filter(function(id) {
    return MOPEDS[id].cities.indexOf(cityId) >= 0;
  }).map(function(id) {
    var m = MOPEDS[id];
    return { id: id, name: m.name, short: m.short, color: m.color, tc: m.tc,
      stars: m.stars, price: calcMopedPrice(id, km, mins), label: m.label, info: m.info };
  });

  var trafColor = mins > 20 ? "#c0392b" : mins > 12 ? "#ba7517" : "#0f6e56";
  var trafLabel = mins > 20 ? "Chargé" : mins > 12 ? "Moyen" : "Fluide";

  var surgeInfo = getSurge();

  var vtcList = Object.keys(PLATFORMS).reduce(function(acc, id, idx) {
    var p = PLATFORMS[id];
    var mult = surgeInfo.multipliers[id] || 1.0;
    var basePrice = calcVtcPrice(id, km, mins);
    var cats = p.categories.filter(function(c) { return c.seats >= passengers; });
    cats.forEach(function(cat) {
      var seatMult = cat.seats >= 6 ? 1.35 : 1.0; // XL/Van plus cher
      acc.push({
        id: id + "_" + cat.label, plId: id,
        name: cat.label, short: p.short, color: p.color, tc: p.tc,
        stars: p.stars, seats: cat.seats, eta: [3,4,6,8][idx],
        price: Math.round(basePrice * mult * seatMult * 100) / 100,
        basePrice: basePrice, surge: mult,
      });
    });
    return acc;
  }, []).sort(function(a, b) {
    if (sort === "price_asc")  return a.price  - b.price;
    if (sort === "price_desc") return b.price  - a.price;
    if (sort === "stars")      return b.stars  - a.stars;
    if (sort === "eta_asc")    return a.eta    - b.eta;
    return 0;
  });

  // Scooters fictifs (Lime, Tier, Dott) + Vélib' temps réel
  // Politique "zéro simulation" : on ne construit que les entrées pour lesquelles
  // une vraie position a été trouvée via le proxy GBFS. Aucun fallback inventé.
  var scList = Object.keys(SCOOTERS).filter(function(id) { return id !== "velib"; }).map(function(id) {
    var s = SCOOTERS[id];
    var operatorKey = id.indexOf("lime") === 0 ? "lime" : id.indexOf("dott") === 0 ? "dott" : id.indexOf("bird") === 0 ? "bird" : id.indexOf("voi") === 0 ? "voi" : null;
    var realData = operatorKey ? gbfs.vehicles[operatorKey] : null;
    var realMatch = realData ? realData.filter(function(v) { return s.type === "bike" ? v.isBike : !v.isBike; })[0] : null;
    if (!realMatch) return null; // pas de donnée réelle trouvée — on ne l'affiche pas

    return { id: id, name: s.name + " — " + s.label, short: s.short, color: s.color, tc: s.tc, type: s.type,
      bat: realMatch.bat !== null ? Math.round(realMatch.bat) : null,
      unlock: s.unlock, pMin: s.pMin, price: calcScPrice(id, scMins), dist: realMatch.dist, real: true,
      operatorKey: operatorKey, rentalUris: realMatch.rentalUris };
  }).filter(function(v) { return v !== null; }).concat(
    velib.stations.slice(0, 2).map(function(st) {
      var walkMins = Math.round(st.dist / 80); // ~80m/min à pied
      var rideMins = scMins;
      var price = st.elecDispo > 0 ? Math.round((1 + rideMins * 0.17) * 100) / 100 : Math.round((rideMins > 45 ? 1 + (rideMins - 45) * 0.10 : 0) * 100) / 100;
      return {
        id: "velib_" + st.id,
        name: "Vélib'",  stationLabel: st.elecDispo > 0 ? "Électrique" : "Mécanique",
        short: "Vb", color: "#0072b9", tc: "#fff",
        type: "station",
        subtype: st.elecDispo > 0 ? "Électrique" : "Mécanique",
        bat: null, unlock: 0, pMin: st.elecDispo > 0 ? 0.17 : 0,
        price: price,
        dist: st.dist,
        real: true,
        mechaDispo: st.mechaDispo,
        elecDispo: st.elecDispo,
        totalDispo: st.totalDispo,
        stationName: st.name,
        walkMins: walkMins,
      };
    })
  );


  return (
    <div style={{ flex: 1, overflowY: "auto", background: T.bg }}>
      <div style={{ background: T.card, padding: "18px 16px 14px", borderBottom: "1px solid " + T.border }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif", letterSpacing: -0.5 }}>Mobio</div>
            <div style={{ fontSize: 12, color: T.sub, marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>Tous les transports, un seul endroit</div>
          </div>
          <button
            onClick={props.onBell}
            style={{ position: "relative", background: T.input, border: "none", borderRadius: 12, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18 }}
          >
            🔔
            {props.unreadCount > 0 && (
              <div style={{ position: "absolute", top: 6, right: 6, width: 16, height: 16, borderRadius: "50%", background: "#c0392b", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>
                {props.unreadCount}
              </div>
            )}
          </button>
        </div>
      </div>

      <div style={{ padding: "12px 16px 0", background: T.card }}>
        <div style={{ position: "relative", marginBottom: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <AddrInput value={from.label} dot="#34d186" ph="Départ"  onSelect={function(p) { setFrom(p); setFlash(true); setTimeout(function() { setFlash(false); }, 800); }} T={T} />
          <AddrInput value={to ? to.label : ""} dot={T.accent} ph="Où voulez-vous aller ?" onSelect={function(p) { setTo(p); setFlash(true); setTimeout(function() { setFlash(false); }, 800); }} T={T} />
        </div>
        <button
          onClick={function() { var tmp = from; setFrom(to); setTo(tmp); setFlash(true); setTimeout(function() { setFlash(false); }, 800); }}
          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: T.card, border: "1px solid " + T.border, borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, boxShadow: "0 1px 4px rgba(0,0,0,.1)", zIndex: 10 }}
          title="Inverser départ et arrivée"
        >⇅</button>
        {geoLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: T.input, borderRadius: 20, fontSize: 11, color: T.sub, fontFamily: "'DM Sans',sans-serif", marginTop: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, animation: "pulse 1s infinite" }} />
            Détection de ta position...
          </div>
        )}
        </div>
        <div style={{ background: flash ? "#e1f5ee" : T.input, borderRadius: 10, padding: "8px 12px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8, transition: "background .4s", border: flash ? "1px solid #34d186" : "1px solid transparent" }}>
          <span style={{ fontSize: 13 }}>📍</span>
          <span style={{ fontSize: 12, color: T.sub, fontFamily: "'DM Sans',sans-serif" }}>
            {from.label} → {to ? to.label : "..."}
          </span>
          {flash && <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#085041", fontFamily: "'DM Sans',sans-serif" }}>✓ Mis à jour</span>}
        </div>

        <div style={{ display: "flex", gap: 7, marginBottom: 10, flexWrap: "wrap" }}>
          {props.favs.map(function(fav) {
            return (
              <div
                key={fav.id}
                onClick={function() {
                  if (fav.addr) { setTo({ label: fav.addr, lat: fav.lat, lng: fav.lng }); }
                  else { props.onFav(fav, "edit"); }
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: fav.addr ? "#e8f0fe" : T.input,
                  border: fav.addr ? "1px solid #c5d9ff" : "1px dashed " + T.border,
                  borderRadius: 20, padding: "5px 11px", cursor: "pointer",
                  fontSize: 11, fontFamily: "'DM Sans',sans-serif",
                  color: fav.addr ? T.accent : T.muted, fontWeight: fav.addr ? 600 : 400,
                }}
              >
                <span>{fav.icon}</span><span>{fav.addr ? fav.label : "+ " + fav.label}</span>
              </div>
            );
          })}
          <div
            onClick={function() { props.onFav(null, "new"); }}
            style={{ display: "flex", alignItems: "center", gap: 4, background: T.input, border: "1px dashed " + T.border, borderRadius: 20, padding: "5px 11px", cursor: "pointer", fontSize: 11, color: T.muted, fontFamily: "'DM Sans',sans-serif" }}
          >+ Nouveau</div>
        </div>

        {props.toAddr && <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {[[km.toFixed(1) + " km", "Distance"], [formatDuration(mins), "Durée"], [trafLabel, "Trafic"]].map(function(item, i) {
            return (
              <div key={item[1]} style={{ flex: 1, background: T.input, borderRadius: 8, padding: "7px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: i === 2 ? trafColor : T.text, fontFamily: "'DM Sans',sans-serif" }}>{item[0]}</div>
                <div style={{ fontSize: 9, color: T.sub, marginTop: 1, fontFamily: "'DM Sans',sans-serif" }}>{item[1]}</div>
              </div>
            );
          })}
        </div>}

        {/* Sélecteur passagers */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, background: T.input, borderRadius: 10, padding: "8px 12px" }}>
          <span style={{ fontSize: 16 }}>👥</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif", flex: 1 }}>
            {passengers === 1 ? "1 passager" : passengers + " passagers"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={function() { setPassengers(function(p) { return Math.max(1, p - 1); }); }} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid " + T.border, background: T.card, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.text }}>−</button>
            <span style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif", minWidth: 16, textAlign: "center" }}>{passengers}</span>
            <button onClick={function() { setPassengers(function(p) { return Math.min(7, p + 1); }); }} style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid " + T.border, background: T.card, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.text }}>+</button>
          </div>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid " + T.border, marginLeft: -16, marginRight: -16, paddingLeft: 16 }}>
          {[["vtc", "Véhicules"], ["micro", "Micro-mobilité"]].map(function(item) {
            return (
              <button
                key={item[0]}
                onClick={function() { setTab(item[0]); }}
                style={{ padding: "8px 14px", fontSize: 12, fontWeight: tab === item[0] ? 700 : 400, color: tab === item[0] ? T.text : T.sub, border: "none", background: "none", borderBottom: tab === item[0] ? "2px solid " + T.accent : "2px solid transparent", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
              >{item[1]}</button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "10px 12px" }}>
        {tab === "vtc" ? (
          <div>
            {/* Sous-filtres VTC / Scooters */}
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              {[["vtc","🚗 VTC"],["moped","🛵 Scooters"]].map(function(f) {
                var active = vtcSubFilter === f[0];
                return (
                  <button key={f[0]} onClick={function() { setVtcSubFilter(f[0]); }}
                    style={{ flex: 1, padding: "7px 0", borderRadius: 20, border: "none", fontWeight: 700, fontSize: 12,
                      fontFamily: "'DM Sans',sans-serif", cursor: "pointer",
                      background: active ? T.accent : T.input, color: active ? "#fff" : T.muted }}>
                    {f[1]}
                  </button>
                );
              })}
            </div>
            {vtcSubFilter === "vtc" && <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
              {[["price_asc", "Prix croissant"], ["price_desc", "Prix décroissant"], ["stars", "Meilleures notes"], ["eta_asc", "Plus rapide"]].map(function(item) {
                return (
                  <button
                    key={item[0]}
                    onClick={function() { setSort(item[0]); }}
                    style={{ padding: "5px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", background: sort === item[0] ? T.accent : T.input, color: sort === item[0] ? "#fff" : T.sub }}
                  >{item[1]}</button>
                );
              })}
            </div>}

            {vtcSubFilter === "vtc" && surgeInfo.hasSurge && (
              <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 12, padding: "10px 12px", marginBottom: 10, display: "flex", gap: 8 }}>
                <span style={{ fontSize: 16 }}>⚡</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#854f0b", fontFamily: "'DM Sans',sans-serif" }}>Prix dynamiques en cours</div>
                  <div style={{ fontSize: 11, color: "#996210", marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>{surgeInfo.reasons.join(" · ")}</div>
                </div>
              </div>
            )}

            {vtcSubFilter === "moped" && (
              <div>
                {mopedList.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 20px", color: T.muted, fontFamily: "'DM Sans',sans-serif" }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>🛵</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 6 }}>Pas de scooter dans cette ville</div>
                    <div style={{ fontSize: 12 }}>Yego opère à Paris, Bordeaux, Toulouse et Nice.</div>
                  </div>
                ) : mopedList.map(function(m) {
                  return (
                    <div key={m.id} onClick={function() { openMopedApp(m.id); }}
                      style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, padding: "11px 13px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <Logo short={m.short} color={m.color} tc={m.tc} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: T.sub, marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>{m.label} · ⭐ {m.stars}</div>
                        <div style={{ fontSize: 11, color: T.muted, marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>{m.info}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        {to && <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{m.price.toFixed(2)} €</div>}
                        <div style={{ fontSize: 10, color: T.muted, fontFamily: "'DM Sans',sans-serif" }}>{m.pMin.toFixed(2).replace(".",",")}€/min</div>
                        <div style={{ fontSize: 9, color: T.muted, fontFamily: "'DM Sans',sans-serif" }}>sans abonnement</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {vtcSubFilter === "vtc" && vtcList.length === 0 && (
              <div style={{ textAlign: "center", padding: "32px 20px", color: T.muted, fontFamily: "'DM Sans',sans-serif" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>😕</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 6 }}>Aucun véhicule disponible</div>
                <div style={{ fontSize: 12 }}>Aucune option pour {passengers} passagers. Essaie de réduire le nombre.</div>
              </div>
            )}
            {vtcSubFilter === "vtc" && vtcList.map(function(v, i) {
              return (
                <div
                  key={v.id}
                  onClick={function() { props.onVehicle(v); }}
                  style={{ background: T.card, border: i === 0 ? "1.5px solid " + T.accent : "1px solid " + T.border, borderRadius: 14, padding: "11px 13px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", position: "relative", opacity: v.surge > 1.6 ? 0.85 : 1 }}
                >
                  {i === 0 && <div style={{ position: "absolute", top: -9, right: 12, background: T.accent, color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 5, fontFamily: "'DM Sans',sans-serif" }}>Meilleur prix</div>}
                  {v.surge > 1 && <div style={{ position: "absolute", top: -9, left: 12, background: v.surge >= 1.8 ? "#c0392b" : "#e67e22", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 5, fontFamily: "'DM Sans',sans-serif" }}>x{v.surge.toFixed(1)}</div>}
                  <Logo short={v.short} color={v.color} tc={v.tc} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{v.name}</div>
                    <div style={{ fontSize: 11, color: T.sub, marginTop: 3, display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans',sans-serif" }}>
                      <span style={{ background: T.input, padding: "2px 6px", borderRadius: 5, fontSize: 10 }}>⏱ {v.eta} min</span>
                      <span style={{ background: "#fffbe6", color: "#854f0b", padding: "2px 6px", borderRadius: 5, fontSize: 10 }}>⭐ {v.stars}</span>
                      <span style={{ background: T.input, padding: "2px 6px", borderRadius: 5, fontSize: 10 }}>👥 {v.seats}</span>
                      {v.surge === 1 && <span style={{ background: "#e1f5ee", color: "#085041", padding: "2px 6px", borderRadius: 5, fontSize: 10, fontWeight: 700 }}>Prix standard</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {v.surge > 1 && <div style={{ fontSize: 10, color: T.muted, textDecoration: "line-through", fontFamily: "'DM Sans',sans-serif" }}>{v.basePrice.toFixed(2)} €</div>}
                    <div style={{ fontSize: 18, fontWeight: 700, color: v.surge >= 1.8 ? "#c0392b" : T.text, fontFamily: "'DM Sans',sans-serif" }}>{v.price.toFixed(2)} €</div>
                    <div style={{ fontSize: 10, color: T.muted, fontFamily: "'DM Sans',sans-serif" }}>estimé</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              {[["dist","📍 Distance"],["bat","🔋 Batterie"]].map(function(s) {
                var active = scSort === s[0];
                return (
                  <button key={s[0]} onClick={function() { setScSort(s[0]); }}
                    style={{ flex: 1, padding: "6px 0", borderRadius: 20, border: "none", fontWeight: 700, fontSize: 11,
                      fontFamily: "'DM Sans',sans-serif", cursor: "pointer",
                      background: active ? T.accent : T.input, color: active ? "#fff" : T.muted }}>
                    {s[1]}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
              {[["all","Tout"],["scooter","Trottinettes"],["bike","Vélos libres"],["station","Vélos en station"]].map(function(f) {
                return (
                  <button key={f[0]} onClick={function() { setMicroFilter(f[0]); }} style={{ padding: "5px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", background: microFilter === f[0] ? T.accent : T.input, color: microFilter === f[0] ? "#fff" : T.sub }}>{f[1]}</button>
                );
              })}
            </div>
            {(velib.loading || gbfs.loading) && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: T.input, borderRadius: 12, marginBottom: 10, fontSize: 12, color: T.sub, fontFamily: "'DM Sans',sans-serif" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0072b9", animation: "pulse 1s infinite" }} />
                Chargement des données temps réel…
              </div>
            )}
            {scList.slice().sort(function(a, b) {
                if (scSort === "bat") return (b.bat || 0) - (a.bat || 0);
                return (a.dist || 0) - (b.dist || 0);
              }).filter(function(s) {
              // Filtrer par catégorie
              if (microFilter !== "all") {
                var type = s.real ? s.type : (SCOOTERS[s.id] ? SCOOTERS[s.id].type : null);
                if (type !== microFilter) return false;
              }
              // Sans destination: seulement les stations réelles dans 1km
              if (!props.toAddr) {
                if (!s.real) return false;
                if (s.dist > 1000) return false;
              }
              return true;
            }).map(function(s) {
              return (
                <div key={s.id} onClick={function() { if (s.operatorKey) openScApp(s.operatorKey, s.rentalUris); }} style={{ background: T.card, border: s.real ? "1.5px solid #0072b9" : "1px solid " + T.border, borderRadius: 14, padding: "11px 13px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10, position: "relative", cursor: s.operatorKey ? "pointer" : "default" }}>
                  <Logo short={s.short} color={s.color} tc={s.tc} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: T.sub, marginTop: 3, display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans',sans-serif", flexWrap: "wrap" }}>
                      {s.real && s.dist && <span>🚶 {s.dist < 1000 ? s.dist + " m" : (s.dist/1000).toFixed(1) + " km"} à pied</span>}
                      {!s.real && props.toAddr && <span>📍 {s.dist} m</span>}
                      {s.real && <span style={{ color: s.elecDispo > 0 ? "#34d186" : T.sub }}>⚡ {s.elecDispo} élec</span>}
                      {s.real && <span>🚲 {s.mechaDispo} méca</span>}
                      {s.bat && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <div style={{ width: 26, height: 4, background: T.border, borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ width: s.bat + "%", height: "100%", background: s.color }} />
                          </div>
                          {s.bat}%
                        </span>
                      )}
                      {s.real && s.stationName && <span style={{ color: T.muted, fontSize: 10 }}>Station : {s.stationName.length > 20 ? s.stationName.slice(0,20)+"…" : s.stationName}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {props.toAddr ? (
                      <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{s.price.toFixed(2)} €</div>
                    ) : null}
                    <div style={{ fontSize: 10, color: T.muted, fontFamily: "'DM Sans',sans-serif" }}>{s.real && s.type === "station" ? (s.freeMins ? "Gratuit " + s.freeMins + "min · ~" + s.pMin + "€/min ensuite" : "Gratuit 45min · ~0,17€/min ensuite") : (s.unlock > 0 ? s.unlock + "€+" + s.pMin + "€/min" : s.pMin + "€/min")}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Map Mapbox ─────────────────────────────────────────────────────────────

function MapView(props) {
  var T = props.T;
  var mapRef     = useRef(null);
  var mapboxRef  = useRef(null);
  var markersRef = useRef([]);
  var [ready,    setReady]    = useState(false);
  var [noToken,  setNoToken]  = useState(false);
  var [filter,   setFilter]   = useState("tous");
  var [selected, setSelected] = useState(null);
  var [mapStations, setMapStations] = useState([]);
  var posRef = useRef(props.fromAddr || { lat: 48.8566, lng: 2.3522 });
  var gbfs = useGBFS(props.fromAddr ? props.fromAddr.lat : null, props.fromAddr ? props.fromAddr.lng : null);

  var km = 5.2;

  // Positions estimées pour les VTC et scooters partagés (pas d'API de position publique)
  var VEHICLE_OFFSETS = [
    { id: "uber",    kind: "vtc",    dlat:  0.008, dlng:  0.010 },
    { id: "bolt",    kind: "vtc",    dlat:  0.012, dlng: -0.008 },
    { id: "heetch",  kind: "vtc",    dlat: -0.006, dlng:  0.014 },
    { id: "marcel",  kind: "vtc",    dlat:  0.015, dlng:  0.005 },
    { id: "yego",       kind: "moped",  dlat: -0.007, dlng: -0.009 },
    { id: "cityscoot",  kind: "moped",  dlat:  0.006, dlng:  0.013 },
  ];

  function addMarkers(map, currentFilter) {
    var mapboxgl = window.mapboxgl;
    markersRef.current.forEach(function(m) { m.remove(); });
    markersRef.current = [];

    // Centre = adresse de départ
    var baseLat = props.fromAddr ? props.fromAddr.lat : 48.8809;
    var baseLng = props.fromAddr ? props.fromAddr.lng : 2.3553;

    VEHICLE_OFFSETS
      .filter(function(v) { return currentFilter === "tous" || v.kind === currentFilter || (currentFilter === "station" && v.kind === "station"); })
      .forEach(function(v) {
        var p = PLATFORMS[v.id] || MOPEDS[v.id] || SCOOTERS[v.id];
        if (!p) return; // skip if not found
        var isVtc = v.kind === "vtc";
        var isMoped = v.kind === "moped";
        var label = isVtc ? (p.name + " · " + calcVtcPrice(v.id, km, 14).toFixed(2) + " €") : isMoped ? ("🛵 " + p.name + " · " + calcMopedPrice(v.id, km, 14).toFixed(2) + " €") : (v.kind === "scooter" ? ("🛴 " + p.name) : ("🚲 " + p.name));

        var vLat = baseLat + v.dlat;
        var vLng = baseLng + v.dlng;

        // Wrapper transparent — Mapbox l'utilise pour le positionnement
        var el = document.createElement("div");
        el.style.cssText = "position:relative;display:inline-block;width:auto;";

        // Inner div — c'est lui qu'on anime au hover
        var inner = document.createElement("div");
        inner.style.cssText = "display:inline-block;background:white;color:#1a1a2e;padding:3px 8px;border-radius:12px;font-size:11px;font-weight:700;font-family:'DM Sans',sans-serif;white-space:nowrap;cursor:pointer;box-shadow:0 1px 6px rgba(0,0,0,.15);border:1px solid #e0e0e0;transition:transform .15s;user-select:none;line-height:1.4;width:auto;";
        inner.textContent = label;
        inner.onmouseenter = function() { inner.style.transform = "scale(1.1)"; };
        inner.onmouseleave = function() { inner.style.transform = "scale(1)"; };
        inner.onclick = function(e) {
          e.stopPropagation();
          setSelected(function(prev) { return prev === v.id ? null : v.id; });
        };
        el.appendChild(inner);

        var marker = new mapboxgl.Marker({ element: el, anchor: "center" })
          .setLngLat([vLng, vLat])
          .addTo(map);

        markersRef.current.push(marker);
      });

    // Vraies trottinettes/vélos (Lime, Dott, Bird, Voi) — positions GPS réelles via le proxy GBFS
    // Tous les véhicules réels dans le rayon défini sont affichés, sans limite arbitraire
    Object.keys(gbfs.vehicles).forEach(function(operatorKey) {
      gbfs.vehicles[operatorKey].forEach(function(veh) {
        var scId = operatorKey === "lime" ? (veh.isBike ? "lime_bk" : "lime_sc") : operatorKey;
        var s = SCOOTERS[scId];
        if (!s) return;
        if (currentFilter !== "tous" && currentFilter !== s.type) return;

        var el = document.createElement("div");
        el.style.cssText = "display:inline-block;";
        var inner = document.createElement("div");
        inner.style.cssText = "background:" + s.color + ";color:" + s.tc + ";padding:3px 8px;border-radius:12px;font-size:11px;font-weight:700;font-family:'DM Sans',sans-serif;white-space:nowrap;cursor:pointer;box-shadow:0 1px 6px rgba(0,0,0,.15);";
        inner.textContent = (s.type === "bike" ? "🚲 " : "🛴 ") + s.name;
        inner.onclick = function(e) { e.stopPropagation(); setSelected(function(prev) { return prev === scId ? null : scId; }); };
        el.appendChild(inner);

        var marker = new mapboxgl.Marker({ element: el, anchor: "center" })
          .setLngLat([veh.lng, veh.lat])
          .addTo(map);
        markersRef.current.push(marker);
      });
    });
  }

  // 1. Load Mapbox GL JS
  useEffect(function() {
    if (MAPBOX_TOKEN === "COLLE_TON_TOKEN_ICI") { setNoToken(true); return; }
    if (window.mapboxgl) { setReady(true); return; }

    var css = document.createElement("link");
    css.rel  = "stylesheet";
    css.href = "https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/dist/mapbox-gl.css";
    document.head.appendChild(css);

    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/dist/mapbox-gl.js";
    script.onload = function() { setReady(true); };
    document.head.appendChild(script);
  }, []);

  // Charge les marqueurs de stations selon la position
  function loadStationMarkers(map, pos, mapboxgl) {
    if (!map || !pos) return;
    var lat = pos.lat, lng = pos.lng;
    var isInParis = lat > 48.7 && lat < 49.0 && lng > 2.1 && lng < 2.6;

    // Vélib' Paris
    if (isInParis) {
      fetch(
        "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel/records" +
        "?limit=8&where=distance(coordonnees_geo%2C%20geom%27POINT(" + lng + "%20" + lat + ")%27%2C%201000m)" +
        "&order_by=distance(coordonnees_geo%2C%20geom%27POINT(" + lng + "%20" + lat + ")%27)"
      )
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (!data.results || !map) return;
        var newStations = data.results.filter(function(s) {
          return s.coordonnees_geo && s.is_installed === "OUI" && s.is_renting === "OUI" && s.numbikesavailable > 0;
        }).map(function(s) {
          return { id: s.stationcode, name: s.name, total: s.numbikesavailable, elec: s.ebike || 0, lat: s.coordonnees_geo.lat, lng: s.coordonnees_geo.lon };
        });
        setMapStations(newStations);
        data.results.forEach(function(s) {
          if (!s.coordonnees_geo) return;
          if (s.is_installed !== "OUI" || s.is_renting !== "OUI") return;
          if (!s.numbikesavailable || s.numbikesavailable === 0) return;
          var el = document.createElement("div");
          el.style.cssText = "display:inline-block;";
          var inner = document.createElement("div");
          inner.style.cssText = "background:#0072b9;color:white;padding:3px 7px;border-radius:10px;font-size:10px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;box-shadow:0 1px 6px rgba(0,0,0,.2);white-space:nowrap;";
          inner.textContent = "🚲 " + s.numbikesavailable;
          el.appendChild(inner);
          (function(station) {
            var popup = new mapboxgl.Popup({ offset: 20, closeButton: true })
              .setHTML(
                "<div style='font-family:DM Sans,sans-serif;padding:4px 2px'>" +
                "<div style='font-weight:700;font-size:13px;margin-bottom:4px'>" + station.name + "</div>" +
                "<div style='font-size:12px;color:#555'>🚲 " + station.numbikesavailable + " vélos dispo</div>" +
                "<div style='font-size:12px;color:#555'>🔋 " + (station.ebike || 0) + " électriques</div>" +
                "<div style='font-size:11px;color:#888;margin-top:4px'>Gratuit 45min · ~0,17€/min</div>" +
                "</div>"
              );
            inner.addEventListener("click", function() {
              popup.setLngLat([station.coordonnees_geo.lon, station.coordonnees_geo.lat]).addTo(map);
              // Tracer l'itinéraire piéton vers la station
              var userPos = posRef.current;
              if (userPos) {
                fetch("https://api.mapbox.com/directions/v5/mapbox/walking/" +
                  userPos.lng + "," + userPos.lat + ";" +
                  station.coordonnees_geo.lon + "," + station.coordonnees_geo.lat +
                  "?geometries=geojson&access_token=" + MAPBOX_TOKEN)
                .then(function(r) { return r.json(); })
                .then(function(data) {
                  if (!data.routes || !data.routes[0]) return;
                  var geom = data.routes[0].geometry;
                  var duration = Math.ceil(data.routes[0].duration / 60);
                  if (mapboxRef.current.getSource("walking-route")) {
                    mapboxRef.current.getSource("walking-route").setData(geom);
                  } else {
                    mapboxRef.current.addSource("walking-route", { type: "geojson", data: geom });
                    mapboxRef.current.addLayer({ id: "walking-route", type: "line", source: "walking-route",
                      paint: { "line-color": "#0072b9", "line-width": 3, "line-dasharray": [2, 2] }
                    });
                  }
                  popup.setHTML(popup.getElement().querySelector("div").innerHTML +
                    "<div style='font-size:11px;color:#0072b9;margin-top:4px'>🚶 " + duration + " min à pied</div>");
                }).catch(function() {});
              }
            });
          })(s);
          new mapboxgl.Marker({ element: el, anchor: "center" })
            .setLngLat([s.coordonnees_geo.lon, s.coordonnees_geo.lat])
            .addTo(map);
        });
      })
      .catch(function(e) {
 });
    }

    // JCDecaux autres villes
    if (JCDECAUX_KEY && JCDECAUX_KEY !== "COLLE_TA_CLE_JCDECAUX") {
      var cityId2 = detectCity(lat, lng);
      var city2 = cityId2 ? JCDECAUX_CITIES[cityId2] : null;
      if (city2) {
        fetch(
          "https://api.jcdecaux.com/vls/v1/stations?contract=" + city2.contract +
          "&apiKey=" + JCDECAUX_KEY
        )
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (!Array.isArray(data) || !map) return;
          data.filter(function(s) {
            return s.status === "OPEN" && s.available_bikes > 0 &&
              haversine(lat, lng, s.position.lat, s.position.lng) * 1000 < 1000;
          }).slice(0, 8).forEach(function(s) {
            var el = document.createElement("div");
            el.style.cssText = "display:inline-block;";
            var inner = document.createElement("div");
            inner.style.cssText = "background:" + city2.color + ";color:white;padding:3px 7px;border-radius:10px;font-size:10px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;box-shadow:0 1px 6px rgba(0,0,0,.2);white-space:nowrap;";
            inner.textContent = "🚲 " + s.available_bikes;
            el.appendChild(inner);
            new mapboxgl.Marker({ element: el, anchor: "center" })
              .setLngLat([s.position.lng, s.position.lat])
              .addTo(map);
          });
        })
        .catch(function() {});
      }
    }
  }

  // drawRoute — met à jour l'itinéraire sur la carte
  function drawRoute(map, fromLng, fromLat, toLng, toLat) {
    var mapboxgl = window.mapboxgl;
    fetch(
      "https://api.mapbox.com/directions/v5/mapbox/driving-traffic/" +
      fromLng + "," + fromLat + ";" + toLng + "," + toLat +
      "?geometries=geojson&overview=full&access_token=" + MAPBOX_TOKEN
    )
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!data.routes || !data.routes[0]) return;
      var geom = data.routes[0].geometry;
      // Mettre à jour ou créer la source
      if (map.getSource("route")) {
        map.getSource("route").setData({ type: "Feature", geometry: geom });
      } else {
        map.addSource("route", { type: "geojson", data: { type: "Feature", geometry: geom } });
        map.addLayer({ id: "route-bg",   type: "line", source: "route", paint: { "line-color": "#fff",    "line-width": 8,  "line-opacity": .9 } });
        map.addLayer({ id: "route-line", type: "line", source: "route", paint: { "line-color": "#1a1a2e", "line-width": 3.5,"line-opacity": .75 } });
      }
      // Recadrer la carte
      var bounds = new mapboxgl.LngLatBounds();
      geom.coordinates.forEach(function(c) { bounds.extend(c); });
      map.fitBounds(bounds, { padding: 60 });
    })
    .catch(function() {});
  }

  // 2. Init map
  useEffect(function() {
    if (!ready || !mapRef.current || mapboxRef.current) return;
    var mapboxgl = window.mapboxgl;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    var fa0 = props.fromAddr || { lat: 48.8566, lng: 2.3522 };
    var map = new mapboxgl.Map({
      container:   mapRef.current,
      style:       "mapbox://styles/mapbox/light-v11",
      center:      [fa0.lng, fa0.lat],
      zoom:        14,
      interactive: true,
      attributionControl: false,
    });

    map.on("load", function() {
      // Marqueur utilisateur
      var userEl = document.createElement("div");
      userEl.style.cssText = "width:14px;height:14px;border-radius:50%;background:#34d186;border:3px solid white;box-shadow:0 0 0 8px rgba(52,209,134,.15)";
      var userMarker = new mapboxgl.Marker({ element: userEl }).setLngLat([props.fromAddr ? props.fromAddr.lng : 2.3553, props.fromAddr ? props.fromAddr.lat : 48.8809]).addTo(map);
      mapboxRef.userMarker = userMarker;

      // Marqueur destination
      mapboxRef.current = map;

      // Marqueur destination + itinéraire uniquement si destination définie
      if (props.toAddr) {
        var destEl = document.createElement("div");
        destEl.style.cssText = "width:12px;height:12px;border-radius:50%;background:#1a1a2e;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3)";
        var destMarker = new mapboxgl.Marker({ element: destEl }).setLngLat([props.toAddr.lng, props.toAddr.lat]).addTo(map);
        mapboxRef.destMarker = destMarker;
        var fa2 = props.fromAddr || { lat: 48.8809, lng: 2.3553 };
        drawRoute(map, fa2.lng, fa2.lat, props.toAddr.lng, props.toAddr.lat);
      }

      addMarkers(map, "tous");

      // Charger les stations au chargement initial
      // Utiliser posRef pour avoir la position la plus récente
      setTimeout(function() { loadStationMarkers(map, posRef.current, window.mapboxgl); }, 1000);
    });

    return function() {
      if (mapboxRef.current) { mapboxRef.current.remove(); mapboxRef.current = null; }
    };
  }, [ready]);


  // Toujours garder posRef à jour
  useEffect(function() {
    if (props.fromAddr) posRef.current = props.fromAddr;
  }, [props.fromAddr]);

  // Recharger les stations quand la position change
  useEffect(function() {
    if (!props.fromAddr) return;
    // Attendre que la carte soit prête
    var attempts = 0;
    var interval = setInterval(function() {
      attempts++;
      if (mapboxRef.current && window.mapboxgl) {
        loadStationMarkers(mapboxRef.current, props.fromAddr, window.mapboxgl);
        clearInterval(interval);
      }
      if (attempts > 20) clearInterval(interval); // timeout après 10s
    }, 500);
    return function() { clearInterval(interval); };
  }, [props.fromAddr]);

  // Mettre à jour l'itinéraire + marqueurs quand les adresses changent
  useEffect(function() {
    var fa = props.fromAddr || { lat: 48.8809, lng: 2.3553 };
    if (!mapboxRef.current) return;
    if (mapboxRef.userMarker) mapboxRef.userMarker.setLngLat([fa.lng, fa.lat]);
    // Recentrer la carte sur la nouvelle position si pas de destination
    if (!props.toAddr) { mapboxRef.current.flyTo({ center: [fa.lng, fa.lat], zoom: 14, duration: 1000 }); }
    if (props.toAddr) {
      if (mapboxRef.destMarker) {
        mapboxRef.destMarker.setLngLat([props.toAddr.lng, props.toAddr.lat]);
      } else {
        var mapboxgl = window.mapboxgl;
        var dEl = document.createElement("div");
        dEl.style.cssText = "width:12px;height:12px;border-radius:50%;background:#1a1a2e;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3)";
        mapboxRef.destMarker = new mapboxgl.Marker({ element: dEl }).setLngLat([props.toAddr.lng, props.toAddr.lat]).addTo(mapboxRef.current);
      }
      drawRoute(mapboxRef.current, fa.lng, fa.lat, props.toAddr.lng, props.toAddr.lat);
    }
    // Repositionner les véhicules autour du nouveau départ
    addMarkers(mapboxRef.current, filter);
  }, [props.fromAddr, props.toAddr]);

  // Update markers when filter changes
  useEffect(function() {
    if (!mapboxRef.current) return;
    addMarkers(mapboxRef.current, filter);
  }, [filter]);

  // Rafraîchir les marqueurs quand les vraies données GBFS arrivent
  useEffect(function() {
    if (!mapboxRef.current) return;
    addMarkers(mapboxRef.current, filter);
  }, [gbfs.vehicles]);



  var selVtc = selected && PLATFORMS[selected] ? { id: selected, ...PLATFORMS[selected], price: calcVtcPrice(selected, km, 14), eta: [3,4,6,8][Object.keys(PLATFORMS).indexOf(selected)] } : null;
  var selSc  = selected && SCOOTERS[selected]  ? { id: selected, ...SCOOTERS[selected] } : null;

  var filters = [["tous","Tous"],["vtc","Véhicules"],["scooter","Trottinettes"],["bike","Vélos libres"],["station","Vélos en station"]];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Barre de recherche */}
      <div style={{ background: T.card, padding: "10px 14px", borderBottom: "1px solid " + T.border }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.input, borderRadius: 12, padding: "9px 14px", fontSize: 13, fontFamily: "'DM Sans',sans-serif", color: T.text }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d186", display: "inline-block", flexShrink: 0 }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120 }}>{(props.fromAddr || {label:'Gare du Nord'}).label}</span>
          <span style={{ flex: 1, borderBottom: "1.5px dashed " + T.border, margin: "0 4px" }} />
          <span style={{ width: 8, height: 8, background: T.accent, borderRadius: "50%", display: "inline-block", flexShrink: 0 }} />
          <span style={{ color: T.sub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120 }}>{props.toAddr ? props.toAddr.label : 'Où allez-vous ?'}</span>
        </div>
      </div>

      {/* Carte */}
      <div style={{ position: "relative", flex: "0 0 310px" }}>

        {/* Pas de token */}
        {noToken && (
          <div style={{ position: "absolute", inset: 0, background: T.input, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, gap: 12, textAlign: "center" }}>
            <div style={{ fontSize: 32 }}>🗝️</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>Token Mapbox manquant</div>
            <div style={{ fontSize: 12, color: T.sub, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6, maxWidth: 240 }}>
              1. Crée un compte gratuit sur <strong>mapbox.com</strong><br/>
              2. Copie ton token (commence par <strong>pk.</strong>)<br/>
              3. Remplace <strong>COLLE_TON_TOKEN_ICI</strong> dans le code
            </div>
            <a href="https://mapbox.com" target="_blank" style={{ background: T.accent, color: "#fff", padding: "9px 18px", borderRadius: 10, fontSize: 12, fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>
              Créer un compte Mapbox →
            </a>
          </div>
        )}

        {!ready && !noToken && (
          <div style={{ position: "absolute", inset: 0, background: T.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: T.muted, fontFamily: "'DM Sans',sans-serif", zIndex: 5 }}>
            Chargement de la carte…
          </div>
        )}

        <div ref={mapRef} style={{ width: "100%", height: "310px" }} onClick={function() { setSelected(null); }} />

        {/* Filtres */}
        <div style={{ position: "absolute", bottom: 10, left: 10, display: "flex", gap: 6, zIndex: 10 }}>
          {filters.map(function(f) {
            return (
              <button
                key={f[0]}
                onClick={function() { setFilter(f[0]); }}
                style={{ background: filter === f[0] ? "#1a1a2e" : "rgba(255,255,255,.95)", color: filter === f[0] ? "#fff" : "#555", border: "none", borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,.12)" }}
              >{f[1]}</button>
            );
          })}
        </div>

        {/* Popup véhicule sélectionné */}
        {selected && (selVtc || selSc) && (
          <div style={{ position: "absolute", top: 54, left: "50%", transform: "translateX(-50%)", background: T.card, borderRadius: 16, padding: "14px 16px", boxShadow: "0 8px 30px rgba(0,0,0,.14)", minWidth: 230, zIndex: 20, border: "1px solid " + T.border }}>
            <button onClick={function() { setSelected(null); }} style={{ position: "absolute", top: 8, right: 10, background: "none", border: "none", fontSize: 18, color: T.muted, cursor: "pointer", lineHeight: 1, padding: "0 4px" }}>×</button>
            {selVtc && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <Logo short={selVtc.short} color={selVtc.color} tc={selVtc.tc} size={34} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{selVtc.name}</div>
                    <div style={{ fontSize: 11, color: T.sub, fontFamily: "'DM Sans',sans-serif" }}>⏱ {selVtc.eta} min · 4 passagers</div>
                  </div>
                  <div style={{ marginLeft: "auto", fontSize: 18, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{selVtc.price.toFixed(2)} €</div>
                </div>
                <button
                  onClick={function() { props.onVehicle(selVtc); setSelected(null); }}
                  style={{ width: "100%", background: T.accent, color: "#fff", border: "none", borderRadius: 10, padding: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                >Voir les détails →</button>
              </div>
            )}
            {selSc && (function() {
              var operatorKey = selected.indexOf("lime") === 0 ? "lime" : selected;
              var realData = gbfs.vehicles[operatorKey];
              var realMatch = realData ? realData.filter(function(v) { return selSc.type === "bike" ? v.isBike : !v.isBike; })[0] : null;
              return (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <Logo short={selSc.short} color={selSc.color} tc={selSc.tc} size={34} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{selSc.name} — {selSc.label}</div>
                    <div style={{ fontSize: 11, color: T.sub, fontFamily: "'DM Sans',sans-serif" }}>
                      {realMatch && (realMatch.dist + " m" + (realMatch.bat !== null ? " · 🔋 " + Math.round(realMatch.bat) + "%" : ""))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={function() { openScApp(operatorKey, realMatch ? realMatch.rentalUris : null); }}
                  style={{ width: "100%", background: selSc.color, color: "#fff", border: "none", borderRadius: 10, padding: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  Ouvrir {selSc.name} →
                </button>
              </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Liste véhicules en bas */}
      <div style={{ background: T.card, borderTop: "1px solid " + T.border, flex: 1, overflowY: "auto" }}>
        <div style={{ padding: "10px 14px 6px", fontSize: 10, color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: .8, fontFamily: "'DM Sans',sans-serif" }}>
          Véhicules à proximité
        </div>
        <div style={{ display: "flex", gap: 8, padding: "0 12px 14px", overflowX: "auto" }}>
          {Object.keys(PLATFORMS).filter(function() { return filter === "tous" || filter === "vtc"; }).map(function(id, i) {
            var p = PLATFORMS[id];
            var pr = calcVtcPrice(id, km, 14);
            return (
              <div key={id} style={{ flexShrink: 0, width: 110, background: i === 0 ? T.card : T.input, border: i === 0 ? "1.5px solid " + T.accent : "1px solid " + T.border, borderRadius: 14, padding: "10px 11px", cursor: "pointer" }}
                onClick={function() { setSelected(id); }}>
                <Logo short={p.short} color={p.color} tc={p.tc} size={28} />
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginTop: 6, fontFamily: "'DM Sans',sans-serif" }}>{p.name}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>{pr.toFixed(2)} €</div>
                <div style={{ fontSize: 10, color: T.muted, marginTop: 1, fontFamily: "'DM Sans',sans-serif" }}>⏱ {[3,4,6,8][i]} min</div>
              </div>
            );
          })}
          {(filter === "tous" || filter === "station") && mapStations.slice(0, 3).map(function(st) {
            return (
              <div key={"vb_" + st.id} style={{ flexShrink: 0, width: 110, background: T.input, border: "1px solid " + T.border, borderRadius: 14, padding: "10px 11px" }}>
                <Logo short="Vb" color="#0072b9" tc="#fff" size={28} />
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginTop: 6, fontFamily: "'DM Sans',sans-serif" }}>Vélib'</div>
                <div style={{ fontSize: 9, color: T.muted, fontFamily: "'DM Sans',sans-serif", marginBottom: 2 }}>{st.name.length > 18 ? st.name.slice(0,18)+"…" : st.name}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#0072b9", fontFamily: "'DM Sans',sans-serif" }}>🚲 {st.total} vélos</div>
                <div style={{ fontSize: 9, color: T.muted, fontFamily: "'DM Sans',sans-serif" }}>Gratuit 45min</div>
              </div>
            );
          })}
          {(function() {
            // Construit la liste réelle : un véhicule par opérateur trouvé via le proxy GBFS, le plus proche
            var realScooters = [];
            Object.keys(gbfs.vehicles).forEach(function(operatorKey) {
              var byType = { scooter: null, bike: null };
              gbfs.vehicles[operatorKey].forEach(function(veh) {
                var t = veh.isBike ? "bike" : "scooter";
                if (!byType[t]) byType[t] = veh;
              });
              ["scooter", "bike"].forEach(function(t) {
                var veh = byType[t];
                if (!veh) return;
                var scId = operatorKey === "lime" ? (t === "bike" ? "lime_bk" : "lime_sc") : operatorKey;
                var s = SCOOTERS[scId];
                if (!s) return;
                if (filter !== "tous" && filter !== s.type) return;
                realScooters.push({ scId: scId, s: s, veh: veh });
              });
            });
            return realScooters.map(function(item) {
              var s = item.s, veh = item.veh;
              return (
                <div key={item.scId} style={{ flexShrink: 0, width: 110, background: T.input, border: "1px solid " + T.border, borderRadius: 14, padding: "10px 11px", cursor: "pointer" }}
                  onClick={function() { setSelected(item.scId); }}>
                  <Logo short={s.short} color={s.color} tc={s.tc} size={28} />
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginTop: 6, fontFamily: "'DM Sans',sans-serif" }}>{s.name}</div>
                  <div style={{ fontSize: 9, color: T.muted, fontFamily: "'DM Sans',sans-serif" }}>{s.label}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>{s.unlock > 0 ? s.unlock + "€+" + s.pMin + "€/min" : s.pMin + "€/min"}</div>
                  <div style={{ fontSize: 10, color: T.muted, marginTop: 3, fontFamily: "'DM Sans',sans-serif" }}>🚶 {veh.dist} m</div>
                  {veh.bat !== null && (
                    <div style={{ marginTop: 5 }}>
                      <div style={{ width: "100%", height: 4, background: T.border, borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: Math.round(veh.bat) + "%", height: "100%", background: s.color }} />
                      </div>
                      <div style={{ fontSize: 9, color: T.muted, marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>🔋 {Math.round(veh.bat)}%</div>
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}

// ── Detail modal ───────────────────────────────────────────────────────────
// ── Deep links micro-mobilité (Lime, Dott, Bird, Voi) ───────────────────────
// Liens de secours vers le site web si l'app n'est pas installée ou si le véhicule n'a pas de rental_uris
// ── Deep links Scooters partagés (Yego) ─────────────────────────────────────
function openMopedApp(mopedId) {
  var links = {
    yego:      { ios: "yego://",       web: "https://www.yego.co/" },
    cityscoot: { ios: "cityscoot://",  web: "https://www.cityscoot.eu/" },
  };
  var l = links[mopedId];
  if (!l) return;
  window.location.href = l.ios;
  setTimeout(function() { window.open(l.web, "_blank"); }, 1500);
}

var SC_WEB_FALLBACK = {
  lime: "https://www.li.me/",
  dott: "https://ridedott.com/",
  bird: "https://www.bird.co/fr/",
  voi:  "https://www.voiscooters.com/",
};

function openScApp(operatorKey, rentalUris) {
  var isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  var deepLink = rentalUris ? (isIOS ? rentalUris.ios : rentalUris.android) : null;
  var webFallback = SC_WEB_FALLBACK[operatorKey] || "https://www.google.com/search?q=" + operatorKey;

  if (deepLink) {
    window.location.href = deepLink;
    setTimeout(function() { window.open(webFallback, "_blank"); }, 1500);
  } else {
    window.open(webFallback, "_blank");
  }
}

// ── Deep links VTC ───────────────────────────────────────────────────────
function openVtcApp(platformId, fromAddr, toAddr) {
  if (!fromAddr || !toAddr) return;
  var pLat = fromAddr.lat, pLng = fromAddr.lng;
  var dLat = toAddr.lat,   dLng = toAddr.lng;
  var pName = encodeURIComponent(fromAddr.label || fromAddr.name || "Ma position");
  var dName = encodeURIComponent(toAddr.label || toAddr.name || "Destination");

  var deepLinks = {
    uber: {
      app: "uber://?action=setPickup" +
           "&pickup[latitude]=" + pLat + "&pickup[longitude]=" + pLng +
           "&pickup[nickname]=" + pName +
           "&dropoff[latitude]=" + dLat + "&dropoff[longitude]=" + dLng +
           "&dropoff[nickname]=" + dName,
      web: "https://m.uber.com/ul/?action=setPickup" +
           "&pickup[latitude]=" + pLat + "&pickup[longitude]=" + pLng +
           "&dropoff[latitude]=" + dLat + "&dropoff[longitude]=" + dLng,
    },
    bolt: {
      app: "bolt://ride?pickup_latitude=" + pLat + "&pickup_longitude=" + pLng +
           "&destination_latitude=" + dLat + "&destination_longitude=" + dLng,
      web: "https://bolt.eu/en/cities/",
    },
    heetch: {
      app: "heetch://request?pickup_lat=" + pLat + "&pickup_lng=" + pLng +
           "&dropoff_lat=" + dLat + "&dropoff_lng=" + dLng,
      web: "https://www.heetch.com/",
    },
    marcel: {
      app: null, // pas de deep link public documenté
      web: "https://www.marcel.cab/",
    },
  };

  var links = deepLinks[platformId];
  if (!links) return;

  if (links.app) {
    // Tente d'ouvrir l'app native
    window.location.href = links.app;
    // Fallback vers le web après un court délai si l'app n'est pas installée
    setTimeout(function() {
      window.open(links.web, "_blank");
    }, 1500);
  } else {
    window.open(links.web, "_blank");
  }
}

function Detail(props) {
  var v = props.v;
  var T = props.T;
  var hasRoute = !!(props.fromAddr && props.toAddr);
  var km = hasRoute ? Math.max(0.5, haversine(props.fromAddr.lat, props.fromAddr.lng, props.toAddr.lat, props.toAddr.lng) * 1.35) : 0;
  var mins = hasRoute ? Math.round(km / 0.38) : 0;
  var allPrices = Object.keys(PLATFORMS).map(function(id) {
    return { id: id, name: PLATFORMS[id].name, price: calcVtcPrice(id, km, mins) };
  }).sort(function(a, b) { return a.price - b.price; });
  var maxP = Math.max.apply(null, allPrices.map(function(p) { return p.price; }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 200, display: "flex", alignItems: "flex-end" }} onClick={props.onClose}>
      <div style={{ background: T.card, borderRadius: "20px 20px 0 0", width: "100%", maxHeight: "88vh", overflowY: "auto", paddingBottom: 24 }} onClick={function(e) { e.stopPropagation(); }}>
        <div style={{ width: 36, height: 3, background: T.border, borderRadius: 2, margin: "12px auto 0" }} />
        <div style={{ padding: "14px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <Logo short={v.short} color={v.color} tc={v.tc} size={46} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{v.name} — Standard</div>
              <div style={{ fontSize: 12, color: T.sub, fontFamily: "'DM Sans',sans-serif" }}>4 passagers · Berline</div>
            </div>
            {hasRoute && (
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{calcVtcPrice(v.id, km, mins).toFixed(2)} €</div>
                <div style={{ fontSize: 11, color: T.muted, fontFamily: "'DM Sans',sans-serif" }}>prix estimé</div>
              </div>
            )}
          </div>

          {hasRoute && <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
            {[["⏱", v.eta + " min", "Arrivée"], ["🗺", formatDuration(mins), "Trajet"], ["📍", km.toFixed(1) + " km", "Distance"]].map(function(item) {
              return (
                <div key={item[2]} style={{ background: T.input, borderRadius: 10, padding: "9px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{item[0]} {item[1]}</div>
                  <div style={{ fontSize: 10, color: T.sub, marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>{item[2]}</div>
                </div>
              );
            })}
          </div>}

          {hasRoute && <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>Comparaison des prix</div>
            <div style={{ background: T.input, borderRadius: 12, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
              {allPrices.map(function(p) {
                return (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 52, fontSize: 11, fontWeight: p.id === v.id ? 700 : 400, color: p.id === v.id ? T.text : T.sub, fontFamily: "'DM Sans',sans-serif" }}>{p.name}</div>
                    <div style={{ flex: 1, height: 7, background: T.border, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: (p.price / maxP * 100) + "%", height: "100%", background: p.id === v.id ? v.color : T.muted, borderRadius: 4 }} />
                    </div>
                    <div style={{ width: 42, textAlign: "right", fontSize: 11, fontWeight: p.id === v.id ? 700 : 400, color: p.id === v.id ? T.text : T.sub, fontFamily: "'DM Sans',sans-serif" }}>{p.price.toFixed(2)} €</div>
                  </div>
                );
              })}
            </div>
          </div>}

          <button
            onClick={function() { openVtcApp(v.id, props.fromAddr, props.toAddr); }}
            disabled={!props.toAddr}
            style={{ width: "100%", background: props.toAddr ? T.accent : T.border, color: "#fff", border: "none", borderRadius: 14, padding: 15, fontSize: 15, fontWeight: 700, cursor: props.toAddr ? "pointer" : "not-allowed", fontFamily: "'DM Sans',sans-serif", marginBottom: 10, opacity: props.toAddr ? 1 : 0.5 }}
          >
            {props.toAddr ? "Réserver sur " + v.name + " ↗" : "Saisis une destination pour réserver"}
          </button>
          <button onClick={props.onClose} style={{ width: "100%", background: "transparent", color: T.sub, border: "1px solid " + T.border, borderRadius: 14, padding: 12, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
            ← Retour
          </button>
        </div>
      </div>
    </div>
  );
}

// ── History ────────────────────────────────────────────────────────────────
function History(props) {
  var T = props.T;
  var maxVal = Math.max.apply(null, MONTHLY.map(function(m) { return m.val; }));
  return (
    <div style={{ flex: 1, overflowY: "auto", background: T.bg }}>
      <div style={{ background: T.card, padding: "18px 16px 14px", borderBottom: "1px solid " + T.border }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif", letterSpacing: -0.5 }}>Historique</div>
        <div style={{ fontSize: 12, color: T.sub, marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>Tous tes trajets en un coup d'œil</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, padding: "12px 12px 0" }}>
        {[["47", "Trajets ce mois", "+12%"], ["83,40 €", "Dépenses", "−8%"], ["34,60 €", "Économies", "grâce à Mobio"], ["2,1 kg", "CO2 évité", "vs essence"]].map(function(item) {
          return (
            <div key={item[1]} style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 12, padding: "11px 12px" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{item[0]}</div>
              <div style={{ fontSize: 11, color: T.sub, marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>{item[1]}</div>
              <div style={{ fontSize: 10, color: "#34d186", marginTop: 3, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>{item[2]}</div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: "12px 12px 4px" }}>
        <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 12, padding: "12px 12px 16px", display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
          {MONTHLY.map(function(m) {
            return (
              <div key={m.mo} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                  <div style={{ width: "100%", height: (m.val / maxVal * 100) + "%", background: m.mo === "Mai" ? T.accent : T.border, borderRadius: "4px 4px 0 0", minHeight: 4 }} />
                </div>
                <div style={{ fontSize: 9, color: m.mo === "Mai" ? T.text : T.muted, fontWeight: m.mo === "Mai" ? 700 : 400, fontFamily: "'DM Sans',sans-serif" }}>{m.mo}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding: "8px 12px" }}>
        {HISTORY_DATA.map(function(h) {
          var p = h.sc ? SCOOTERS[h.plId] : PLATFORMS[h.plId];
          return (
            <div key={h.id} style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, padding: "11px 13px", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Logo short={p.short} color={p.color} tc={p.tc} size={30} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{p.name}{h.sc ? " — " + p.type : " — Standard"}</div>
                  <div style={{ fontSize: 10, color: T.sub, fontFamily: "'DM Sans',sans-serif" }}>{h.date} · {h.dur} min</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{h.price.toFixed(2)} €</div>
              </div>
              <div style={{ display: "flex", gap: 5, alignItems: "center", fontSize: 11, color: T.sub, fontFamily: "'DM Sans',sans-serif" }}>
                <span style={{ color: p.color }}>●</span>{h.from}<span style={{ color: T.muted }}>→</span>▲{h.to}
              </div>
              <div style={{ marginTop: 7, display: "flex", gap: 5 }}>
                {h.saved && <span style={{ fontSize: 9, fontWeight: 700, background: "#e1f5ee", color: "#085041", padding: "2px 7px", borderRadius: 4, fontFamily: "'DM Sans',sans-serif" }}>{h.saved.toFixed(2)} € économisés</span>}
                {h.eco && <span style={{ fontSize: 9, fontWeight: 700, background: "#e1f5ee", color: "#085041", padding: "2px 7px", borderRadius: 4, fontFamily: "'DM Sans',sans-serif" }}>Électrique</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Profile ────────────────────────────────────────────────────────────────
function Profile(props) {
  var T = props.T;
  var [eco,        setEco]        = useState(true);
  var [alertS,     setAlertS]     = useState(true);
  var [alertSc,    setAlertSc]    = useState(true);
  var [alertW,     setAlertW]     = useState(false);
  var [showAbout,  setShowAbout]  = useState(false);
  var [legalModal, setLegalModal] = useState(null); // 'cgu' | 'privacy' | 'cookies'
  var connected = ["uber", "bolt", "lime"];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: T.bg }}>

      {/* Header sombre */}
      <div style={{ background: "#1a1a2e", padding: "18px 16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,.15)", border: "2px solid rgba(255,255,255,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>TM</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>Thomas Martin</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)", fontFamily: "'DM Sans',sans-serif" }}>thomas@gmail.com</div>
          </div>
          <div style={{ marginLeft: "auto", background: "rgba(52,209,134,.2)", border: "1px solid rgba(52,209,134,.4)", color: "#34d186", fontSize: 10, fontWeight: 700, padding: "4px 11px", borderRadius: 20, fontFamily: "'DM Sans',sans-serif" }}>Pro</div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {[["47","Trajets"],["34,60 €","Économisés"],["2,1 kg","CO2"]].map(function(item) {
            return (
              <div key={item[1]} style={{ flex: 1, background: "rgba(255,255,255,.08)", borderRadius: 10, padding: 8, textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>{item[0]}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,.45)", marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>{item[1]}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "12px 12px 0" }}>

        {/* Adresses favorites */}
        <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>Adresses favorites</div>
        <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
          {props.favs.map(function(f) {
            return (
              <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", borderBottom: "1px solid " + T.bsub }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: T.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{f.icon}</div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{f.label}</div>
                  <div style={{ fontSize: 11, color: T.muted, fontFamily: "'DM Sans',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.addr || "Non défini"}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={function() { props.onFav(f, "edit"); }} style={{ background: T.input, border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 11, cursor: "pointer" }}>✏️</button>
                  {f.id !== "home" && f.id !== "work" && (
                    <button onClick={function() { props.onRemoveFav(f.id); }} style={{ background: "#fff0f0", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 11, cursor: "pointer", color: "#c0392b" }}>🗑</button>
                  )}
                </div>
              </div>
            );
          })}
          <div onClick={function() { props.onFav(null, "new"); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", cursor: "pointer" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: T.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>+</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.sub, fontFamily: "'DM Sans',sans-serif" }}>Ajouter un favori</div>
          </div>
        </div>

        {/* Plateformes */}
        <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>Plateformes</div>
        {[
          { label: "🚗 VTC", ids: Object.keys(PLATFORMS) },
          { label: "🛵 Scooters", ids: Object.keys(MOPEDS) },
          { label: "🛴 Micro-mobilité", ids: Object.keys(SCOOTERS).filter(function(id) { return id !== "velib"; }) },
        ].map(function(group) {
          // Dédupliquer par nom
          var seen = {};
          var uniqueIds = group.ids.filter(function(id) {
            var p = PLATFORMS[id] || MOPEDS[id] || SCOOTERS[id];
            if (!p || seen[p.name]) return false;
            seen[p.name] = true;
            return true;
          });
          return (
            <div key={group.label} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: T.sub, fontWeight: 700, marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>{group.label}</div>
              <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, overflow: "hidden" }}>
                {uniqueIds.map(function(id, i, arr) {
                  var p = PLATFORMS[id] || MOPEDS[id] || SCOOTERS[id];
                  return (
                    <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", borderBottom: i < arr.length - 1 ? "1px solid " + T.bsub : "none" }}>
                      <Logo short={p.short} color={p.color} tc={p.tc} size={30} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{p.name}</div>
                        <div style={{ fontSize: 10, color: T.muted, fontFamily: "'DM Sans',sans-serif" }}>{p.label || "Application mobile"}</div>
                      </div>
                      <button onClick={function() { if (p.appUrl) window.open(p.appUrl, "_blank"); }}
                        style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 6, fontFamily: "'DM Sans',sans-serif", background: T.input, color: T.accent, border: "1px solid " + T.accent, cursor: "pointer" }}>
                        Disponible ↗
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Notifications */}
        <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>Notifications</div>
        <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, padding: "12px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: T.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🔔</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>Tester une notification</div>
            <div style={{ fontSize: 11, color: T.muted, fontFamily: "'DM Sans',sans-serif" }}>Voir à quoi ça ressemble</div>
          </div>
          <button onClick={props.onTestNotif} style={{ background: T.accent, color: "#fff", border: "none", borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Tester</button>
        </div>

        {/* Préférences */}
        <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>Préférences</div>
        <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
          {[
            ["🌙", "Mode sombre",  "Thème nuit",                          props.dark, function() { props.setDark(!props.dark); }],
            ["🌿", "Mode éco",     "Véhicules électriques en priorité",   eco,        function() { setEco(!eco); }],
            ["🔔", "Alertes prix dynamiques","Hausse de prix détectée",               alertS,     function() { setAlertS(!alertS); }],
            ["🛴", "Trottinette proche", "Lime dispo < 100m",            alertSc,    function() { setAlertSc(!alertSc); }],
            ["📊", "Résumé hebdo", "Chaque lundi matin",                  alertW,     function() { setAlertW(!alertW); }],
          ].map(function(item, i, arr) {
            return (
              <div key={item[1]} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", borderBottom: i < arr.length - 1 ? "1px solid " + T.bsub : "none" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: T.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{item[0]}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{item[1]}</div>
                  <div style={{ fontSize: 10, color: T.muted, fontFamily: "'DM Sans',sans-serif" }}>{item[2]}</div>
                </div>
                <div style={{ marginLeft: "auto" }}><Toggle on={item[3]} toggle={item[4]} /></div>
              </div>
            );
          })}
        </div>

        {/* À propos */}
        <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>À propos</div>
        <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
          {[
            ["ℹ️", "À propos de Mobio", "Version 1.0.0 (beta)", function() { setShowAbout(true); }],
            ["📧", "Nous contacter",    "ugo.azoulay@gmail.com",    function() { window.location.href = "mailto:ugo.azoulay@gmail.com"; }],
            ["⭐", "Noter l'app",       "Laisser un avis",      null],
            ["🔗", "Partager Mobio",    "Envoyer à un ami",     function() { if(navigator.share){ navigator.share({title:"Mobio",text:"Compare tous les VTC en un clin d'œil",url:window.location.href}); } }],
          ].map(function(item, i, arr) {
            return (
              <div key={item[1]} onClick={item[3] || undefined} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", borderBottom: i < arr.length - 1 ? "1px solid " + T.bsub : "none", cursor: "pointer" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: T.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{item[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{item[1]}</div>
                  <div style={{ fontSize: 10, color: T.muted, fontFamily: "'DM Sans',sans-serif" }}>{item[2]}</div>
                </div>
                <div style={{ color: T.muted, fontSize: 16 }}>{"›"}</div>
              </div>
            );
          })}
        </div>

        {/* Légal */}
        <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>Légal</div>
        <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, overflow: "hidden", marginBottom: 28 }}>
          {[["📋","Conditions d'utilisation","cgu"],["🔒","Politique de confidentialité","privacy"],["🍪","Gestion des cookies","cookies"]].map(function(item, i, arr) {
            return (
              <div key={item[1]} onClick={function() { setLegalModal(item[2]); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", borderBottom: i < arr.length - 1 ? "1px solid " + T.bsub : "none", cursor: "pointer" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: T.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{item[0]}</div>
                <div style={{ flex: 1, fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{item[1]}</div>
                <div style={{ color: T.muted, fontSize: 16 }}>{"›"}</div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Modal Légal */}
      {legalModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 400, display: "flex", alignItems: "flex-end" }} onClick={function() { setLegalModal(null); }}>
          <div style={{ background: T.card, borderRadius: "20px 20px 0 0", width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column" }} onClick={function(e) { e.stopPropagation(); }}>
            <div style={{ padding: "16px 20px 0", flexShrink: 0 }}>
              <div style={{ width: 36, height: 3, background: T.border, borderRadius: 2, margin: "0 auto 16px" }} />
              <div style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif", marginBottom: 8 }}>
                {legalModal === "cgu" ? "Conditions d'utilisation" : legalModal === "privacy" ? "Politique de confidentialité" : "Gestion des cookies"}
              </div>
              {(legalModal === "cgu" || legalModal === "privacy") && (
                <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 10, padding: "8px 12px", marginBottom: 12, fontSize: 11, color: "#854f0b", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5 }}>
                  
                </div>
              )}
            </div>
            <div style={{ overflowY: "auto", padding: "0 20px 20px", flex: 1 }}>
              {(legalModal === "cgu" ? CGU_TEXT : legalModal === "privacy" ? PRIVACY_TEXT : [{title:"Cookies techniques",content:"Ces cookies sont indispensables au fonctionnement de l'application. Ils ne peuvent pas être désactivés."},{title:"Cookies analytiques",content:"Ces cookies nous permettent de mesurer l'audience de l'application de façon anonyme. Vous pouvez les désactiver ci-dessous."},{title:"Vos choix",content:"Vous pouvez modifier vos préférences à tout moment depuis cette page. Le refus des cookies analytiques n'affecte pas votre utilisation de Mobio."}]).map(function(section, i) {
                return (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif", marginBottom: 6 }}>{section.title}</div>
                    <div style={{ fontSize: 12, color: T.sub, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6 }}>{section.content}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "12px 20px 32px", flexShrink: 0 }}>
              <button onClick={function() { setLegalModal(null); }} style={{ width: "100%", background: T.accent, color: "#fff", border: "none", borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal À propos */}
      {showAbout && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 400, display: "flex", alignItems: "flex-end" }} onClick={function() { setShowAbout(false); }}>
          <div style={{ background: T.card, borderRadius: "20px 20px 0 0", width: "100%", padding: "16px 20px 40px" }} onClick={function(e) { e.stopPropagation(); }}>
            <div style={{ width: 36, height: 3, background: T.border, borderRadius: 2, margin: "0 auto 20px" }} />
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <img src={ENHAX_LOGO} alt="Enhax" style={{ height: 36, marginBottom: 10, opacity: 0.85 }} />
              <div style={{ fontSize: 48, marginBottom: 10 }}>{"🚗"}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif", letterSpacing: -0.5 }}>Mobio</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 4, fontFamily: "'DM Sans',sans-serif" }}>Version 1.0.0 (beta)</div>
            </div>
            <div style={{ background: T.input, borderRadius: 12, padding: "14px 16px", marginBottom: 14, fontSize: 13, color: T.sub, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6 }}>
              {"Mobio compare en temps réel tous les VTC et services de micro-mobilité — Uber, Bolt, Heetch, Lime, Tier et plus. Trouvez le meilleur prix en un coup d'œil, sans jongler entre plusieurs applications."}
            </div>
            <div style={{ background: T.input, borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
              {[["🚀","Fondé en","2025"],["📧","Contact","ugo.azoulay@gmail.com"],["🌍","Site web","mobio.app"]].map(function(item, i, arr) {
                return (
                  <div key={item[1]} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: i < arr.length - 1 ? "1px solid " + T.bsub : "none" }}>
                    <span style={{ fontSize: 16 }}>{item[0]}</span>
                    <span style={{ fontSize: 12, color: T.sub, fontFamily: "'DM Sans',sans-serif" }}>{item[1]}</span>
                    <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{item[2]}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: T.muted, textAlign: "center", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5, marginBottom: 14 }}>
              {"© 2025 Mobio. Tous droits réservés. Non affilié à Uber, Bolt, Heetch, Lime ou Tier."}
            </div>
            <button onClick={function() { setShowAbout(false); }} style={{ width: "100%", background: T.accent, color: "#fff", border: "none", borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Fermer</button>
          </div>
        </div>
      )}

    </div>
  );
}

// ── Favori modal ───────────────────────────────────────────────────────────
function FavModal(props) {
  var T = props.T;
  var fav = props.fav;
  var isDef = fav && (fav.id === "home" || fav.id === "work");
  var [lbl, setLbl] = useState(!isDef && fav ? fav.label : "");
  var [ico, setIco] = useState(!isDef && fav ? fav.icon : "📍");
  var [sel, setSel] = useState(fav && fav.addr ? { label: fav.addr, lat: fav.lat, lng: fav.lng } : null);
  var ICONS = ["📍", "⭐", "🏋️", "🛒", "👨‍👩‍👧", "🏥", "🎓", "❤️", "🍽️", "🎭", "🏖️", "🏢", "🎵", "🐶", "🏪", "✈️"];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 300, display: "flex", alignItems: "flex-end" }} onClick={props.onClose}>
      <div style={{ background: T.card, borderRadius: "20px 20px 0 0", width: "100%", padding: "16px 16px 36px", maxHeight: "85vh", overflowY: "auto" }} onClick={function(e) { e.stopPropagation(); }}>
        <div style={{ width: 36, height: 3, background: T.border, borderRadius: 2, margin: "0 auto 16px" }} />
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif", marginBottom: 16 }}>
          {isDef ? fav.icon + " " + fav.label : "Nouveau favori"}
        </div>
        {!isDef && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: .6, fontFamily: "'DM Sans',sans-serif", marginBottom: 6 }}>Nom</div>
            <input
              value={lbl}
              onChange={function(e) { setLbl(e.target.value); }}
              placeholder="ex: Salle de sport, Parents…"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid " + T.border, background: T.input, color: T.text, fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box", marginBottom: 10 }}
            />
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: .6, fontFamily: "'DM Sans',sans-serif", marginBottom: 8 }}>Icône</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 6 }}>
              {ICONS.map(function(e) {
                return (
                  <div key={e} onClick={function() { setIco(e); }} style={{ fontSize: 22, textAlign: "center", padding: "7px 4px", borderRadius: 10, cursor: "pointer", background: ico === e ? T.accent : T.input, border: ico === e ? "2px solid " + T.accent : "2px solid transparent" }}>
                    {e}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div style={{ fontSize: 11, color: T.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: .6, fontFamily: "'DM Sans',sans-serif", marginBottom: 6 }}>Adresse</div>
        <AddrInput value={sel ? sel.label : ""} dot={fav && fav.id === "home" ? "#34d186" : fav && fav.id === "work" ? "#1B5EF7" : "#888"} ph="Recherche une adresse…" onSelect={function(s) { setSel(s); }} T={T} />
        <button
          onClick={function() {
            if (sel) {
              props.onSave(sel, isDef ? null : { label: lbl || "Favori", icon: ico });
              props.onClose();
            }
          }}
          disabled={!sel}
          style={{ width: "100%", marginTop: 16, background: sel ? T.accent : "#ccc", color: "#fff", border: "none", borderRadius: 14, padding: 14, fontSize: 14, fontWeight: 700, cursor: sel ? "pointer" : "default", fontFamily: "'DM Sans',sans-serif" }}
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
}


// ── Toast notification ─────────────────────────────────────────────────────
function Toast(props) {
  var T = props.T;
  useEffect(function() {
    var timer = setTimeout(function() { props.onClose(); }, 4000);
    return function() { clearTimeout(timer); };
  }, []);
  return (
    <div style={{
      position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)",
      zIndex: 999, width: "calc(100% - 32px)", maxWidth: 358,
      background: T.card, borderRadius: 16,
      boxShadow: "0 8px 32px rgba(0,0,0,.18)",
      border: "1px solid " + T.border,
      padding: "12px 14px",
      display: "flex", alignItems: "flex-start", gap: 10,
      animation: "slideDown .3s ease",
    }}>
      <style>{"@keyframes slideDown{from{opacity:0;transform:translateX(-50%) translateY(-12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}"}</style>
      <div style={{ fontSize: 22, flexShrink: 0 }}>{props.notif.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{props.notif.title}</div>
        <div style={{ fontSize: 12, color: T.sub, marginTop: 2, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.4 }}>{props.notif.body}</div>
      </div>
      <button onClick={props.onClose} style={{ background: "none", border: "none", color: T.muted, fontSize: 18, cursor: "pointer", flexShrink: 0, lineHeight: 1 }}>×</button>
    </div>
  );
}

// ── Notification center panel ──────────────────────────────────────────────
function NotifPanel(props) {
  var T = props.T;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", flexDirection: "column" }} onClick={props.onClose}>
      <div style={{ flex: 1, background: "rgba(0,0,0,.4)" }} />
      <div
        style={{ background: T.card, borderRadius: "20px 20px 0 0", maxHeight: "75vh", overflowY: "auto", paddingBottom: 32 }}
        onClick={function(e) { e.stopPropagation(); }}
      >
        <div style={{ width: 36, height: 3, background: T.border, borderRadius: 2, margin: "12px auto 0" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 10px" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>Notifications</div>
          <button
            onClick={props.onMarkAll}
            style={{ background: "none", border: "none", fontSize: 12, color: T.accent, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}
          >Tout marquer lu</button>
        </div>
        {props.notifs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: T.muted, fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔕</div>
            Aucune notification
          </div>
        ) : (
          props.notifs.map(function(n, i) {
            return (
              <div
                key={n.id}
                onClick={function() { props.onRead(n.id); }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "12px 16px",
                  borderBottom: i < props.notifs.length - 1 ? "1px solid " + T.bsub : "none",
                  background: n.read ? "transparent" : (props.dark ? "rgba(99,102,241,.08)" : "rgba(26,26,46,.03)"),
                  cursor: "pointer",
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.input, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{n.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{n.title}</div>
                    {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.accent, flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: 12, color: T.sub, marginTop: 2, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.4 }}>{n.body}</div>
                  <div style={{ fontSize: 10, color: T.muted, marginTop: 4, fontFamily: "'DM Sans',sans-serif" }}>{n.time}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
function App() {
  var [tab, setTab]           = useState("compare");
  var [fromAddr, setFromAddr] = useState({ label: "Gare du Nord", lat: 48.8809, lng: 2.3553 });
  var [geoLoading, setGeoLoading] = useState(false);

  // Géolocalisation automatique au lancement
  useEffect(function() {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        var lat = pos.coords.latitude;
        var lng = pos.coords.longitude;
        // Reverse geocoding via Mapbox
        if (MAPBOX_TOKEN && MAPBOX_TOKEN !== "COLLE_TON_TOKEN_ICI") {
          fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/" + lng + "," + lat + ".json?access_token=" + MAPBOX_TOKEN + "&language=fr&limit=1")
            .then(function(r) { return r.json(); })
            .then(function(data) {
              var label = data.features && data.features[0] ? data.features[0].place_name.split(",").slice(0,2).join(",") : "Ma position";
              setFromAddr({ label: label, lat: lat, lng: lng });
              setGeoLoading(false);
            })
            .catch(function() {
              setFromAddr({ label: "Ma position", lat: lat, lng: lng });
              setGeoLoading(false);
            });
        } else {
          setFromAddr({ label: "Ma position", lat: lat, lng: lng });
          setGeoLoading(false);
        }
      },
      function() { setGeoLoading(false); }, // Refus ou erreur
      { timeout: 8000, maximumAge: 60000 }
    );
  }, []);
  var [toAddr,   setToAddr]   = useState(null);
  var [vehicle, setVehicle]   = useState(null);
  var [favModal, setFavModal] = useState(null);
  var [onboarded, setOnboarded] = useState(false);
  var [dark, setDark]         = useState(false);
  var [notifs, setNotifs]     = useState(NOTIF_TEMPLATES);
  var [showNotifs, setShowNotifs] = useState(false);
  var [toast, setToast]       = useState(null);

  var unreadCount = notifs.filter(function(n) { return !n.read; }).length;

  function triggerToast() {
    var unread = notifs.filter(function(n) { return !n.read; });
    if (unread.length > 0) { setToast(unread[0]); }
    else {
      var demo = { id: 99, icon: "⚡", title: "Test — Prix dynamiques détectés", body: "Des plateformes ont augmenté leurs prix. Comparez avant de partir.", time: "À l'instant", read: false };
      setToast(demo);
    }
  }

  function markAllRead() {
    setNotifs(function(prev) { return prev.map(function(n) { return Object.assign({}, n, { read: true }); }); });
  }

  function markRead(id) {
    setNotifs(function(prev) { return prev.map(function(n) { return n.id === id ? Object.assign({}, n, { read: true }) : n; }); });
  }
  var [favs, setFavs]         = useState([
    { id: "home", icon: "🏠", label: "Domicile", addr: null, lat: null, lng: null },
    { id: "work", icon: "💼", label: "Bureau",   addr: null, lat: null, lng: null },
  ]);

  var T = dark ? DARK : LIGHT;

  function saveFav(sel, custom) {
    if (favModal.mode === "new" && custom) {
      setFavs(function(prev) {
        return prev.concat([{ id: "f" + Date.now(), icon: custom.icon, label: custom.label, addr: sel.label, lat: sel.lat, lng: sel.lng }]);
      });
    } else if (favModal.fav) {
      setFavs(function(prev) {
        return prev.map(function(f) {
          return f.id === favModal.fav.id ? Object.assign({}, f, { addr: sel.label, lat: sel.lat, lng: sel.lng }) : f;
        });
      });
    }
    setFavModal(null);
  }

  function removeFav(id) {
    setFavs(function(prev) { return prev.filter(function(f) { return f.id !== id; }); });
  }

  return (
    <div style={{ maxWidth: 390, margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column", background: T.bg, position: "relative", overflow: "hidden", transition: "background .3s" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{"@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}"}</style>
      {!onboarded && <Onboarding onDone={function() { setOnboarded(true); }} />}
      {tab === "compare" && <Compare T={T} onVehicle={setVehicle} favs={favs} onFav={function(f, m) { setFavModal({ fav: f, mode: m }); }} onBell={function() { setShowNotifs(true); }} unreadCount={unreadCount} fromAddr={fromAddr} toAddr={toAddr} setFromAddr={setFromAddr} setToAddr={setToAddr} geoLoading={geoLoading} />}
      {tab === "map"     && <MapView T={T} fromAddr={fromAddr} toAddr={toAddr} onVehicle={setVehicle} />}
      {tab === "history" && <History T={T} />}
      {tab === "profile" && <Profile T={T} favs={favs} onFav={function(f, m) { setFavModal({ fav: f, mode: m }); }} onRemoveFav={removeFav} dark={dark} setDark={setDark} onTestNotif={triggerToast} />}
      <BottomNav T={T} tab={tab} setTab={setTab} />
      {toast    && <Toast T={T} notif={toast} onClose={function() { setToast(null); }} />}
      {showNotifs && <NotifPanel T={T} dark={dark} notifs={notifs} onClose={function() { setShowNotifs(false); }} onMarkAll={markAllRead} onRead={markRead} />}
      {vehicle  && <Detail T={T} v={vehicle} fromAddr={fromAddr} toAddr={toAddr} onClose={function() { setVehicle(null); }} />}
      {favModal && <FavModal T={T} fav={favModal.fav} onSave={saveFav} onClose={function() { setFavModal(null); }} />}
    </div>
  );
}

export default App;
