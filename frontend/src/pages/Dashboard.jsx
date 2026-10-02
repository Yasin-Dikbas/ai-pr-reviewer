import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'

export default function Dashboard() {
  const [repos, setRepos] = useState([])
  const [connected, setConnected] = useState([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(null)

  useEffect(() => {
    loadRepos()
  }, [])

  function loadRepos() {
    setLoading(true)
    Promise.all([client.get('/api/repositories/github'), client.get('/api/repositories')])
      .then(([githubRes, connectedRes]) => {
        setRepos(githubRes.data)
        setConnected(connectedRes.data)
      })
      .finally(() => setLoading(false))
  }

  async function connect(repo) {
    setConnecting(repo.id)
    try {
      await client.post('/api/repositories', { github_repo_id: repo.id, full_name: repo.full_name })
      loadRepos()
    } finally {
      setConnecting(null)
    }
  }

  function localIdFor(repo) {
    return connected.find((c) => c.github_repo_id === repo.id)?.id
  }

  if (loading) return <div className="centered-page">Repolar yükleniyor...</div>

  return (
    <div className="page">
      <h1>Repolarım</h1>
      <p className="muted">
        Analiz edilmesini istediğin repoyu bağla. Bağladığında GitHub'da otomatik webhook oluşturulur,
        yeni PR açıldığında AI incelemesi tetiklenir.
      </p>

      <ul className="repo-list">
        {repos.map((repo) => (
          <li key={repo.id} className="repo-row">
            <span className="repo-name">
              {repo.full_name} {repo.private && <span className="badge">private</span>}
            </span>
            {repo.connected ? (
              <Link to={`/repositories/${localIdFor(repo)}`} className="btn btn-small">
                Pull Request'leri Gör
              </Link>
            ) : (
              <button className="btn btn-small" disabled={connecting === repo.id} onClick={() => connect(repo)}>
                {connecting === repo.id ? 'Bağlanıyor...' : 'Bağla'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
