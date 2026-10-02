import { ArrowLeft, CheckCircle2, Clock, GitPullRequest, Inbox, Loader2, Sparkles, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import client from '../api/client'

const STATUS_LABELS = {
  pending: 'Beklemede',
  running: 'Analiz ediliyor...',
  completed: 'Tamamlandı',
  failed: 'Başarısız',
}

const STATUS_ICONS = {
  pending: Clock,
  running: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
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

  return (
    <div className="page">
      <Link to="/" className="back-link">
        <ArrowLeft />
        Repolar
      </Link>
      <h1>Açık Pull Request'ler</h1>

      {loading && (
        <div className="pr-list">
          <div className="skeleton" />
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      )}

      {!loading && pullRequests.length === 0 && (
        <div className="empty-state">
          <Inbox />
          <strong>Açık pull request bulunamadı</strong>
          <span>Bu repoda şu anda açık bir PR yok.</span>
        </div>
      )}

      {!loading && pullRequests.length > 0 && (
        <ul className="pr-list">
          {pullRequests.map((pr) => {
            const StatusIcon = pr.review ? STATUS_ICONS[pr.review.status] : null
            return (
              <li key={pr.id} className="pr-row">
                <div>
                  <Link to={`/repositories/${repositoryId}/pull_requests/${pr.id}`} className="pr-title">
                    <GitPullRequest size={15} style={{ color: 'var(--text-dim)' }} />
                    #{pr.number} {pr.title}
                  </Link>
                  <div className="muted small">by {pr.author_login}</div>
                </div>
                <div className="pr-actions">
                  {pr.review && (
                    <span className={`status status-${pr.review.status}`}>
                      <StatusIcon />
                      {STATUS_LABELS[pr.review.status]}
                    </span>
                  )}
                  {pr.review?.status === 'completed' && (
                    <Link to={`/repositories/${repositoryId}/pull_requests/${pr.id}`} className="btn btn-small btn-primary">
                      Sonucu Gör
                    </Link>
                  )}
                  <button className="btn btn-small" disabled={analyzing === pr.id} onClick={() => analyze(pr)}>
                    <Sparkles />
                    {analyzing === pr.id ? 'Başlatılıyor...' : 'AI ile Analiz Et'}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
