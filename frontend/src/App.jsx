import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { FiArrowDown, FiArrowLeft, FiArrowRight, FiArrowUpRight, FiCheck, FiDownload, FiImage, FiLinkedin, FiLock, FiMail, FiPlus, FiShield, FiTrash2, FiUploadCloud, FiUser, FiX } from 'react-icons/fi'
import { motion } from 'framer-motion'
import './App.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const prettyBytes = (bytes) => bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

function Brand({ light = false }) {
  return <a className={`brand ${light ? 'brand-light' : ''}`} href="/" aria-label="Albotech home"><span className="brand-mark"><i /><i /><i /><i /></span><span>albotech<span className="brand-period">.</span></span></a>
}

function CollectionPage() {
  const inputRef = useRef(null)
  const submittingRef = useRef(false)
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState('')
  const [busy, setBusy] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [dragging, setDragging] = useState(false)
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const chooseFile = (file) => {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) return toast.error('Choose a JPEG, PNG, WebP, or AVIF photo.')
    if (file.size > 12 * 1024 * 1024) return toast.error('Your photo must be 12 MB or smaller.')
    setPhoto(file)
    setPreview((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(file) })
  }

  const submit = async (event) => {
    event.preventDefault()
    if (submittingRef.current) return
    if (!photo) return toast.error('Please add a profile photo to continue.')
    submittingRef.current = true
    setBusy(true)
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    form.set('photo', photo)
    let responseData
    try {
      const { data } = await axios.post(`${API}/employees`, form)
      responseData = data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not submit your profile. Please try again.')
      setBusy(false)
      submittingRef.current = false
      return
    }

    // React clears currentTarget after the event handler yields; keep the form
    // element itself so a successful response cannot fall into the error path.
    formElement.reset()
    setPhoto(null)
    setPreview('')
    setSubmitted(true)
    toast.success(responseData.message || 'Profile submitted successfully.')
    setBusy(false)
    submittingRef.current = false
  }

  return <main className="site-shell">
    <header className="topbar"><Brand /><div className="topbar-right"><span className="topbar-note"><span className="status-dot" />People make progress</span><a className="admin-link" href="/admin">Admin <FiArrowUpRight /></a></div></header>
    <div className="page-grid">
      <section className="intro-panel">
        <div className="intro-copy">
          <div className="eyebrow"><span className="eyebrow-line" />THE PEOPLE BEHIND PROGRESS</div>
          <h1>Innovation<br />Starts With <em>People</em></h1>
          <p className="intro-lede">Every great innovation begins with great people. Share your professional details and a high-quality profile photograph to be featured on our company website.</p>
          <div className="intro-rule" />
          <div className="intro-foot"><span className="foot-index">01 <i /> 03</span><span>YOUR STORY, BEAUTIFULLY TOLD</span><FiArrowDown /></div>
        </div>
        <div className="orbital-art" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
          <div className="orbital-center"><span className="orbital-symbol">a<span>.</span></span></div>
          <span className="orbit-label orbit-label-top">HUMAN<br />INGENUITY</span><span className="orbit-label orbit-label-bottom">BUILT TOGETHER</span>
          <span className="orbit-node node-one" /><span className="orbit-node node-two" /><span className="orbit-node node-three" />
        </div>
        <div className="side-note"><span>ALBOTECH · 2025</span><i /></div>
      </section>

      <section className="form-panel">
        {submitted ? <motion.div className="success-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="success-mark"><FiCheck /></div><div className="eyebrow"><span className="eyebrow-line" />PROFILE RECEIVED</div><h2>Thank you for<br />being <em>part of it.</em></h2><p>Your details are with our team. We’re looking forward to sharing your story.</p><button type="button" className="text-button" onClick={() => setSubmitted(false)}>Submit another profile <FiArrowRight /></button>
        </motion.div> : <motion.div className="form-wrap" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="form-heading"><div><div className="eyebrow"><span className="eyebrow-line" />PROFILE DETAILS</div><h2>Make your mark<span>.</span></h2></div><span className="step-count">01 <i /> 01</span></div>
          <p className="form-caption">A few details to introduce yourself to the world.</p>
          <form onSubmit={submit}>
            <div className="field-row"><label className="field"><span>Full name <b>*</b></span><div className="input-shell"><FiUser /><input name="fullName" placeholder="e.g. Alex Morgan" maxLength="100" required /></div></label><label className="field"><span>Designation / position <b>*</b></span><div className="input-shell"><FiPlus /><input name="designation" placeholder="e.g. Product Designer" maxLength="120" required /></div></label></div>
            <div className="field photo-field"><div className="field-label">Profile photograph <b>*</b><span className="field-hint">A clear, well-lit portrait works best</span></div>
              {photo ? <div className="photo-preview"><img src={preview} alt="Selected profile preview" /><div className="photo-details"><strong>{photo.name}</strong><span>{prettyBytes(photo.size)} · Original quality preserved</span><button type="button" className="remove-photo" onClick={() => { setPhoto(null); setPreview('') }}><FiX /> Remove</button></div><span className="photo-check"><FiCheck /></span></div> : <button type="button" className={`upload-zone ${dragging ? 'is-dragging' : ''}`} onClick={() => inputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(e) => { e.preventDefault(); setDragging(false); chooseFile(e.dataTransfer.files[0]) }}><span className="upload-icon"><FiUploadCloud /></span><span className="upload-text"><strong>Click to upload <i /> or drag and drop</strong><small>JPEG, PNG, WebP or AVIF · up to 12 MB</small></span><span className="upload-browse">Browse files <FiArrowRight /></span></button>}
              <input ref={inputRef} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => chooseFile(e.target.files?.[0])} />
            </div>
            <div className="field-row"><label className="field"><span>Professional email <i className="optional">OPTIONAL</i></span><div className="input-shell"><FiMail /><input name="email" type="email" placeholder="you@company.com" maxLength="254" /></div></label><label className="field"><span>LinkedIn profile <i className="optional">OPTIONAL</i></span><div className="input-shell"><FiLinkedin /><input name="linkedin" type="url" placeholder="linkedin.com/in/yourname" maxLength="500" /></div></label></div>
            <div className="form-bottom"><span className="privacy-note"><FiShield /> Your information is handled with care.</span><button className="submit-button" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Submit profile'}<span><FiArrowRight /></span></button></div>
          </form>
          <div className="form-legal">By submitting, you confirm these details are accurate and consent to being featured.</div>
        </motion.div>}
      </section>
    </div>
    <footer className="site-footer"><span>© 2025 ALBOTECH. BUILT FOR WHAT’S NEXT.</span><span>PEOPLE FIRST <i /> ALWAYS FORWARD <FiArrowUpRight /></span></footer>
    <Toaster position="top-right" toastOptions={{ duration: 3800 }} />
  </main>
}

function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem('albotech_admin') || '')
  const [password, setPassword] = useState('')
  const [employees, setEmployees] = useState([])
  const [portraits, setPortraits] = useState({})
  const [loading, setLoading] = useState(false)
  const [busyId, setBusyId] = useState('')

  const loadEmployees = useCallback(async (authToken = token) => {
    setLoading(true)
    try {
      const headers = { Authorization: `Bearer ${authToken}` }
      const { data } = await axios.get(`${API}/employees`, { headers })
      setEmployees(data)
      const entries = await Promise.all(data.map(async (employee) => {
        try { const image = await axios.get(`${API}/employees/${employee.id}/image`, { headers, responseType: 'blob' }); return [employee.id, URL.createObjectURL(image.data)] }
        catch { return [employee.id, ''] }
      }))
      setPortraits((previous) => { Object.values(previous).forEach((url) => { if (url) URL.revokeObjectURL(url) }); return Object.fromEntries(entries) })
    }
    catch (error) { if (error.response?.status === 401) { sessionStorage.removeItem('albotech_admin'); setToken('') }; toast.error(error.response?.data?.message || 'Could not load submissions.') }
    finally { setLoading(false) }
  }, [token])
  // Load private records when a saved admin session is restored or renewed.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (token) void loadEmployees(token) }, [loadEmployees, token])

  const signIn = async (event) => {
    event.preventDefault()
    try { const { data } = await axios.post(`${API}/admin/login`, { password }); sessionStorage.setItem('albotech_admin', data.token); setToken(data.token); setPassword('') }
    catch (error) { toast.error(error.response?.data?.message || 'Could not sign in.') }
  }
  const downloadImage = async (employee) => {
    setBusyId(employee.id)
    try { const { data } = await axios.get(`${API}/employees/${employee.id}/image`, { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' }); const href = URL.createObjectURL(data); const a = document.createElement('a'); a.href = href; a.download = employee.image.originalName; a.click(); URL.revokeObjectURL(href) }
    catch { toast.error('Could not download this photograph.') }
    finally { setBusyId('') }
  }
  const deleteEmployee = async (employee) => {
    if (!window.confirm(`Delete ${employee.fullName}’s submission permanently?`)) return
    setBusyId(employee.id)
    try { await axios.delete(`${API}/employees/${employee.id}`, { headers: { Authorization: `Bearer ${token}` } }); setEmployees((list) => list.filter((item) => item.id !== employee.id)); if (portraits[employee.id]) URL.revokeObjectURL(portraits[employee.id]); setPortraits((list) => { const next = { ...list }; delete next[employee.id]; return next }); toast.success('Submission deleted.') }
    catch { toast.error('Could not delete this submission.') }
    finally { setBusyId('') }
  }

  return <main className="admin-shell"><header className="admin-topbar"><Brand /><a className="back-link" href="/"><FiArrowLeft /> Collection form</a></header>
    {!token ? <section className="login-area"><div className="login-card"><span className="login-icon"><FiLock /></span><div className="eyebrow"><span className="eyebrow-line" />PRIVATE WORKSPACE</div><h1>Welcome <em>back.</em></h1><p>Sign in to review employee profiles and manage submissions.</p><form onSubmit={signIn}><label className="field"><span>Admin password</span><div className="input-shell"><FiLock /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" required /></div></label><button className="submit-button login-submit">Sign in securely <span><FiArrowRight /></span></button></form><div className="secure-note"><FiShield /> Protected admin access</div></div></section> : <section className="dashboard"><div className="dashboard-title"><div><div className="eyebrow"><span className="eyebrow-line" />PEOPLE OPERATIONS</div><h1>Employee <em>profiles.</em></h1><p>Review and manage profile submissions from your team.</p></div><button className="logout-button" onClick={() => { sessionStorage.removeItem('albotech_admin'); setToken(''); setEmployees([]) }}>Sign out <FiArrowUpRight /></button></div>
      <div className="dashboard-stats"><div><span>SUBMISSIONS</span><strong>{employees.length.toString().padStart(2, '0')}</strong></div><div><span>PHOTO QUALITY</span><strong>Original files</strong></div><div><span>ACCESS</span><strong><i className="status-dot" />Secure</strong></div></div>
      <div className="table-heading"><div><h2>All submissions</h2><span>{employees.length} {employees.length === 1 ? 'profile' : 'profiles'}</span></div><button className="refresh-button" onClick={() => loadEmployees()}><FiArrowRight /> Refresh</button></div>
      {loading ? <div className="empty-state">Loading profiles…</div> : employees.length === 0 ? <div className="empty-state"><FiImage /><strong>No submissions yet</strong><span>New employee profiles will appear here.</span></div> : <div className="employee-list">{employees.map((employee, index) => <motion.article className="employee-row" key={employee.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.04, 0.3) }}>
        <div className="employee-identity">{portraits[employee.id] ? <img className="employee-photo" src={portraits[employee.id]} alt={`${employee.fullName} profile`} /> : <div className="avatar-placeholder"><FiUser /></div>}<div><strong>{employee.fullName}</strong><span>{employee.designation}</span></div></div><div className="employee-contact">{employee.email ? <a href={`mailto:${employee.email}`}><FiMail />{employee.email}</a> : <span className="muted">No email provided</span>}{employee.linkedin ? <a href={employee.linkedin} target="_blank" rel="noreferrer"><FiLinkedin />LinkedIn profile <FiArrowUpRight /></a> : <span className="muted">No LinkedIn provided</span>}</div><div className="employee-actions"><button className="download-button" disabled={busyId === employee.id} onClick={() => downloadImage(employee)}><FiDownload /> Download original</button><button className="delete-button" title={`Delete ${employee.fullName}`} disabled={busyId === employee.id} onClick={() => deleteEmployee(employee)}><FiTrash2 /></button></div>
      </motion.article>)}</div>}
    </section>}
    <footer className="site-footer admin-footer"><span>© 2025 ALBOTECH. BUILT FOR WHAT’S NEXT.</span><span>ADMIN WORKSPACE <FiShield /></span></footer><Toaster position="top-right" />
  </main>
}

export default function App() { return window.location.pathname.startsWith('/admin') ? <AdminPage /> : <CollectionPage /> }
