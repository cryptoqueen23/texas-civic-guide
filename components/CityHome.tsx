type CityHomeProps = { city: string; subtitle: string; officialUrl: string };

const actions = [
  ['I have a city problem', 'Find the department that handles it', '#help'],
  ['What is Council doing?', 'Meetings, agendas, minutes and video', '#meetings'],
  ['Where is the money going?', 'Budgets, debt, audits and projects', '#money'],
  ['I need a public record', 'Find it first, then build a focused request', '#records'],
];

const nav = ['I Need Help','Your City Hall','Meetings','Follow the Money','Documents','Your Rights','Charter','Open Meetings Act','Public Information Act','Official Sources'];

export default function CityHome({ city, subtitle, officialUrl }: CityHomeProps) {
  return <main id="main">
    <header className="city-header">
      <a className="wordmark" href="/">TEXAS <span>CIVIC GUIDE</span></a>
      <nav aria-label="Utility"><a href="#sources">Sources</a><a href="#accessibility">Accessibility</a><button type="button">ESPAÑOL</button></nav>
    </header>
    <div className="city-label"><span>YOUR CITY</span><strong>{city}</strong><small>{subtitle}</small></div>
    <section className="resident-hero">
      <div className="hero-copy"><p className="eyebrow">CITY HALL SHOULD NOT REQUIRE A TRANSLATOR</p><h1>What do you need<br/>from <em>your city?</em></h1><p>Start with the problem, question or record. We’ll point you toward the official answer.</p></div>
      <form className="big-search" action="#search"><label htmlFor="city-search">Search {city}</label><div><input id="city-search" name="q" placeholder="water bill, 2025 audit, pothole, council agenda…"/><button>Search</button></div><small>Searches official services, records and civic guides.</small></form>
    </section>
    <div className="city-layout">
      <aside><p>EXPLORE CITY HALL</p>{nav.map((item,i)=><a key={item} href={'#'+['help','hall','meetings','money','documents','rights','charter','oma','pia','sources'][i]}>{item}<span>→</span></a>)}</aside>
      <div className="city-content">
        <section className="start"><p className="section-kicker">START WITH WHAT YOU NEED</p><h2>Skip the department chart.</h2><div className="action-list">{actions.map(([title,desc,href],i)=><a href={href} key={title}><b>0{i+1}</b><div><strong>{title}</strong><span>{desc}</span></div><i>→</i></a>)}</div></section>
        <section id="help" className="editorial-section"><p className="section-kicker">WHO HANDLES MY PROBLEM?</p><h2>Get to the right desk the first time.</h2><p>Water and sewer · utility billing · trash · streets and potholes · drainage · permits · inspections · code enforcement · animal control · police non-emergency · fire · parks · municipal court · public records · elections · finance · HR · economic development · after-hours emergencies</p></section>
        <section id="meetings" className="editorial-section split"><div><p className="section-kicker">WHAT IS COUNCIL DOING?</p><h2>Meetings without the scavenger hunt.</h2><p>Next meeting, agenda, packet, minutes, video, how to speak and the Open Meetings Act rules that matter to residents.</p></div><div className="source-note"><b>Official first</b><p>Every meeting link and factual summary should trace back to the city or State of Texas.</p></div></section>
        <section id="money" className="editorial-section"><p className="section-kicker">FOLLOW THE MONEY</p><h2>Numbers need receipts.</h2><p>Tax rates, budgets, debt, bonds, certificates of obligation, enterprise funds, audits, contracts and capital projects, with an official source attached to every number.</p></section>
        <section id="records" className="dark-section"><p>FIND IT BEFORE YOU PIR IT</p><h2>The record may already be public.</h2><span>Search budgets, audits, contracts, agendas, minutes, ordinances, resolutions, reports and campaign finance before writing a Public Information Act request.</span><a href="#documents">Search existing records →</a></section>
        <section id="rights" className="editorial-section"><p className="section-kicker">YOUR RIGHTS</p><h2>Texas law, translated into human.</h2><p>Learn the Charter, Open Meetings Act and Public Information Act from shared statewide legal modules, then see how they apply to {city}.</p></section>
        <section id="sources" className="sources"><strong>Official sources remain authoritative.</strong><a href={officialUrl}>Visit the official {city} website ↗</a></section>
      </div>
    </div>
    <footer><div><b>Texas Civic Guide</b><span>Independent civic education resource</span></div><p>Not affiliated with the City of Copperas Cove or City of Gatesville.</p><nav><a href="#sources">Sources</a><a href="#accessibility">Accessibility</a><a href="#">Español</a><a href="#">Disclaimer</a><a href="https://www.tree.phoenixsecuritas.com">Phoenix Securitas ↗</a></nav></footer>
  </main>;
}
