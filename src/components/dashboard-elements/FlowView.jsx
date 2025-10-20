import { DataGrid } from '@mui/x-data-grid'

export function FlowView() {
    const columns = [
        { field: 'timespan', headerName: 'TIMESPAN', flex: 0.8 },
        { field: 'ipsource', headerName: 'IP SOURCE', flex: 0.7 },
        { field: 'ipdestination', headerName: 'IP DESTINATION', flex: 0.7 },
        { field: 'destination', headerName: 'DESTINATION (Org)', flex: 0.7 },
        { field: 'direction', headerName: 'DIRECTION', flex: 0.7 },
        { field: 'location', headerName: 'LOCALISATION (Flux)', flex: 0.7 },
    ]

    const rows = [
        {
            id: 1,
            timespan: '2025-09-17 10:15:30',
            ipsource: '192.168.1.25',
            ipdestination: '172.217.18.142',
            destination: 'GOOGLE',
            direction: 'OUTBOUND',
            location: 'external',
        },
        {
            id: 2,
            timespan: '2025-09-17 10:16:05',
            ipsource: '10.0.0.12',
            ipdestination: '104.244.42.1',
            destination: 'GOOGLE',
            direction: 'OUTBOUND',
            location: 'external',
        },
        {
            id: 3,
            timespan: '2025-09-17 10:18:47',
            ipsource: '203.0.113.5',
            ipdestination: '192.168.1.25',
            destination: 'Telecom-Malagasy',
            direction: 'INBOUND',
            location: 'external',
        },
        {
            id: 4,
            timespan: '2025-09-17 10:20:12',
            ipsource: '192.168.1.30',
            ipdestination: '151.101.1.69',
            destination: 'Telecom-Malagasy',
            direction: 'OUTBOUND',
            location: 'external',
        },
        {
            id: 5,
            timespan: '2025-09-17 10:22:55',
            ipsource: '172.16.0.45',
            ipdestination: '8.8.8.8',
            destination: 'GOOGLE',
            direction: 'OUTBOUND',
            location: 'external',
        },
        {
            id: 6,
            timespan: '2025-09-17 11:05:10',
            ipsource: '10.1.0.22',
            ipdestination: '192.168.1.100',
            destination: 'GOOGLE',
            direction: 'INBOUND',
            location: 'external',
        },
        {
            id: 7,
            timespan: '2025-09-17 11:06:45',
            ipsource: '192.168.1.55',
            ipdestination: '93.184.216.34',
            destination: 'Telecom-Malagasy',
            direction: 'OUTBOUND',
            location: 'external',
        },
        {
            id: 8,
            timespan: '2025-09-17 11:08:20',
            ipsource: '172.16.5.10',
            ipdestination: '104.26.2.33',
            destination: 'Telecom-Malagasy',
            direction: 'OUTBOUND',
            location: 'external',
        },
        {
            id: 9,
            timespan: '2025-09-17 11:09:50',
            ipsource: '203.0.113.77',
            ipdestination: '192.168.1.55',
            destination: 'Telecom-Malagasy',
            direction: 'INBOUND',
            location: 'external',
        },
        {
            id: 10,
            timespan: '2025-09-17 11:11:05',
            ipsource: '192.168.1.75',
            ipdestination: '52.95.110.2',
            destination: 'GOOGLE',
            direction: 'OUTBOUND',
            location: 'external',
        },
        {
            id: 11,
            timespan: '2025-09-17 11:12:40',
            ipsource: '10.0.0.50',
            ipdestination: '31.13.71.36',
            destination: 'GOOGLE',
            direction: 'OUTBOUND',
            location: 'external',
        },
        {
            id: 12,
            timespan: '2025-09-17 11:14:22',
            ipsource: '192.168.1.90',
            ipdestination: '142.250.190.14',
            destination: 'Telecom-Malagasy',
            direction: 'OUTBOUND',
            location: 'external',
        },
    ]

    return (
        <DataGrid
            columns={columns}
            rows={rows}
            hideFooter
            rowHeight={41}
            disableColumnResize
            showToolbar
            sx={{
                '& .MuiDataGrid-columnHeader': { backgroundColor: '#f9f9f9' },
                '& .MuiDataGrid-row:nth-of-type(even)': { backgroundColor: '#f9f9f9' },
                '& .MuiDataGrid-row:nth-of-type(odd)': { backgroundColor: '#ffffff' },
            }}
        />
    )
}
