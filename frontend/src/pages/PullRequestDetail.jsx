import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Inbox,
  Info,
  Loader2,
  ShieldAlert,
  XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import client from '../api/client'

const SEVERITY_LABELS = { high: 'Yüksek', medium: 'Orta', low: 'Düşük' }
const SEVERITY_ICONS = { high: ShieldAlert, medium: AlertTriangle, low: Info }

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

  if (loading || !pr) {
    return (
      <div className="page">
        <div className="loading-row" style={{ marginTop: 60 }}>
          <div className="spinner" />
          Yükleniyor...
        </div>
      </div>
    )
  }

  const review = pr.review

  return (
    <div className="page">
      <Link to={`/repositories/${repositoryId}`} className="back-link">
        <ArrowLeft />
        Pull Request'ler
      </Link>

      <div className="header-row">
        <div>
          <h1>
            #{pr.number} {pr.title}
          </h1>
          <a href={pr.html_url} target="_blank" rel="noreferrer" className="subtitle-link">
            GitHub'da aç
            <ExternalLink />
          </a>
        </div>
        {review && (
          <span className={`status status-${review.status}`}>
            {review.status === 'running' && <Loader2 />}
            {review.status === 'completed' && <CheckCircle2 />}
            {review.status === 'failed' && <XCircle />}
            {review.status === 'pending' && <Loader2 />}
            {{ pending: 'Beklemede', running: 'Analiz ediliyor...', completed: 'Tamamlandı', failed: 'Başarısız' }[
              review.status
            ]}
          </span>
        )}
      </div>

      {!review && (
        <div className="empty-state">
          <Inbox />
          <strong>Henüz analiz edilmedi</strong>
          <span>Pull request listesinden "AI ile Analiz Et" butonuna basarak başlatabilirsin.</span>
        </div>
      )}

      {review && review.status === 'running' && (
        <div className="loading-row" style={{ marginTop: 24, justifyContent: 'flex-start' }}>
          <div className="spinner" />
          AI analizi sürüyor, bu sayfa otomatik güncellenecek...
        </div>
      )}

      {review && review.status === 'failed' && (
        <div className="empty-state" style={{ borderColor: 'var(--danger-border)' }}>
          <XCircle style={{ color: 'var(--danger)' }} />
          <strong>Analiz başarısız oldu</strong>
        </div>
      )}

      {review && review.status === 'completed' && (
        <div className="review">
          <h2>Özet</h2>
          <p className="review-summary">{review.summary}</p>

          <h2>Bulgular</h2>
          {review.findings?.length === 0 && (
            <div className="empty-state">
              <CheckCircle2 style={{ color: 'var(--ok)' }} />
              <strong>Belirgin bir sorun bulunamadı</strong>
            </div>
          )}
          <ul className="findings-list">
            {review.findings?.map((f, i) => {
              const SeverityIcon = SEVERITY_ICONS[f.severity] || Info
              return (
                <li key={i} className={`finding severity-${f.severity}`}>
                  <span className="finding-severity">
                    <SeverityIcon />
                    {SEVERITY_LABELS[f.severity] || f.severity}
                  </span>
                  <span className="finding-location">
                    {f.file}:{f.line}
                  </span>
                  <p>{f.comment}</p>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
