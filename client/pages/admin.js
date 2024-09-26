import React, { useContext, useState } from 'react'
import Layout from '../components/Layout'
import { Box, Button, Flex, Heading, Stack, useColorModeValue } from '@chakra-ui/react'
import { Formik } from 'formik'
import FormField from '../components/FormField'
import * as Yup from "yup";
import AppContext from '../context/AppContext'
import { userLogin } from '../action/user'
import apiConfig from '../configs/api'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
const validateSchema = Yup.object({
  username: Yup.string().required("Required"),
  password: Yup.string().required("Required")
});

const login = () => {
    
  const [loading, setLoading] = useState(false);
  const router=useRouter();
  const handleLogin = async (values) => {
    //console.log(values);
    
    try {
      const options = {
        method: "POST",
        url: `${apiConfig.url}/admin/signin`,
        headers: {
          "Content-Type": "application/json",
        },
        data: values,
      };
      const res = await axios(options);
      localStorage.setItem(
        "admin",
        JSON.stringify({ token: res.data.token})
      );
     // console.log(res);
      router.push('/adminDashboard');
    } catch (e) {
      console.log(e)
      toast.error('Invalid Admin')
    }
    setLoading(false)
  }
  return (
    <Layout>
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        px={{
          base: '64px',
          md: '48px',
          lg: '64px'
        }}
        py={"1px"}
        w={"100vw"}
      >
        <Flex
          align={"center"}
          justify={"center"}
          opacity={0.8}
          
          rounded={useColorModeValue("", "lg")}
          bg={useColorModeValue("white.100", "secondaries.800")}
        >
          <Stack spacing={"1"} py={12} px={4}
            bgImage="/signup.png"  // Replace with your image URL
            bgPosition="center"
            bgRepeat="no-repeat"
            bgSize="cover"
            
            >
            <Stack align={"center"}>
              <Heading fontFamily={'vt323, monospace'} fontSize={"4xl"} color={"white"}>Admin sign in</Heading>
            </Stack>
            <Box
              rounded={"lg"}
              boxShadow={"md"}
              px={"10"}
              py={"4"}         
            >
              <Formik
                initialValues={{ username: "", password: "" }}
                validationSchema={validateSchema}
                onSubmit={handleLogin}
              >
                {({ handleBlur, handleChange, values, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={"3"}>
                      <FormField
                        type="username"
                        placeholder="username"
                        name="username"
                        label="Username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        width={"full"}
                      />
                      <FormField
                        label="Password"
                        type='password'
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Password"
                        width={"full"}
                      />
                      <Button
                        bg={"#BE913E"}
                        color={"white"}
                        _hover={{
                          bg: "#CCBA63",
                        }}
                        type="submit"
                        isLoading={loading}
                        fontSize={30}
                      >
                        Sign in
                      </Button>
                    </Stack>
                  </form>
                )}
              </Formik>
            </Box>
          </Stack>
        </Flex>
      </Flex>
    </Layout>
  )

}

export default login;
