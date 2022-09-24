import { Box, Center, HStack, CircularProgress } from '@chakra-ui/react'
import { ReactNode, Suspense } from 'react'
import Logo from './Logo'

const NAVBAR_HEIGHT = 50

const Navbar = ({ children }: {
  children: ReactNode
}) => (
  <Box minH="100vh" w="100%">
    <HStack
      pos="fixed"
      top="0"
      w="100%"
      h={`${NAVBAR_HEIGHT}px`}
      borderBottom="1px solid #72757A"
      bgColor="white"
      fontWeight="400"
      fontSize="13px"
      spacing={0}
      align="center"
      px="0px"
      zIndex="3"
    >
      <Center
        h="100%"
        px="20px"
      >
        <Logo/>
      </Center>

      <Center
        h="100%"
        px="25px"
        textTransform="uppercase"
      >
        Dashboard
      </Center>
      <Center
        h="100%"
        px="25px"
        textTransform="uppercase"
        bgColor="#F0F5FF"
        borderBottom="3px solid #3478FC"
      >
        Alerts
      </Center>
      <Box flexGrow="1"></Box>
      <Box px="25px">Welcome Admin!</Box>
    </HStack>
    <Box
      paddingTop={`${NAVBAR_HEIGHT + 20}px`}
      paddingX="20px"
      paddingBottom="20px"
      bgColor="#F8F8FF"
    >
      <Box
        bgColor="white"
        border="1px solid #A2AEBC"
      >
        <Suspense fallback={
          <Center w="100%" minH="200px">
            <CircularProgress isIndeterminate/>
          </Center>
        }>
          {children}
        </Suspense>
      </Box>
    </Box>
  </Box>
)

export default Navbar
