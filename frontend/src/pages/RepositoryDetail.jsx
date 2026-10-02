import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import client from '../api/client'

const STATUS_LABELS = {
  pending: 'Beklemede',
  running: 'Analiz ediliyor...',
  completed: 'Tamamlandı',
  failed: 'Başarısız',
}

export default function RepositoryDetail() {
  const { repositoryId } = useParams()
  const [pullRequests, setPullRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(null)

  useEffect(() => {
    load()
  }, [repositoryId])

  function load() {
    setLoading(true)
    client
      .get(`/api/repositories/${repositoryId}/pull_requests`)
      .then((res) => setPullRequests(res.data))
      .finally(() => setLoading(false))
  }

  async function analyze(pr) {
    setAnalyzing(pr.id)
    try {
      await client.post(`/api/repositories/${repositoryId}/pull_requests/${pr.id}/analyze`)
      setTimeout(load, 1500)
    } finally {
      setAnalyzing(null)
    }
  }

  if (loading) return <div className="centered-page">Pull request'ler yükleniyor...</div>

  return (
    <div className="page">
      <Link to="/" className="back-link">
        ← Repolar
      </Link>
      <h1>Açık Pull Request'ler</h1>

      {pullRequests.length === 0 && <p className="muted">Açık pull request bulunamadı.</p>}

      <ul className="pr-list">
        {pullRequests.map((pr) => (
          <li key={pr.id} className="pr-row">
            <div>
              <Link to={`/repositories/${repositoryId}/pull_requests/${pr.id}`} className="pr-title">
                #{pr.number} {pr.title}
              </Link>
              <div className="muted small">by {pr.author_login}</div>
            </div>
            <div className="pr-actions">
              {pr.review && <span className={`status status-${pr.review.status}`}>{STATUS_LABELS[pr.review.status]}</span>}
              <button className="btn btn-small" disabled={analyzing === pr.id} onClick={() => analyze(pr)}>
                {analyzing === pr.id ? 'Başlatılıyor...' : 'AI ile Analiz Et'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
