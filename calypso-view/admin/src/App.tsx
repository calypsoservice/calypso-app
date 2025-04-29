import './App.css'
import { AppProvider } from './Contexts/AppContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './Layout'
import { UsersPage } from './Pages/UsersPage'
import { UserPage } from './Pages/UserPage'
import { TransactionsPage } from './Pages/TransactionsPage'
import { TokensPage } from './Pages/TokensPage'
import { StakingsPage } from './Pages/StakingsPage'
import { Login } from './Pages/Login'
import 'remixicon/fonts/remixicon.css'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<UsersPage />} />
            <Route path='/user/:id' element={<UserPage />} />
            <Route path='/user/transactions/:id' element={<TransactionsPage />} />
            <Route path='/user/tokens/:id' element={<TokensPage />} />
            <Route path='/user/stakes/:id' element={<StakingsPage />} />
          </Route>
          <Route path='/login/' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
