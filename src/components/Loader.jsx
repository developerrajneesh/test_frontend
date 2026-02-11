export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="loader" role="status" aria-live="polite" aria-busy="true">
      <div className="spinner" aria-hidden="true" />
      <div className="loader-label">{label}</div>
    </div>
  )
}

