import { Bot, ShieldCheck, Sparkles, Webhook, Zap } from 'lucide-react'
import { githubLoginUrl } from '../api/client'

function GithubMark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0.3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 0.3Z" />
    </svg>
  )
}

export default function Login() {
  return (
    <div className="login-shell">
      <div className="login-hero">
        <span className="login-hero-badge">
          <Sparkles />
          Gemini destekli kod incelemesi
        </span>
        <h1>
          Pull request'lerini <span className="gradient-text">AI ile incele</span>, yorumu otomatik bıraksın.
        </h1>
        <p>
          Reponu bağla, Gemini diff'i analiz etsin; bulguları saniyeler içinde panelde ve GitHub'daki PR
          yorumunda gör.
        </p>

        <div className="login-features">
          <div className="login-feature">
            <Webhook />
            <div>
              <strong>Otomatik tetikleme</strong>
              Repo bağlandığında webhook kurulur, her yeni PR otomatik analiz edilir.
            </div>
          </div>
          <div className="login-feature">
            <Bot />
            <div>
              <strong>Gemini ile analiz</strong>
              Gerçek bug, güvenlik açığı ve best-practice ihlallerine odaklanan özet ve bulgu listesi.
            </div>
          </div>
          <div className="login-feature">
            <ShieldCheck />
            <div>
              <strong>Güvenli erişim</strong>
              GitHub token'ların veritabanında şifreli saklanır, sadece senin repolarına erişilir.
            </div>
          </div>
        </div>
      </div>

      <div className="login-panel">
        <div className="card login-card">
          <h2>Giriş yap</h2>
          <p className="muted small">Devam etmek için GitHub hesabınla giriş yap.</p>
          <a className="btn btn-github" href={githubLoginUrl}>
            <GithubMark style={{ width: 18, height: 18 }} />
            GitHub ile Giriş Yap
          </a>
          <p className="muted small" style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={13} />
            Kurulum 30 saniye sürer, kredi kartı gerekmez.
          </p>
        </div>
      </div>
    </div>
  )
}
