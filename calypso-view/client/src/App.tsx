import './App.css'
import 'remixicon/fonts/remixicon.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Dashboard } from './Pages/Dashboard/Dashboard'
import { AppProvider } from './Contexts/AppContext'
import { AddFunds } from './Pages/AddFunds/AddFunds'
import { Transaction } from './Pages/AddFunds/Transaction'
import { Referral } from './Pages/Referral/Referral'
import { Deposite } from './Pages/Deposite/Deposite'
import { Deposites } from './Pages/Deposites/Deposites'
import { History } from './Pages/History/History'
import { Login } from './Pages/Login/Login'
import { Registration } from './Pages/Registration/Registration'
import { EmailConfirmation } from './Pages/TwoFactorAuthorization/TwoFactorAuthorization'
import { ResetPssword } from './Pages/ResetPssword/ResetPssword'
import { EmailForPasswordReset } from './Pages/ResetPssword/EmailForPasswordReset'
import { StartPage } from './Pages/Landing/StartPage'
import { Settings } from './Pages/Settings/Settings'
import { EmailConfirmationReset } from './Pages/ResetPssword/EmailConfirmation'
import { WithdrawFunds } from './Pages/WithdrawFunds/WithdrawFunds'
import { Logout } from './Pages/Logout/Logout'
import { Transaction as CashoutTransaction } from './Pages/WithdrawFunds/Transaction'

function App() {

  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path='' element={<StartPage />} />
          <Route path='/dashboard/' element={<Dashboard />} />
          <Route path='/cashin/' element={<AddFunds />} />
          <Route path='/cashout/' element={<WithdrawFunds />} />
          <Route path='/transaction/:hash/' element={<Transaction />} />
          <Route path='/cashout/transaction/:hash/' element={<CashoutTransaction />} />
          <Route path='/referrals/' element={<Referral />} />
          <Route path='/deposit/' element={<Deposite />} />
          <Route path='/deposits/' element={<Deposites />} />
          <Route path='/history/' element={<History />} />
          <Route path='/login/' element={<Login />} />
          <Route path='/login/:block/' element={<Login />} />
          <Route path='/logout/' element={<Logout />} />
          <Route path='/signup/' element={<Registration />} />
          <Route path='/email-confirmation/:email/' element={<EmailConfirmation />} />
          <Route path='/email-confirmation-reset/:email/' element={<EmailConfirmationReset />} />
          <Route path='/reset-password/:email/' element={<ResetPssword />} />
          <Route path='/password-reset/' element={<EmailForPasswordReset />} />
          <Route path='/settings/' element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
