function CompanyStats({ stats }) {
  return (
    <section className="bg-light py-5" aria-labelledby="company-stats-title">
      <div className="container">
        <h2 className="visually-hidden" id="company-stats-title">JA Joyería en cifras</h2>
        <dl className="row g-4 text-center mb-0">
          {stats.map(({ label, value }) => (
            <div className="col-6 col-lg-3 d-flex flex-column" key={label}>
              <dt className="fw-normal">{label}</dt>
              <dd className="display-5 fw-bold order-first mb-2">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default CompanyStats
