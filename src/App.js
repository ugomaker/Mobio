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
  uber:   { name: "Uber",   short: "Ub", color: "#000",    tc: "#fff", base: 1.5, pKm: 1.20, pMin: 0.22, stars: 4.6, categories: [{label:"UberX", seats:4},{label:"Uber Comfort", seats:4},{label:"Uber XL", seats:6},{label:"Uber Van", seats:7}] },
  bolt:   { name: "Bolt",   short: "Bt", color: "#34d186", tc: "#fff", base: 1.1, pKm: 0.95, pMin: 0.18, stars: 4.8, categories: [{label:"Bolt Standard", seats:4},{label:"Bolt XL", seats:6}] },
  heetch: { name: "Heetch", short: "He", color: "#ff1c5b", tc: "#fff", base: 1.3, pKm: 1.05, pMin: 0.20, stars: 4.7, categories: [{label:"Heetch", seats:4},{label:"Heetch XL", seats:6}] },
  marcel: { name: "Marcel", short: "Ma", color: "#1a1a2e", tc: "#fff", base: 2.0, pKm: 1.45, pMin: 0.28, stars: 4.9, categories: [{label:"Marcel Berline", seats:4},{label:"Marcel Van", seats:7}] },
};
const SCOOTERS = {
  lime:  { name: "Lime",   short: "Lm", color: "#00c853", tc: "#fff", unlock: 1.0, pMin: 0.25, type: "Trottinette",    bat: 78   },
  tier:  { name: "Tier",   short: "Tr", color: "#1B5EF7", tc: "#fff", unlock: 1.0, pMin: 0.28, type: "Trottinette",    bat: 55   },
  dott:  { name: "Dott",   short: "Dt", color: "#ff4a17", tc: "#fff", unlock: 1.0, pMin: 0.20, type: "Vélo électrique", bat: 91  },
  velib: { name: "Vélib'", short: "Vb", color: "#0072b9", tc: "#fff", unlock: 0,   pMin: 0.20, type: "Vélo électrique", bat: null },
};
const HISTORY_DATA = [
  { id: 1, plId: "bolt",   from: "Gare du Nord", to: "Tour Eiffel",  price: 8.20,  dur: 14, date: "Aujourd'hui", saved: 3.20, eco: true  },
  { id: 2, plId: "lime",   from: "République",   to: "Bastille",     price: 5.40,  dur: 18, date: "Hier",        saved: null, eco: true, sc: true },
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
var ENHAX_LOGO = "https://placehold.co/120x40/0d1629/white?text=ENHAX";

// ── JCDecaux API Key ──────────────────────────────────────────────────────────
// 👉 Clé gratuite sur developer.jcdecaux.com
var JCDECAUX_KEY = "eda50bf626d4fb2030eef046f308a30c0ce0fe8c";

// ── Mapbox Token (module level) ───────────────────────────────────────────
// 👉 Remplace par ton token sur https://mapbox.com
var MAPBOX_TOKEN = "COLLE_TON_TOKEN_ICI";

// ── Notifications ──────────────────────────────────────────────────────────
var NOTIF_TEMPLATES = [
  { id: 1, type: "prix dynamiques",   icon: "⚡", title: "Prix dynamiques détectés",         body: "Certaines plateformes ont augmenté leurs prix. Comparez avant de partir.",  time: "À l'instant", read: false },
  { id: 2, type: "scooter", icon: "🛴", title: "Lime disponible près de toi", body: "Une trottinette Lime à 85m de ta position. Batterie 78%.",   time: "Il y a 3 min", read: false },
  { id: 3, type: "saving",  icon: "💰", title: "Tu as économisé 3,20 €",      body: "En choisissant Bolt plutôt qu'Uber ce matin.",               time: "Il y a 2h",   read: true  },
  { id: 4, type: "weekly",  icon: "📊", title: "Ton résumé de la semaine",    body: "7 trajets · 34,60 € dépensés · 8,40 € économisés vs Uber.", time: "Hier",        read: true  },
];


// ── Textes légaux ───────────────────────────────────────────────────────────
var CGU_TEXT = [
  { title: "1. Éditeur de l'application", content: "L'application Mobio est éditée par ⚠️ TON PRÉNOM NOM ⚠️, auto-entrepreneur immatriculé sous le numéro SIRET ⚠️ TON SIRET ⚠️, domicilié à ⚠️ TON ADRESSE ⚠️, France. Contact : contact@mobio.app" },
  { title: "2. Description du service", content: "Mobio est une application de comparaison de prix permettant aux utilisateurs de comparer en temps réel les tarifs des plateformes de VTC (Uber, Bolt, Heetch, Marcel) et de micro-mobilité (Lime, Tier, Dott, Vélib'). Mobio n'est pas une plateforme de réservation et n'est affiliée à aucune des plateformes comparées." },
  { title: "3. Accès au service", content: "L'accès à Mobio est gratuit. Certaines fonctionnalités avancées nécessitent un abonnement Pro. L'utilisateur doit être âgé d'au moins 18 ans pour utiliser le service. L'éditeur se réserve le droit de suspendre ou modifier le service à tout moment." },
  { title: "4. Responsabilité", content: "Les prix affichés sur Mobio sont des estimations basées sur les grilles tarifaires publiques des plateformes. Mobio ne garantit pas l'exactitude des prix en temps réel, qui peuvent varier selon les conditions de trafic, la demande et les politiques tarifaires des plateformes. L'éditeur ne saurait être tenu responsable des écarts entre les prix affichés et les prix effectivement facturés par les plateformes." },
  { title: "5. Propriété intellectuelle", content: "L'application Mobio, son design, son code source et ses contenus sont la propriété exclusive de l'éditeur. Toute reproduction, modification ou distribution sans autorisation écrite préalable est interdite." },
  { title: "6. Droit applicable", content: "Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents. Tout différend sera soumis à une tentative de médiation préalable." },
  { title: "7. Modification des CGU", content: "L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification significative par notification dans l'application. La date de dernière mise à jour est indiquée en bas de ce document." },
  { title: "Dernière mise à jour", content: "Mai 2025" },
];

var PRIVACY_TEXT = [
  { title: "1. Responsable du traitement", content: "Le responsable du traitement des données est ⚠️ TON PRÉNOM NOM ⚠️, auto-entrepreneur, domicilié à ⚠️ TON ADRESSE ⚠️, France. Contact DPO : contact@mobio.app" },
  { title: "2. Données collectées", content: "Mobio collecte les données suivantes : données de localisation (avec votre consentement), adresses de départ et d'arrivée saisies, adresses favorites enregistrées, historique des trajets consultés, préférences de l'application. Aucune donnée bancaire n'est collectée directement par Mobio." },
  { title: "3. Finalités du traitement", content: "Vos données sont utilisées pour : fournir le service de comparaison de prix, améliorer les recommandations et l'expérience utilisateur, envoyer des notifications (avec votre consentement), établir des statistiques d'usage anonymisées." },
  { title: "4. Base légale", content: "Le traitement de vos données est fondé sur : votre consentement (localisation, notifications), l'exécution du contrat (fourniture du service), l'intérêt légitime (amélioration du service, sécurité)." },
  { title: "5. Durée de conservation", content: "Vos données sont conservées pendant toute la durée de votre utilisation de l'application. L'historique des trajets est conservé 12 mois. En cas de suppression du compte, vos données sont effacées sous 30 jours." },
  { title: "6. Vos droits (RGPD)", content: "Conformément au RGPD, vous disposez des droits suivants : droit d'accès à vos données, droit de rectification, droit à l'effacement (droit à l'oubli), droit à la portabilité, droit d'opposition au traitement. Pour exercer ces droits, contactez : contact@mobio.app. Vous pouvez également adresser une réclamation à la CNIL (www.cnil.fr)." },
  { title: "7. Partage des données", content: "Mobio ne vend jamais vos données personnelles à des tiers. Vos données peuvent être partagées avec : Mapbox (cartographie, politique de confidentialité sur mapbox.com), les plateformes VTC/mobilité uniquement lors d'un clic de redirection vers leur application." },
  { title: "8. Cookies", content: "Mobio utilise des cookies techniques nécessaires au fonctionnement de l'application et des cookies de mesure d'audience anonymisée. Vous pouvez gérer vos préférences cookies depuis les paramètres de l'application." },
  { title: "Dernière mise à jour", content: "Mai 2025" },
];

// ── Utilitaires ────────────────────────────────────────────────────────────
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
      "&where=distance(coordonnees_geo%2C%20geom'POINT(" + lng + "%20" + lat + ")'%2C%20800m)" +
      "&order_by=distance(coordonnees_geo%2C%20geom'POINT(" + lng + "%20" + lat + ")')";

    fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (!data.results) { setLoading(false); return; }
        var formatted = data.results.map(function(s) {
          var coords = s.coordonnees_geo;
          var sLat = coords ? coords.lat : lat;
          var sLng = coords ? coords.lon : lng;
          // Distance à pied (haversine simplifié)
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


// ── JCDecaux vélos en libre-service (toutes villes françaises) ─────────────
var JCDECAUX_CITIES = {
  paris:     { contract: "paris",     name: "Paris",     color: "#0072b9" },
  lyon:      { contract: "lyon",      name: "Lyon",      color: "#e2001a" },
  bordeaux:  { contract: "bordeaux",  name: "Bordeaux",  color: "#6f3996" },
  marseille: { contract: "marseille", name: "Marseille", color: "#009fe3" },
  toulouse:  { contract: "toulouse",  name: "Toulouse",  color: "#f0a500" },
  nantes:    { contract: "nantes",    name: "Nantes",    color: "#00a550" },
  lille:     { contract: "lille",     name: "Lille",     color: "#e2001a" },
  rennes:    { contract: "rennes",    name: "Rennes",    color: "#003189" },
  strasbourg:{ contract: "strasbourg",name: "Strasbourg",color: "#e2001a" },
  rouen:     { contract: "rouen",     name: "Rouen",     color: "#009fe3" },
};

// Détecte la ville selon les coordonnées GPS
function detectCity(lat, lng) {
  var cities = [
    { id: "paris",      lat: 48.8566, lng: 2.3522,  radius: 0.3  },
    { id: "lyon",       lat: 45.7640, lng: 4.8357,  radius: 0.2  },
    { id: "bordeaux",   lat: 44.8378, lng: -0.5792, radius: 0.15 },
    { id: "marseille",  lat: 43.2965, lng: 5.3698,  radius: 0.2  },
    { id: "toulouse",   lat: 43.6047, lng: 1.4442,  radius: 0.15 },
    { id: "nantes",     lat: 47.2184, lng: -1.5536, radius: 0.15 },
    { id: "lille",      lat: 50.6292, lng: 3.0573,  radius: 0.15 },
    { id: "rennes",     lat: 48.1173, lng: -1.6778, radius: 0.12 },
    { id: "strasbourg", lat: 48.5734, lng: 7.7521,  radius: 0.12 },
    { id: "rouen",      lat: 49.4432, lng: 1.0993,  radius: 0.12 },
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
    setCityName(city.name);
    setLoading(true);

    fetch(
      "https://api.jcdecaux.com/vls/v3/stations?contract=" + city.contract +
      "&apiKey=" + JCDECAUX_KEY
    )
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!Array.isArray(data)) { setLoading(false); return; }

      // Trouver les 3 stations les plus proches
      var withDist = data
        .filter(function(s) { return s.status === "OPEN" && s.totalStands && s.totalStands.availabilities && s.totalStands.availabilities.bikes > 0; })
        .map(function(s) {
          var sLat = s.position.latitude;
          var sLng = s.position.longitude;
          var dist = Math.round(haversine(lat, lng, sLat, sLng) * 1000);
          var avail = s.totalStands.availabilities;
          return {
            id:          s.number,
            name:        s.name,
            dist:        dist,
            lat:         sLat,
            lng:         sLng,
            mechaDispo:  avail.mechanicalBikes || 0,
            elecDispo:   avail.electricalBikes || 0,
            totalDispo:  avail.bikes || 0,
            docks:       avail.stands || 0,
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
  var [sort,  setSort]  = useState("price_asc");
  var [flash, setFlash] = useState(false);
  var [passengers, setPassengers] = useState(1);
  var velib = useVelib(from.lat, from.lng);
  var jcdecaux = useJCDecaux(from.lat, from.lng);

  var km   = to ? Math.max(0.5, haversine(from.lat, from.lng, to.lat, to.lng) * 1.35) : 5.2;
  var mins = Math.round(km / 0.38);
  var scMins = Math.round(km * 60 / 14);

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
  var scList = Object.keys(SCOOTERS).filter(function(id) { return id !== "velib"; }).map(function(id, i) {
    var s = SCOOTERS[id];
    return { id: id, name: s.name, short: s.short, color: s.color, tc: s.tc, type: s.type, bat: s.bat, unlock: s.unlock, pMin: s.pMin, price: calcScPrice(id, scMins), dist: [85, 140, 210][i], real: false };
  }).concat(
    velib.stations.slice(0, 2).map(function(st) {
      var walkMins = Math.round(st.dist / 80); // ~80m/min à pied
      var rideMins = scMins;
      var price = st.elecDispo > 0 ? Math.round((1 + rideMins * 0.17) * 100) / 100 : Math.round((rideMins > 45 ? 1 + (rideMins - 45) * 0.10 : 0) * 100) / 100;
      return {
        id: "velib_" + st.id,
        name: "Vélib' — " + (st.elecDispo > 0 ? "Électrique" : "Mécanique"),
        short: "Vb", color: "#0072b9", tc: "#fff",
        type: st.elecDispo > 0 ? "Vélo électrique" : "Vélo mécanique",
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

        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {[[km.toFixed(1) + " km", "Distance"], [mins + " min", "Durée"], [trafLabel, "Trafic"]].map(function(item, i) {
            return (
              <div key={item[1]} style={{ flex: 1, background: T.input, borderRadius: 8, padding: "7px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: i === 2 ? trafColor : T.text, fontFamily: "'DM Sans',sans-serif" }}>{item[0]}</div>
                <div style={{ fontSize: 9, color: T.sub, marginTop: 1, fontFamily: "'DM Sans',sans-serif" }}>{item[1]}</div>
              </div>
            );
          })}
        </div>

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
          {[["vtc", "Véhicules"], ["micro", "Trottinettes"]].map(function(item) {
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
            <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
              {[["price_asc", "Prix croissant"], ["price_desc", "Prix décroissant"], ["stars", "Meilleures notes"], ["eta_asc", "Plus rapide"]].map(function(item) {
                return (
                  <button
                    key={item[0]}
                    onClick={function() { setSort(item[0]); }}
                    style={{ padding: "5px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", background: sort === item[0] ? T.accent : T.input, color: sort === item[0] ? "#fff" : T.sub }}
                  >{item[1]}</button>
                );
              })}
            </div>

            {surgeInfo.hasSurge && (
              <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 12, padding: "10px 12px", marginBottom: 10, display: "flex", gap: 8 }}>
                <span style={{ fontSize: 16 }}>⚡</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#854f0b", fontFamily: "'DM Sans',sans-serif" }}>Prix dynamiques en cours</div>
                  <div style={{ fontSize: 11, color: "#996210", marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>{surgeInfo.reasons.join(" · ")}</div>
                </div>
              </div>
            )}

            {vtcList.length === 0 && (
              <div style={{ textAlign: "center", padding: "32px 20px", color: T.muted, fontFamily: "'DM Sans',sans-serif" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>😕</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 6 }}>Aucun véhicule disponible</div>
                <div style={{ fontSize: 12 }}>Aucune option pour {passengers} passagers. Essaie de réduire le nombre.</div>
              </div>
            )}
            {vtcList.map(function(v, i) {
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
            {velib.loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: T.input, borderRadius: 12, marginBottom: 10, fontSize: 12, color: T.sub, fontFamily: "'DM Sans',sans-serif" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0072b9", animation: "pulse 1s infinite" }} />
                Chargement des données Vélib' en temps réel…
              </div>
            )}
            {scList.map(function(s) {
              return (
                <div key={s.id} style={{ background: T.card, border: s.real ? "1.5px solid #0072b9" : "1px solid " + T.border, borderRadius: 14, padding: "11px 13px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
                  {s.real && <div style={{ position: "absolute", top: -9, right: 12, background: "#0072b9", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 5, fontFamily: "'DM Sans',sans-serif" }}>Temps réel</div>}
                  <Logo short={s.short} color={s.color} tc={s.tc} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: T.sub, marginTop: 3, display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Sans',sans-serif", flexWrap: "wrap" }}>
                      <span>📍 {s.dist} m</span>
                      {s.real && s.walkMins && <span>🚶 {s.walkMins} min</span>}
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
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{s.price.toFixed(2)} €</div>
                    <div style={{ fontSize: 10, color: T.muted, fontFamily: "'DM Sans',sans-serif" }}>{s.real ? (s.elecDispo > 0 ? "0€+0,17€/min" : "Gratuit 45min") : (s.unlock > 0 ? s.unlock + "€+" + s.pMin + "€/min" : s.pMin + "€/min")}</div>
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
var MAP_VEHICLES = [
  { id: "uber",   kind: "vtc",     lat: 48.875,  lng: 2.340,  color: "#000",    eta: 3  },
  { id: "bolt",   kind: "vtc",     lat: 48.868,  lng: 2.318,  color: "#34d186", eta: 4  },
  { id: "heetch", kind: "vtc",     lat: 48.862,  lng: 2.330,  color: "#ff1c5b", eta: 6  },
  { id: "marcel", kind: "vtc",     lat: 48.878,  lng: 2.310,  color: "#1a1a2e", eta: 8  },
  { id: "lime",   kind: "scooter", lat: 48.871,  lng: 2.325,  color: "#00c853", dist: "85m"  },
  { id: "tier",   kind: "scooter", lat: 48.865,  lng: 2.308,  color: "#1B5EF7", dist: "140m" },
  { id: "dott",   kind: "bike",    lat: 48.860,  lng: 2.297,  color: "#ff4a17", dist: "210m" },
];

function MapView(props) {
  var T = props.T;
  var mapRef     = useRef(null);
  var mapboxRef  = useRef(null);
  var markersRef = useRef([]);
  var [ready,    setReady]    = useState(false);
  var [noToken,  setNoToken]  = useState(false);
  var [filter,   setFilter]   = useState("tous");
  var [selected, setSelected] = useState(null);

  var km = 5.2;

  // Offsets fixes pour simuler des véhicules autour du départ (en degrés)
  var VEHICLE_OFFSETS = [
    { id: "uber",   kind: "vtc",     dlat:  0.008, dlng:  0.010 },
    { id: "bolt",   kind: "vtc",     dlat:  0.012, dlng: -0.008 },
    { id: "heetch", kind: "vtc",     dlat: -0.006, dlng:  0.014 },
    { id: "marcel", kind: "vtc",     dlat:  0.015, dlng:  0.005 },
    { id: "lime",   kind: "scooter", dlat: -0.003, dlng: -0.005, dist: "85m"  },
    { id: "tier",   kind: "scooter", dlat:  0.005, dlng: -0.012, dist: "140m" },
    { id: "dott",   kind: "bike",    dlat: -0.008, dlng:  0.008, dist: "210m" },
  ];

  function addMarkers(map, currentFilter) {
    var mapboxgl = window.mapboxgl;
    markersRef.current.forEach(function(m) { m.remove(); });
    markersRef.current = [];

    // Centre = adresse de départ
    var baseLat = props.fromAddr ? props.fromAddr.lat : 48.8809;
    var baseLng = props.fromAddr ? props.fromAddr.lng : 2.3553;

    VEHICLE_OFFSETS
      .filter(function(v) { return currentFilter === "tous" || v.kind === currentFilter; })
      .forEach(function(v) {
        var p = PLATFORMS[v.id] || SCOOTERS[v.id];
        var isVtc = v.kind === "vtc";
        var label = isVtc ? (p.name + " · " + calcVtcPrice(v.id, km, 14).toFixed(2) + " €") : (v.kind === "scooter" ? ("🛴 " + p.name) : ("🚲 " + p.name));

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

    var map = new mapboxgl.Map({
      container:   mapRef.current,
      style:       "mapbox://styles/mapbox/light-v11",
      center:      [2.325, 48.869],
      zoom:        12.5,
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
      var destEl = document.createElement("div");
      destEl.style.cssText = "width:12px;height:12px;border-radius:50%;background:#1a1a2e;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3)";
      var destMarker = new mapboxgl.Marker({ element: destEl }).setLngLat([props.toAddr ? props.toAddr.lng : 2.2945, props.toAddr ? props.toAddr.lat : 48.8584]).addTo(map);
      mapboxRef.destMarker = destMarker;

      mapboxRef.current = map;
      drawRoute(map, props.fromAddr ? props.fromAddr.lng : 2.3553, props.fromAddr ? props.fromAddr.lat : 48.8809, props.toAddr ? props.toAddr.lng : 2.2945, props.toAddr ? props.toAddr.lat : 48.8584);
      addMarkers(map, "tous");
    });

    return function() {
      if (mapboxRef.current) { mapboxRef.current.remove(); mapboxRef.current = null; }
    };
  }, [ready]);


  // Mettre à jour l'itinéraire + marqueurs quand les adresses changent
  useEffect(function() {
    var fa = props.fromAddr || { lat: 48.8809, lng: 2.3553 };
    if (!mapboxRef.current) return;
    if (mapboxRef.userMarker) mapboxRef.userMarker.setLngLat([fa.lng, fa.lat]);
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

  var selVtc = selected && PLATFORMS[selected] ? { id: selected, ...PLATFORMS[selected], price: calcVtcPrice(selected, km, 14), eta: [3,4,6,8][Object.keys(PLATFORMS).indexOf(selected)] } : null;
  var selSc  = selected && SCOOTERS[selected]  ? { id: selected, ...SCOOTERS[selected] } : null;

  var filters = [["tous","Tous"],["vtc","Véhicules"],["scooter","Trottinettes"],["bike","Vélos"]];

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
            {selSc && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <Logo short={selSc.short} color={selSc.color} tc={selSc.tc} size={34} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{selSc.name} — {selSc.type}</div>
                    <div style={{ fontSize: 11, color: T.sub, fontFamily: "'DM Sans',sans-serif" }}>
                      {VEHICLE_OFFSETS.find(function(v) { return v.id === selected; }) && VEHICLE_OFFSETS.find(function(v) { return v.id === selected; }).dist}
                      {selSc.bat ? " · 🔋 " + selSc.bat + "%" : ""}
                    </div>
                  </div>
                </div>
                <button style={{ width: "100%", background: selSc.color, color: "#fff", border: "none", borderRadius: 10, padding: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  Ouvrir {selSc.name} →
                </button>
              </div>
            )}
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
          {Object.keys(SCOOTERS).filter(function() { return filter === "tous" || filter === "scooter" || filter === "bike"; }).map(function(id) {
            var s = SCOOTERS[id];
            return (
              <div key={id} style={{ flexShrink: 0, width: 110, background: T.input, border: "1px solid " + T.border, borderRadius: 14, padding: "10px 11px", cursor: "pointer" }}
                onClick={function() { setSelected(id); }}>
                <Logo short={s.short} color={s.color} tc={s.tc} size={28} />
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginTop: 6, fontFamily: "'DM Sans',sans-serif" }}>{s.name}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.text, marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>{s.unlock > 0 ? s.unlock + "€+" + s.pMin + "€/min" : s.pMin + "€/min"}</div>
                {s.bat && (
                  <div style={{ marginTop: 5 }}>
                    <div style={{ width: "100%", height: 4, background: T.border, borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: s.bat + "%", height: "100%", background: s.color }} />
                    </div>
                    <div style={{ fontSize: 9, color: T.muted, marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>🔋 {s.bat}%</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Detail modal ───────────────────────────────────────────────────────────
function Detail(props) {
  var v = props.v;
  var T = props.T;
  var km = 5.2, mins = 14;
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
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{v.price.toFixed(2)} €</div>
              <div style={{ fontSize: 11, color: T.muted, fontFamily: "'DM Sans',sans-serif" }}>prix estimé</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
            {[["⏱", v.eta + " min", "Arrivée"], ["🗺", "14 min", "Trajet"], ["📍", "5,2 km", "Distance"]].map(function(item) {
              return (
                <div key={item[2]} style={{ background: T.input, borderRadius: 10, padding: "9px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{item[0]} {item[1]}</div>
                  <div style={{ fontSize: 10, color: T.sub, marginTop: 2, fontFamily: "'DM Sans',sans-serif" }}>{item[2]}</div>
                </div>
              );
            })}
          </div>

          <div style={{ marginBottom: 14 }}>
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
          </div>

          <button style={{ width: "100%", background: T.accent, color: "#fff", border: "none", borderRadius: 14, padding: 15, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: 10 }}>
            Réserver sur {v.name} ↗
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
        <div style={{ background: T.card, border: "1px solid " + T.border, borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
          {Object.keys(PLATFORMS).concat(Object.keys(SCOOTERS)).map(function(id, i, arr) {
            var p = PLATFORMS[id] || SCOOTERS[id];
            return (
              <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", borderBottom: i < arr.length - 1 ? "1px solid " + T.bsub : "none" }}>
                <Logo short={p.short} color={p.color} tc={p.tc} size={30} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: T.muted, fontFamily: "'DM Sans',sans-serif" }}>{connected.indexOf(id) >= 0 ? "Compte lié" : "Non lié"}</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 6, fontFamily: "'DM Sans',sans-serif", background: connected.indexOf(id) >= 0 ? "#e1f5ee" : T.input, color: connected.indexOf(id) >= 0 ? "#085041" : T.sub }}>
                  {connected.indexOf(id) >= 0 ? "Connecté" : "+ Connecter"}
                </div>
              </div>
            );
          })}
        </div>

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
            ["📧", "Nous contacter",    "contact@mobio.app",    function() { window.location.href = "mailto:contact@mobio.app"; }],
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
                  ⚠️ Remplace les zones marquées ⚠️ par tes vraies informations avant de publier sur l'App Store.
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
              {[["🚀","Fondé en","2025"],["📧","Contact","contact@mobio.app"],["🌍","Site web","mobio.app"]].map(function(item, i, arr) {
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
      {vehicle  && <Detail T={T} v={vehicle}      onClose={function() { setVehicle(null); }} />}
      {favModal && <FavModal T={T} fav={favModal.fav} onSave={saveFav} onClose={function() { setFavModal(null); }} />}
    </div>
  );
}

export default App;
