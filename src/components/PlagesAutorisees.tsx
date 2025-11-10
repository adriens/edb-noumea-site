
"use client";
import React, { useEffect, useState } from 'react';
import { parseCSV } from "./csvUtils";

const CSV_URL = "https://raw.githubusercontent.com/adriens/edb-noumea-data/main/data/resume.csv";

// Plage is Record<string, string> from CSV parsing

const PlagesAutorisees: React.FC = () => {
  const [plages, setPlages] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(CSV_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Erreur de chargement des données');
        return res.text();
      })
      .then((csv) => {
    const data = parseCSV(csv);
  // Stocker toutes les plages avec leur état sanitaire
  setPlages(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div>
      <h2>Liste des plages et état sanitaire</h2>
  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1em', fontSize: '1.1em', color: '#222', background: '#f8fcff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <thead>
          <tr style={{ background: '#caf0f8' }}>
            <th style={{ padding: '14px', border: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1em' }}>État</th>
            <th style={{ padding: '14px', border: 'none', textAlign: 'left', fontWeight: 'bold', fontSize: '1.1em' }}>Plage</th>
            <th style={{ padding: '14px', border: 'none', textAlign: 'left', fontWeight: 'bold', fontSize: '1.1em' }}>Autorisation</th>
          </tr>
        </thead>
        <tbody>
          {plages.map((plage, idx) => {
            const autorisee = plage["etat_sanitaire"] === "Baignade autorisée";
            const emoji = autorisee ? "🟢🏊‍♂️" : "🔴🚫";
            return (
              <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#e9ecef' }}>
                <td style={{ padding: '14px', border: 'none', textAlign: 'center', fontSize: '1.5em' }}>{emoji}</td>
                <td style={{ padding: '14px', border: 'none', fontWeight: '500' }}>{plage["plage"]}</td>
                <td style={{ padding: '14px', border: 'none' }}>{plage["etat_sanitaire"]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PlagesAutorisees;
