import { createTheme } from '@mui/material'

const theme = createTheme({
    typography: "'Poppins'",
    palette: {
        primary: {
            main: '#02647E',
            light: '#72BDD1',
            lighter: '#29BBE2',
        },
        secondary: {
            main: '#6D6D6D',
            light: '#F7F7F7',
            lighter: '#FFFFFF',
        },
    },
})

export default theme
