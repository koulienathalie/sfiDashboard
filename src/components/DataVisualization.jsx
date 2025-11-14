import { useRef, useState } from 'react'
import { AppBar, Toolbar, Box, Stack, Button, IconButton, Breadcrumbs, Link, Typography, Grid } from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowUp, NavigateNext, AccessTime, Loop } from '@mui/icons-material'
import { AccountCircle, Notifications } from '@mui/icons-material'
export function DataVisualization() {
    const [subItemActive, setSubItemActive] = useState({ title: 'Monitoring des services actifs', page: 'service' })

    const breadcrumbs = [
        <Link color="text.dark" underline="none" fontSize={15}>
            Accueil
        </Link>,
        <Link color="text.dark" underline="none" fontSize={15}>
            Tableau de bord
        </Link>,
    ]

    if (subItemActive) {
        breadcrumbs.push(<Typography color="primary.lighter" fontSize={15}>{subItemActive.title}</Typography>)
    }

    return (
        <Grid
            container
            spacing={2}
            sx={{
                px: 7,
                pt: 10.5,
                height: '100vh',
                bgcolor: 'secondary.lighter',
            }}>
            <Grid size={subItemActive?.page === 'flow' ? 10 : 12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Breadcrumbs separator={<NavigateNext fontSize="small" />}>{breadcrumbs}</Breadcrumbs>

                    <Typography color="text.dark" fontSize={15} sx={{ display: 'flex', alignItems: 'center' }}>
                        {makeIcon(AccessTime)} | {makeIcon(Loop)}
                    </Typography>
                </Box>

                <Box component="main" sx={{ mt: 2 }}>
                    <DataMainView page={subItemActive?.page} />
                </Box>
            </Grid>

            {subItemActive?.page === 'flow' && (
                <Grid size={2} sx={{ my: 1 }}>
                    <Stack spacing={2} sx={{ height: '100%' }}>
                        <MaxBytes />
                    </Stack>
                </Grid>
            )}
        </Grid>
    )
}