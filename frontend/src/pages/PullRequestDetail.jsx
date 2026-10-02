import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import client from '../api/client'

const SEVERITY_LABELS = { high: 'Yüksek', medium: 'Orta', low: 'Düşük' }

export default function PullRequestDetail() {
  const { repositoryId, pullRequestId } = useParams()
  const [pr, setPr] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
    const interval = setInterval(load, 4000)
    return () => clearInterval(interval)
  }, [pullRequestId])

  function load() {
    client
      .get(`/api/repositories/${repositoryId}/pull_requests/${pullRequestId}`)
      .then((res) => setPr(res.data))
      .finally(() => setLoading(false))
  }

  if (loading || !pr) return <div className="centered-page">Yükleniyor...</div>

  const review = pr.review

  return (
    <div className="page">
      <Link to={`/repositories/${repositoryId}`} className="back-link">
        ← Pull Request'ler
      </Link>
      <h1>
        #{pr.number} {pr.title}
      </h1>
      <a href={pr.html_url} target="_blank" rel="noreferrer" className="muted small">
        GitHub'da aç ↗
      </a>

      {!review && <p className="muted">Henüz analiz edilmedi.</p>}

      {review && review.status === 'running' && <p className="muted">AI analizi sürüyor...</p>}
      {review && review.status === 'failed' && <p className="error">Analiz başarısız oldu.</p>}

      {review && review.status === 'completed' && (
        <div className="review">
          <h2>Özet</h2>
          <p>{review.summary}</p>

          <h2>Bulgular</h2>
          {review.findings?.length === 0 && <p className="muted">Belirgin bir sorun bulunamadı.</p>}
          <ul className="findings-list">
            {review.findings?.map((f, i) => (
              <li key={i} className={`finding severity-${f.severity}`}>
                <span className="finding-severity">{SEVERITY_LABELS[f.severity] || f.severity}</span>
                <span className="finding-location">
                  {f.file}:{f.line}
                </span>
                <p>{f.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
