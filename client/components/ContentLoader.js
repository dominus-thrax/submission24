import { Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react'
import Lottie from 'react-lottie';
import * as data from '../lotties/final.json';
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: data,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const ContentLoader = () => {
  return (
    <Flex
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        w={"100vw"}
        h={"100vh"}
        bg={useColorModeValue("#f8f9fb", "green.200")}
    >
        <Lottie
          options={defaultOptions}
          height={200}
          width={200}
        />
    </Flex>
  )
}

export default ContentLoader