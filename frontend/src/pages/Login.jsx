import { githubLoginUrl } from '../api/client'

export default function Login() {
  return (
    <div className="centered-page">
      <div className="card">
        <h1>AI PR Reviewer</h1>
        <p>GitHub pull request'lerini AI ile otomatik incele.</p>
        <a className="btn btn-github" href={githubLoginUrl}>
          GitHub ile Giriş Yap
        </a>
      </div>
    </div>
  )
}
