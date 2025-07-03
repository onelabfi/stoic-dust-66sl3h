import React, { useState } from "react";

const asbestinKaytto = {
  muovimatto: { alku: 1965, loppu: 1985 },
  kaakeli: { alku: 1960, loppu: 1980 },
  tasoite: { alku: 1960, loppu: 1988 },
  levy: { alku: 1950, loppu: 1980 },
  seinä: { alku: 1950, loppu: 1980 },
  muu: { alku: 1960, loppu: 1985 },
};

export default function App() {
  const [materiaali, setMateriaali] = useState("");
  const [materiaaliMuu, setMateriaaliMuu] = useState("");
  const [sijainti, setSijainti] = useState("");
  const [huone, setHuone] = useState("");
  const [huoneMuu, setHuoneMuu] = useState("");
  const [vuosi, setVuosi] = useState("");
  const [remontti, setRemontti] = useState("");
  const [riski, setRiski] = useState(null);
  const [viesti, setViesti] = useState("");

  const arvioiRiski = () => {
    const valittuMateriaali = materiaali || "muu";
    const kaytettavaVuosi = parseInt(remontti) || parseInt(vuosi);
    let laskettuRiski = 0,
      lisaviesti = "";

    if (kaytettavaVuosi >= 1994) {
      lisaviesti = "Vuoden 1994 jälkeen ei tarvitse asbestikartoittaa.";
    }

    if (kaytettavaVuosi && asbestinKaytto[valittuMateriaali]) {
      const { alku, loppu } = asbestinKaytto[valittuMateriaali];
      if (kaytettavaVuosi < alku) laskettuRiski = 0;
      else if (kaytettavaVuosi <= loppu) {
        const vuosiErotus = kaytettavaVuosi - alku;
        const p = 75 / (loppu - alku);
        laskettuRiski = 5 + vuosiErotus * p;
      } else if (kaytettavaVuosi <= loppu + 5) {
        laskettuRiski = 70 - (kaytettavaVuosi - loppu) * 13;
      } else laskettuRiski = 5;
    }

    setRiski(laskettuRiski);
    setViesti(lisaviesti);
  };

  const getLiikennevalo = () => {
    if (riski <= 10) return "#00cc66";
    if (riski <= 40) return "#ffcc00";
    return "#cc0000";
  };

  const inputStyle = {
    width: "100%",
    padding: 8,
    marginTop: 8,
    backgroundColor: "#333",
    color: "#fff",
    border: "1px solid #555",
  };

  return (
    <div
      style={{
        fontFamily: "Arial",
        margin: 0,
        padding: 20,
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          border: "16px solid #ccc",
          borderRadius: 40,
          width: 340,
          backgroundColor: "#000",
          padding: 20,
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: 30 }}>Asbesti AI</h1>
        <div
          style={{
            padding: 30,
            background: "#000",
            borderRadius: 20,
            boxShadow: "0 0 20px rgba(255,255,255,0.1)",
            maxWidth: 320,
            margin: "auto",
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <label>1. Mitä materiaalia olet poistamassa?</label>
            <select
              value={materiaali}
              onChange={(e) => setMateriaali(e.target.value)}
              style={inputStyle}
            >
              <option value="">-- Valitse materiaali --</option>
              <option value="muovimatto">Muovimatto</option>
              <option value="kaakeli">Kaakeli</option>
              <option value="tasoite">Tasoite</option>
              <option value="levy">Levy</option>
              <option value="seinä">Seinä</option>
              <option value="muu">Joku muu</option>
            </select>
            {materiaali === "muu" && (
              <input
                type="text"
                placeholder="Jos muu, mikä?"
                value={materiaaliMuu}
                onChange={(e) => setMateriaaliMuu(e.target.value)}
                style={inputStyle}
              />
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label>2. Missä kohtaa materiaali sijaitsee?</label>
            <select
              value={sijainti}
              onChange={(e) => setSijainti(e.target.value)}
              style={inputStyle}
            >
              <option value="">-- Valitse sijainti --</option>
              <option value="seinä">Seinä</option>
              <option value="katto">Katto</option>
              <option value="lattia">Lattia</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label>3. Missä huoneessa materiaali sijaitsee?</label>
            <select
              value={huone}
              onChange={(e) => setHuone(e.target.value)}
              style={inputStyle}
            >
              <option value="">-- Valitse huone --</option>
              <option value="keittiö">Keittiö</option>
              <option value="kph">Kylpyhuone</option>
              <option value="oh">Olohuone</option>
              <option value="mh">Makuuhuone</option>
              <option value="eteinen">Eteinen</option>
              <option value="komero">Komero</option>
              <option value="muu">Joku muu</option>
            </select>
            {huone === "muu" && (
              <input
                type="text"
                placeholder="Jos muu, mikä?"
                value={huoneMuu}
                onChange={(e) => setHuoneMuu(e.target.value)}
                style={inputStyle}
              />
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label>4. Minä vuonna rakennus on rakennettu?</label>
            <input
              type="number"
              value={vuosi}
              onChange={(e) => setVuosi(e.target.value)}
              min="1900"
              max="2025"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label>5. Tiedätkö milloin materiaali viimeksi remontoitiin?</label>
            <input
              type="text"
              value={remontti}
              onChange={(e) => setRemontti(e.target.value)}
              placeholder="Esim. 2005 tai ei tietoa"
              style={inputStyle}
            />
          </div>

          <button
            onClick={arvioiRiski}
            style={{
              padding: "12px 24px",
              borderRadius: 30,
              border: "none",
              backgroundColor: "#9c27b0",
              color: "white",
              cursor: "pointer",
              fontSize: 16,
              width: "100%",
              marginTop: 30,
            }}
          >
            Laske riski
          </button>

          {riski !== null && (
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  backgroundColor: getLiikennevalo(),
                  margin: "0 auto",
                }}
              />
              <div style={{ fontWeight: "bold", fontSize: 20, marginTop: 10 }}>
                Arvioitu asbestiriski: {riski.toFixed(1)}%
              </div>
              {viesti && (
                <div style={{ marginTop: 10, fontStyle: "italic" }}>
                  {viesti}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
