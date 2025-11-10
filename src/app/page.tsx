
import PlagesAutorisees from "../components/PlagesAutorisees";
import PrelevementsSection, { AproposSection } from "../components/PrelevementsSection";

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0f7fa 0%, #fff 100%)', padding: '0', margin: '0' }}>
      <main style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '18px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '2.5em 2em',
        marginTop: '4em',
        marginBottom: '4em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h1 style={{ fontSize: '2.3em', fontWeight: 700, color: '#0077b6', marginBottom: '0.3em', textAlign: 'center', letterSpacing: '0.02em' }}>
          Qualité des eaux de baignade à Nouméa
        </h1>
        <p style={{ fontSize: '1.15em', color: '#333', marginBottom: '2em', textAlign: 'center', maxWidth: '500px' }}>
          Retrouvez la liste des plages de Nouméa et l'état sanitaire de la baignade, mis à jour à partir des données publiques.
        </p>
  <section style={{ width: '100%', background: '#f1f8ff', borderRadius: '14px', padding: '2em 1.5em', marginBottom: '3em', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
    <h2 style={{ color: '#0077b6', fontSize: '1.25em', marginBottom: '1em', textAlign: 'center' }}>Plages autorisées à la baignade</h2>
    <PlagesAutorisees />
  </section>
  <section style={{ width: '100%', background: '#fff', borderRadius: '14px', padding: '2em 1.5em', marginBottom: '3em', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
    <PrelevementsSection />
  </section>
      </main>
      <AproposSection />
      <footer style={{ textAlign: 'center', color: '#888', fontSize: '0.95em', marginBottom: '1em' }}>
        Données issues du <a href="https://github.com/adriens/edb-noumea-data" target="_blank" rel="noopener noreferrer" style={{ color: '#0077b6', textDecoration: 'underline' }}>projet edb-noumea-data</a>.
      </footer>
    </div>
  );
}
