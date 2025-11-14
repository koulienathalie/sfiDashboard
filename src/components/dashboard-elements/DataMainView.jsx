import { ChartView } from './ChartView'
import { FlowView } from './FlowView'
import { IpView } from './IpView'
import { ServiceView } from './ServiceView'
import BandwidthView from './BandwidthView'
import { Grid, Paper, Box } from '@mui/material'
import SocketStatus from '../SocketStatus'

export function DataMainView({ page }) {
	// Main dashboard: when page is 'view' or undefined, show a composed dashboard
	if (!page || page === 'view') {
		return (
			<>
				<Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}><SocketStatus /></Box>
				<Grid container spacing={2}>
					<Grid item xs={12} md={8}>
						<Paper sx={{ p: 1 }}>
							<ChartView />
						</Paper>
					</Grid>

					<Grid item xs={12} md={4}>
						<Paper sx={{ p: 1, mb: 2 }}>
							<BandwidthView />
						</Paper>
						<Paper sx={{ p: 1 }}>
							<ServiceView />
						</Paper>
					</Grid>

					<Grid item xs={12} md={6}>
						<Paper sx={{ p: 1 }}>
							<IpView />
						</Paper>
					</Grid>

					<Grid item xs={12} md={6}>
						<Paper sx={{ p: 1 }}>
							<FlowView />
						</Paper>
					</Grid>
				</Grid>
			</>
		)
	}

	switch (page) {
		case 'ipsource':
			return <Box sx={{ p: 3, pt: { xs: 10, sm: 9 }, mt: { xs: 2, sm: 1 } }}><IpView /></Box>
		case 'flow':
			return <Box sx={{ p: 3, pt: { xs: 10, sm: 9 }, mt: { xs: 2, sm: 1 } }}><FlowView /></Box>
		case 'bandwidth':
			return <Box sx={{ p: 3, pt: { xs: 10, sm: 9 }, mt: { xs: 2, sm: 1 } }}><BandwidthView /></Box>
		case 'service':
			return <Box sx={{ p: 3, pt: { xs: 10, sm: 9 }, mt: { xs: 2, sm: 1 } }}><ServiceView /></Box>
		default:
			return null
	}
}

