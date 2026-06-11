const ITEMS = [
  'Imperator GT',
  '1,180 PS',
  '0–100 in 2.4 s',
  'Hand-laid carbon',
  'V12 · 9,200 rpm',
  'Velox RS',
  '820 kg downforce',
  'Noctis E',
  '1.9 s to 100',
]

export default function Marquee() {
  const row = (
    <div className="marquee__row">
      {ITEMS.map((item) => (
        <span className="marquee__item" key={item}>
          <i /> {item}
        </span>
      ))}
    </div>
  )
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {row}
        {row}
      </div>
    </div>
  )
}
