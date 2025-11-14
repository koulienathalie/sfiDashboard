import { ChartView } from './ChartView'
import { FlowView } from './FlowView'
import { IpView } from './IpView'
import { ServiceView } from './ServiceView'
import { BandwidthView } from './BandwidthView'
import { Grid, Paper, Box } from '@mui/material'
import SocketStatus from '../SocketStatus'

export function DataMainView({ page }) {
	// Main dashboard: when page is 'view' or undefined, show a composed dashboard
	if (!page || page === 'view') {
		return (
			<>
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}><SocketStatus /></Box>
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
			return <IpView />
		case 'flow':
			return <FlowView />
		case 'bandwidth':
			return <BandwidthView />
		case 'service':
			return <ServiceView />
		default:
			return null
	}
}

