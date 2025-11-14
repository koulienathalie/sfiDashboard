import { Grid, Typography, Box, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import socket from '../../socketClient'

export function ServiceView() {
	const [protocols, setProtocols] = useState([])
	const [applications, setApplications] = useState([])
	const [loading, setLoading] = useState(false)

	async function load() {
		setLoading(true)
		try {
			const to = new Date()
			const from = new Date(to.getTime() - 1000 * 60 * 60) // last 1h
			const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api/protocols', {
				method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ timeRange: { from: from.toISOString(), to: to.toISOString() }, size: 10 }),
			})
			const data = await res.json()
			if (res.ok) {
				setProtocols(data.protocols || [])
				setApplications(data.applications || data.ports || [])
			}
		} catch (err) {
			console.error('ServiceView load', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => { load() }, [])

	useEffect(() => {
		const handler = (payload) => {
			try {
				if (payload?.topProtocols) setProtocols(payload.topProtocols)
				if (payload?.topApplications) setApplications(payload.topApplications)
			} catch (err) {
				console.debug('ServiceView socket handler', err)
			}
		}

		socket.on('top-bandwidth', handler)
		return () => { socket.off('top-bandwidth', handler) }
	}, [])

	if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>

	return (
		<Grid container spacing={2}>
			<Grid item xs={6}>
				<Typography fontWeight={600} sx={{ mb: 1 }}>Top Protocoles</Typography>
				{protocols.map((p) => (
					<Box key={p.key} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'background.paper', borderRadius: 1, mb: 1 }}>
						<Typography fontWeight={700}>{p.key}</Typography>
						<Typography>{((p.bytes?.value || 0) / 1024 / 1024).toFixed(2)} MB</Typography>
					</Box>
				))}
			</Grid>

			<Grid item xs={6}>
				<Typography fontWeight={600} sx={{ mb: 1 }}>Top Applications / Ports</Typography>
				{applications.map((a) => (
					<Box key={a.key || a.name} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'background.paper', borderRadius: 1, mb: 1 }}>
						<Typography fontWeight={700}>{a.key || a.name}</Typography>
						<Typography>{((a.bytes?.value || 0) / 1024 / 1024).toFixed(2)} MB</Typography>
					</Box>
				))}
			</Grid>
		</Grid>
	)
}

