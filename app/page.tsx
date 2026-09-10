const cities = [
  { name: 'Copperas Cove', href: '/copperas-cove', note: 'Charter, meetings, records, services and resident rights' },
  { name: 'Gatesville', href: '/gatesville', note: 'Charter, meetings, records, services and resident rights' },
];

export default function Home() {
  return (
    <main id="main">
      <header className="masthead">
        <div className="brand">TEXAS <span>CIVIC GUIDE</span></div>
        <div className="utility">Independent civic education · English / Español</div>
      </header>
      <section className="state-hero">
        <p className="eyebrow">LOCAL GOVERNMENT, WITHOUT THE MAZE</p>
        <h1>Understand your city.<br />Find the record.<br /><em>Know your rights.</em></h1>
        <p className="lede">A resident-first guide to Texas city government, built around the questions people actually have.</p>
        <div className="city-picker" aria-label="Choose your city">
          {cities.map(city => <a key={city.name} href={city.href}><strong>{city.name}</strong><span>{city.note}</span><b aria-hidden="true">→</b></a>)}
        </div>
      </section>
      <section className="principle">
        <p>THE RULE BEHIND EVERYTHING HERE</p>
        <h2>No source = no answer.</h2>
        <span>Official city and Texas sources remain authoritative. We make them easier to find, read and understand.</span>
      </section>
      <footer>Independent civic education resource · Not affiliated with the City of Copperas Cove or City of Gatesville · <a href="https://www.tree.phoenixsecuritas.com">Phoenix Securitas</a></footer>
    </main>
  );
}
