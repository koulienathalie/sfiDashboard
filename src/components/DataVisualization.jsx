import { AppBar, Toolbar, Box, Stack, Button, IconButton, Menu, MenuItem } from '@mui/material'
import { AccountCircle, Notifications } from '@mui/icons-material'
import { useRef, useState } from 'react'
import { VisualizationMenu } from './custom-elements/VisualisationMenu'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'

export function DataVisualization() {
    const [itemActive, setItemActive] = useState('Tableau de bord')
    const [anchorEl, setAnchorEl] = useState(null)
    const toolbarRef = useRef(null)
    const navItems = ['Tableau de bord', 'Rapports', 'Alertes', 'Paramètres']

    const handleMenuOpen = () => {
        setAnchorEl(toolbarRef.current)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    return (
        <AppBar position="fixed">
            <Toolbar ref={toolbarRef} sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Bar de navigation | Icone */}
                <Box component="img" src="/images/sfi_logo_primary.png" sx={{ mx: 6, width: 55 }} />

                {/* Bar de navigation | Items */}
                <Box sx={{ ml: 8 }}>
                    <Stack direction="row" spacing={8}>
                        {navItems.map((item, idx) => (
                            <Box key={idx}>
                                <Button
                                    disableRipple
                                    onClick={() => {
                                        setItemActive(item)
                                        if (item === 'Tableau de bord') {
                                            setAnchorEl(anchorEl ? null : toolbarRef.current)
                                        }
                                    }}
                                    endIcon={
                                        item === 'Tableau de bord' ? (
                                            anchorEl ? (
                                                <KeyboardArrowUp />
                                            ) : (
                                                <KeyboardArrowDown />
                                            )
                                        ) : null
                                    }
                                    sx={{
                                        fontSize: 16,
                                        fontWeight: itemActive == item ? 600 : 400,
                                        textTransform: 'none',
                                        color: itemActive == item ? 'text.main' : 'text.normal',
                                    }}>
                                    {item}

                                    {/* Menu */}
                                    {item === 'Tableau de bord' && (
                                        <VisualizationMenu anchorEl={anchorEl} handleMenuClose={handleMenuClose} />
                                    )}
                                </Button>
                            </Box>
                        ))}
                    </Stack>
                </Box>

                {/* Bar de navigation |  rofil */}
                <Box sx={{ ml: 'auto' }}>
                    <IconButton sx={{ color: 'secondary.lighter' }}>
                        <Notifications />
                    </IconButton>

                    <IconButton sx={{ color: 'secondary.lighter' }}>
                        <AccountCircle sx={{ fontSize: 35 }} />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}
