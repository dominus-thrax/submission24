import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import Header from './Header'

const Layout = ({children}) => {
  return (
    <Flex
    direction={"column"}
    // bgImage="/backimg.png"
    // bgPosition="center"
    // bgRepeat="no-repeat"
    // bgSize="cover"
    bg={"black"}
    minHeight="100vh"  
    width="100%"  
    fontFamily="vt323 ,monospace"
    >
        <Header />
        <Flex
            flexGrow={1}  
            width="100%"  
            height="auto"
        >
            {children}
        </Flex>
    </Flex>
  )
}

export default Layout