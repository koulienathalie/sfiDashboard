import React, { useEffect, useState } from 'react'
import { Box, Grid, Paper, Avatar, Typography, TextField, Button, CircularProgress, Snackbar, Alert, Card, CardContent, Divider, alpha, CardHeader } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import SaveIcon from '@mui/icons-material/Save'
import EditIcon from '@mui/icons-material/Edit'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'
import EmailIcon from '@mui/icons-material/Email'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState(null)
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/me')
        if (!res.ok) throw new Error('no /api/me')
        const data = await res.json()
        setProfile(data.user || data)
      } catch (err) {
        // fallback: minimal placeholder
        setProfile({ firstName: '', lastName: '', email: '', role: 'user', createdAt: new Date().toISOString() })
        setNotice({ severity: 'info', message: 'Impossible de charger le profil — mode dégradé' })
      } finally { setLoading(false) }
    }
    load()
  }, [])

  async function save() {
    setSaving(true)
    try {
      const body = { firstName: profile.firstName, lastName: profile.lastName, email: profile.email }
      if (password) {
        if (password !== passwordConfirm) throw new Error('Les mots de passe ne correspondent pas')
        if (password.length < 6) throw new Error('Le mot de passe doit contenir au moins 6 caractères')
        body.password = password
      }
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/me', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'save failed')
      }
      const updated = await res.json()
      setProfile(updated.user || updated)
      setPassword('')
      setPasswordConfirm('')
      setEditMode(false)
      setNotice({ severity: 'success', message: 'Profil mis à jour avec succès' })
    } catch (err) {
      setNotice({ severity: 'error', message: err.message || 'Échec enregistrement du profil' })
    } finally { setSaving(false) }
  }

  async function signOut() {
    try {
      await fetch((import.meta.env.VITE_API_URL || '') + '/auth/signout', { method: 'POST' })
      // best-effort: reload to clear state
      window.location.href = '/login'
    } catch (err) {
      setNotice({ severity: 'error', message: 'Impossible de se déconnecter' })
    }
  }

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, pt: { xs: 10, sm: 9 }, mt: { xs: 2, sm: 1 } }}><CircularProgress sx={{ color: '#02647E' }} /></Box>

  const fullName = ((profile?.firstName || '') + (profile?.lastName ? ' ' + profile.lastName : '') || 'Utilisateur').trim()
  const initials = fullName.split(' ').map(n => n.charAt(0).toUpperCase()).join('').slice(0, 2)
  const createdDate = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, pt: { xs: 10, sm: 9, md: 8 }, mt: { xs: 2, sm: 1 }, minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        {/* Header Card with Profile Overview */}
        <Card sx={{ mb: 3, bgcolor: '#fff', boxShadow: '0 2px 8px rgba(2, 100, 126, 0.08)', border: `1px solid ${alpha('#02647E', 0.1)}` }}>
          <Box sx={{
            background: `linear-gradient(135deg, #02647E 0%, #72BDD1 100%)`,
            p: { xs: 2, sm: 3 },
            color: 'white',
            display: 'flex',
            alignItems: 'flex-end',
            gap: 2
          }}>
            <Avatar sx={{
              width: 80,
              height: 80,
              bgcolor: alpha('#fff', 0.3),
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 700,
              border: '3px solid rgba(255,255,255,0.5)'
            }}>
              {initials}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>{fullName}</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>{profile?.email}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, bgcolor: alpha('#fff', 0.2), px: 1, py: 0.5, borderRadius: 1 }}>
                  {profile?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {!editMode && (
                <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditMode(true)} sx={{ borderColor: '#fff', color: '#fff', '&:hover': { bgcolor: alpha('#fff', 0.1) } }}>
                  Modifier
                </Button>
              )}
              <Button variant="outlined" startIcon={<LogoutIcon />} onClick={signOut} sx={{ borderColor: '#fff', color: '#fff', '&:hover': { bgcolor: alpha('#fff', 0.1) } }}>
                Déconnexion
              </Button>
            </Box>
          </Box>
        </Card>

        {/* Profile Information Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Informations Personnelles */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', boxShadow: '0 2px 8px rgba(2, 100, 126, 0.08)', border: `1px solid ${alpha('#02647E', 0.1)}` }}>
              <CardHeader
                title="Informations Personnelles"
                titleTypographyProps={{ variant: 'h6', sx: { color: '#02647E', fontWeight: 700 } }}
                avatar={<PersonIcon sx={{ color: '#02647E' }} />}
                sx={{ pb: 1.5 }}
              />
              <Divider />
              <CardContent>
                {editMode ? (
                  <Box>
                    <TextField
                      label="Prénom"
                      fullWidth
                      value={profile?.firstName || ''}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      sx={{ mb: 2 }}
                      variant="outlined"
                      size="small"
                    />
                    <TextField
                      label="Nom"
                      fullWidth
                      value={profile?.lastName || ''}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      sx={{ mb: 2 }}
                      variant="outlined"
                      size="small"
                    />
                    <TextField
                      label="Email"
                      fullWidth
                      type="email"
                      value={profile?.email || ''}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>Prénom</Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500, color: '#02647E' }}>{profile?.firstName || '—'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>Nom</Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500, color: '#02647E' }}>{profile?.lastName || '—'}</Typography>
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 14, color: '#72BDD1' }} />
                        <Typography variant="caption" sx={{ color: '#666', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>Email</Typography>
                      </Box>
                      <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500, color: '#02647E', fontFamily: 'monospace', fontSize: '0.9rem' }}>{profile?.email || '—'}</Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Informations du Compte */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', boxShadow: '0 2px 8px rgba(2, 100, 126, 0.08)', border: `1px solid ${alpha('#02647E', 0.1)}` }}>
              <CardHeader
                title="Compte et Accès"
                titleTypographyProps={{ variant: 'h6', sx: { color: '#02647E', fontWeight: 700 } }}
                avatar={<LockIcon sx={{ color: '#02647E' }} />}
                sx={{ pb: 1.5 }}
              />
              <Divider />
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#666', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>Rôle</Typography>
                    <Box sx={{ mt: 0.5, display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#02647E' }}>
                        {profile?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </Typography>
                      <Typography variant="caption" sx={{
                        bgcolor: profile?.role === 'admin' ? alpha('#E05B5B', 0.2) : alpha('#72BDD1', 0.2),
                        color: profile?.role === 'admin' ? '#E05B5B' : '#02647E',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 600
                      }}>
                        {profile?.role === 'admin' ? 'PRIVILÉGIÉ' : 'STANDARD'}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 14, color: '#72BDD1' }} />
                      <Typography variant="caption" sx={{ color: '#666', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>Membre depuis</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500, color: '#02647E' }}>{createdDate}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Security / Password Change Card */}
        {editMode && (
          <Card sx={{ boxShadow: '0 2px 8px rgba(2, 100, 126, 0.08)', border: `1px solid ${alpha('#02647E', 0.1)}`, mb: 3 }}>
            <CardHeader
              title="Changer le mot de passe (Optionnel)"
              titleTypographyProps={{ variant: 'h6', sx: { color: '#02647E', fontWeight: 700 } }}
              avatar={<LockIcon sx={{ color: '#02647E' }} />}
              sx={{ pb: 1.5 }}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nouveau mot de passe"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                    size="small"
                    helperText="Laissez vide pour conserver le mot de passe actuel"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Confirmer mot de passe"
                    type="password"
                    fullWidth
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        {editMode && (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => {
                setEditMode(false)
                setPassword('')
                setPasswordConfirm('')
              }}
              disabled={saving}
              sx={{ color: '#02647E', borderColor: '#02647E' }}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={save}
              disabled={saving}
              sx={{
                background: `linear-gradient(135deg, #02647E 0%, #72BDD1 100%)`,
                color: '#fff',
                fontWeight: 600
              }}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </Box>
        )}

        {/* Snackbar Notifications */}
        <Snackbar open={!!notice} autoHideDuration={6000} onClose={() => setNotice(null)}>
          {notice ? <Alert onClose={() => setNotice(null)} severity={notice.severity} sx={{ width: '100%' }}>{notice.message}</Alert> : null}
        </Snackbar>
      </Box>
    </Box>
  )
}
