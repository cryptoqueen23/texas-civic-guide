type Props = { city: 'Copperas Cove' | 'Gatesville' };

export default function CouncilGuideBanner({ city }: Props) {
  const slug = city === 'Copperas Cove' ? 'copperas-cove' : 'gatesville';
  return (
    <aside aria-label="City Council citizen guide" style={{background:'#f4efe4',borderBottom:'1px solid #c9c0ad',padding:'12px 20px',fontFamily:'inherit'}}>
      <div style={{maxWidth:1180,margin:'0 auto',display:'flex',gap:16,alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}>
        <div>
          <strong style={{display:'block',fontSize:14}}>Speaking at City Council / Hablar ante el Concejo Municipal</strong>
          <span style={{fontSize:13,color:'#51564f'}}>Resident guide for {city} · Guía para residentes de {city}</span>
        </div>
        <a href={`/${slug}/council-guide`} style={{fontWeight:800,color:'#17251e',textDecoration:'underline',textUnderlineOffset:3}}>
          Open guide / Abrir guía →
        </a>
      </div>
    </aside>
  );
}
