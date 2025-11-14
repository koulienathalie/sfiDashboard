import React, { useEffect, useState } from 'react'
import { Box, Card, CardHeader, CardContent, TextField, Button, CircularProgress, Snackbar, Alert, Stack } from '@mui/material'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState(null)
  const [settings, setSettings] = useState({ apiBase: '', pollMs: 2000 })

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch('/api/settings')
        if (!res.ok) throw new Error('no endpoint')
        const data = await res.json()
        setSettings(Object.assign({}, settings, data))
      } catch (err) {
        // fallback to localStorage
        const local = localStorage.getItem('app:settings')
        if (local) setSettings(JSON.parse(local))
        setNotice({ severity: 'info', message: 'Chargement via fallback (localStorage) — endpoint /api/settings absent' })
      } finally { setLoading(false) }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onChange(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
      if (!res.ok) throw new Error('save failed')
      setNotice({ severity: 'success', message: 'Paramètres enregistrés' })
    } catch (err) {
      // fallback: save to localStorage
      localStorage.setItem('app:settings', JSON.stringify(settings))
      setNotice({ severity: 'warning', message: 'Enregistré localement (fallback). Configurez /api/settings pour persistance.' })
    } finally { setSaving(false) }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardHeader title="Paramètres" subheader="Configuration runtime (frontend)" />
        <CardContent>
          {loading ? <CircularProgress /> : (
            <Stack spacing={2} sx={{ maxWidth: 800 }}>
              <TextField label="API Base URL" value={settings.apiBase || ''} onChange={(e) => onChange('apiBase', e.target.value)} fullWidth />
              <TextField label="Poll interval (ms)" value={settings.pollMs || ''} onChange={(e) => onChange('pollMs', Number(e.target.value) || 0)} type="number" />
              <Box>
                <Button variant="contained" onClick={save} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Button>
              </Box>
            </Stack>
          )}
        </CardContent>
      </Card>

      <Snackbar open={!!notice} autoHideDuration={6000} onClose={() => setNotice(null)}>
        {notice ? <Alert onClose={() => setNotice(null)} severity={notice.severity} sx={{ width: '100%' }}>{notice.message}</Alert> : null}
      </Snackbar>
    </Box>
  )
}
