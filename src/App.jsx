import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import { SignUpComponent } from './components/SignUpComponent'
import { LogInComponent } from './components/LogInComponent'
import theme from './theme'

function App() {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/auth/signup" replace />} />
                    <Route path="/auth/signup" element={<SignUpComponent />} />
                    <Route path="/auth/login" element={<LogInComponent />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
