import { ChakraProvider } from '@chakra-ui/react'
import { RecoilRoot } from 'recoil'
import AlertsPage from './Alerts'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'

const App = () => (
  <ChakraProvider>
    <RecoilRoot>
      <ErrorBoundary>
        <Navbar>
          <AlertsPage/>
        </Navbar>
      </ErrorBoundary>
    </RecoilRoot>
  </ChakraProvider>
)

export default App
