"use client";
import React, { useEffect, useState } from 'react';

// Improved CSV parser to handle quoted fields, commas, and escaped quotes
function parseCSV(csv: string) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      let val = values[i]?.trim() || '';
      // Remove surrounding quotes if present
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      obj[header] = val;
    });
    return obj;
  });
}

const DETAILS_CSV_URL = "https://raw.githubusercontent.com/adriens/edb-noumea-data/main/data/details.csv";

const PrelevementsSection: React.FC = () => {
  const [prelevements, setPrelevements] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [headers, setHeaders] = useState<string[]>([]);
  useEffect(() => {
    fetch(DETAILS_CSV_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Erreur de chargement des données');
        return res.text();
      })
      .then((csv) => {
        const lines = csv.trim().split('\n');
        const headerLine = lines[0];
        const headersArr = headerLine.split(',').map(h => h.trim());
        setHeaders(headersArr);
        const data = parseCSV(csv);
        setPrelevements(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement des prélèvements...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
  <section style={{ marginTop: '5em' }}>
      <h2 style={{ color: '#0077b6', fontSize: '1.4em', marginBottom: '0.7em' }}>Prélèvements et analyses</h2>
  <div style={{ marginBottom: '1em', fontSize: '1.05em', background: '#e0f2ff', borderRadius: '8px', padding: '1em 1.2em' }}>
  <strong style={{ color: '#0077b6' }}>Légende qualité de l'eau :</strong>
        <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '0.5em' }}>
          <li style={{ background: '#e0f2ff', display: 'inline-block', padding: '4px 12px', borderRadius: '6px', marginRight: '1em', color: '#0077b6', fontWeight: 'bold' }}>Excellent&nbsp;: E. coli ≤ 250 NPP/100ml et Entérocoques ≤ 100 NPP/100ml</li>
          <li style={{ background: '#fffbe0', display: 'inline-block', padding: '4px 12px', borderRadius: '6px', marginRight: '1em', color: '#b68a00', fontWeight: 'bold' }}>Déconseillé&nbsp;: E. coli {'>'} 250 et ≤ 1000 NPP/100ml ou Entérocoques {'>'} 100 et ≤ 370 NPP/100ml</li>
          <li style={{ background: '#ffe0e0', display: 'inline-block', padding: '4px 12px', borderRadius: '6px', color: '#d90429', fontWeight: 'bold' }}>Interdit&nbsp;: E. coli {'>'} 1000 NPP/100ml ou Entérocoques {'>'} 370 NPP/100ml</li>
        </ul>
        <div style={{ marginTop: '0.7em', fontSize: '0.98em', color: '#555' }}>
          <span>Référence : <a href="https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32006L0007" target="_blank" rel="noopener noreferrer" style={{
            background: '#0077b6',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            transition: 'background 0.2s',
            cursor: 'pointer',
            display: 'inline-block'
          }}>Directive européenne 2006/7/CE</a> sur la gestion de la qualité des eaux de baignade.</span>
        </div>
      </div>
      <div style={{ width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.97em', color: '#222', background: '#f8fcff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <thead>
            <tr style={{ background: '#00b4d8' }}>
              {(() => {
                const filtered = headers.filter(h => h !== 'point_de_prelevement' && h !== 'id_point_prelevement');
                const siteIdx = filtered.indexOf('site');
                const lieuIdx = filtered.indexOf('desc_point_prelevement');
                let ordered = [...filtered];
                if (lieuIdx !== -1 && siteIdx !== -1 && lieuIdx !== siteIdx + 1) {
                  // Remove 'desc_point_prelevement' from its current position
                  ordered.splice(lieuIdx, 1);
                  // Insert it just after 'site'
                  ordered.splice(siteIdx + 1, 0, 'desc_point_prelevement');
                }
                return ordered.map((col, idx) => (
                  <th key={idx} style={{ padding: '8px 4px', border: 'none', textAlign: 'left', fontWeight: 'bold', color: '#fff', fontSize: '0.97em' }}>{col.replace(/_/g, ' ').replace('npp 100ml', 'NPP/100ml').replace('site', 'Site').replace('date', 'Date').replace('heure', 'Heure').replace('e coli', 'E. coli').replace('enterocoques', 'Entérocoques').replace('id point prelevement', 'ID Prélèvement').replace('desc point prelevement', 'Lieu prélèvement').replace('point de prelevement', 'Point de prélèvement').replace(/"/g, '')}</th>
                ));
              })()}
            </tr>
          </thead>
          <tbody>
            {prelevements.map((row, idx) => {
              // Get values (handle possible variations in header names)
              const ecoliRaw = row['e_coli_npp_100ml'] || row['e coli npp 100ml'] || row['E. coli NPP/100ml'] || '';
              const enterocoquesRaw = row['enterocoques_npp_100ml'] || row['enterocoques npp 100ml'] || row['Entérocoques NPP/100ml'] || '';
              const ecoli = parseFloat(ecoliRaw.replace(/[^\d.]/g, ''));
              const enterocoques = parseFloat(enterocoquesRaw.replace(/[^\d.]/g, ''));
              let category = 'excellent';
              if ((ecoli > 1000) || (enterocoques > 370)) {
                category = 'interdit';
              } else if ((ecoli > 250 && ecoli <= 1000) || (enterocoques > 100 && enterocoques <= 370)) {
                category = 'deconseille';
              }
              let bgColor = idx % 2 === 0 ? '#fff' : '#e3f2fd';
              if (category === 'excellent') bgColor = '#e0f2ff'; // bleu clair
              if (category === 'deconseille') bgColor = '#fffbe0'; // jaune clair
              if (category === 'interdit') bgColor = '#ffe0e0'; // rouge clair
              return (
                <tr key={idx} style={{ background: bgColor }}>
                  {(() => {
                    const filtered = headers.filter(h => h !== 'point_de_prelevement' && h !== 'id_point_prelevement');
                    const siteIdx = filtered.indexOf('site');
                    const lieuIdx = filtered.indexOf('desc_point_prelevement');
                    let ordered = [...filtered];
                    if (lieuIdx !== -1 && siteIdx !== -1 && lieuIdx !== siteIdx + 1) {
                      ordered.splice(lieuIdx, 1);
                      ordered.splice(siteIdx + 1, 0, 'desc_point_prelevement');
                    }
                    return ordered.map((col, i) => (
                      <td key={i} style={{ padding: '7px 4px', border: 'none', color: '#222', fontSize: '0.97em' }}>{row[col]?.replace(/"/g, '')}</td>
                    ));
                  })()}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};


// Section À propos
export const AproposSection: React.FC = () => (
  <section style={{ marginTop: '3em', marginBottom: '2em', background: '#f1f8ff', borderRadius: '10px', padding: '2em', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
    <h2 style={{ color: '#0077b6', fontSize: '1.25em', marginBottom: '0.7em' }}>À propos des données</h2>
    <p style={{ fontSize: '1.07em', color: '#222', marginBottom: '0.7em' }}>
      Les données sur la qualité des eaux de baignade affichées sur ce site proviennent du dépôt public&nbsp;:
      <a href="https://github.com/adriens/edb-noumea-data" target="_blank" rel="noopener noreferrer" style={{ color: '#0077b6', textDecoration: 'underline' }}>adriens/edb-noumea-data</a>.
    </p>
    <p style={{ fontSize: '1.07em', color: '#222', marginBottom: '0.7em' }}>
      Ce dépôt est mis à jour quotidiennement grâce à <strong>GitHub Actions</strong> et au package PyPI&nbsp;:
      <a href="https://pypi.org/project/edb-noumea/" target="_blank" rel="noopener noreferrer" style={{ color: '#0077b6', textDecoration: 'underline' }}>edb-noumea</a>.
    </p>
    <p style={{ fontSize: '1.07em', color: '#222' }}>
      Le fichier utilisé est&nbsp;: <strong>details.csv</strong>, mis à jour automatiquement chaque jour sur GitHub. Les données sont récupérées dynamiquement à chaque visite du site, garantissant l'affichage des informations les plus récentes disponibles.
    </p>
    <p style={{ fontSize: '1.07em', color: '#222' }}>
      Source officielle&nbsp;: <a href="https://github.com/adriens/edb-noumea-data" target="_blank" rel="noopener noreferrer" style={{ color: '#0077b6', textDecoration: 'underline' }}>https://github.com/adriens/edb-noumea-data</a>
    </p>
    <p style={{ fontSize: '1.07em', color: '#222' }}>
      Pour en savoir plus sur la méthodologie et l’utilisation des données, consultez le notebook explicatif sur Kaggle&nbsp;:
      <a href="https://www.kaggle.com/code/adriensales/qualit-eaux-de-baignade-noum-a" target="_blank" rel="noopener noreferrer" style={{ color: '#0077b6', textDecoration: 'underline' }}>Qualité eaux de baignade Nouméa (Kaggle)</a>
    </p>
  </section>
);

export default PrelevementsSection;
