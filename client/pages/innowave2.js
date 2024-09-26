import { Box, Button, chakra, Flex, Grid, GridItem, Link, SimpleGrid, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import privateUserRoute from '../routers/privateUserRoute';
import { Formik } from "formik";
import { toast } from 'react-toastify';
import FileInput from '../components/FileInput';
import NextLink from 'next/link';
import { uploadFile } from '../action/uploadFile';
import ButtonWithModal from '../components/ButtonWithModal';
import { getEntries, submitEntries } from '../action/entries';
import ContentLoader from '../components/ContentLoader';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import SelectField from '../components/SelectField';
import FormField from '../components/FormField';


const Inowave2 = () => {
  const textColor = useColorModeValue("white", "white");
  const [submission, setSubmission] = useState()
  const [loading, setLoading] = useState(true);
  const handleSubmit = async (values) => {
   
   
      if(values?.url==='')
        {
          toast.error('Please enter link')
          return;
        }
        try {
          const entryData = await submitEntries({
            submission:values.url
          }, 'innowave2');
    
          if (entryData?.error) {
            toast.error(entryData?.error);
            setLoading(false);
            return;
          }
          setSubmission(entryData.submission);
          toast.success('Entry Submitted Successfully');
        } catch (e) {
          console.log(e)
          toast.error('Someting Went Wrong')
        }
        setLoading(false);
      }
    
   
    
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const entryData = await getEntries('innowave2');
        if (entryData?.error) {
          console.log(entryData?.error);
        }
        setSubmission(entryData?.submission);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
    fetchSubmission();
  }, [setSubmission])
  const [tabIndex, setTabIndex] = useState(0)
  return !loading ? (
    <Layout>
      <Box
        pt={10}
        width={"full"}
        pb={"20px"}
        px={{
          base: '16px',
          md: '48px',
          lg: '64px'
        }}
      >
        <NextLink href='/dashboard'>
          <chakra.h3
            fontWeight={"bold"}
            fontSize={24}
            textTransform={"uppercase"}
            color={"#5FAB63"}
            cursor="pointer"
            display={"flex"}
            alignItems={"center"}
          >
            <ChevronLeftIcon w={6} h={6}/> <span>Back to all events</span>
          </chakra.h3>
        </NextLink>
        <chakra.h1
          py={5} fontSize={40} fontWeight={"bold"} color={textColor}
        >
          Inowave
        </chakra.h1>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          gap={10}
        >
          <GridItem
          >
            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList color={"white"}>
                <Tab fontSize={20}>
                  Topics
                </Tab>
                <Tab fontSize={20}>Instructions</Tab>
              </TabList>
              <TabPanels bg={"#2F220D"}>
                <TabPanel color={textColor}>
                  <Stack spacing={3}>
                  <Text fontSize='xl'>
                       Themes <Link color={"blue.400"} href="https://drive.google.com/file/d/15RX1rIMiQUCiqmHLaMxS7niPei1sdNBc/view">Click here to view</Link>
                    </Text>
                    
                  </Stack>
                </TabPanel>
                <TabPanel color={textColor}>
                  <Stack spacing={3}>
                    <Text fontSize='3xl'>
                      Instructions
                    </Text>
                    <Text fontSize='xl'>
                      1. All team members must be from the same organization or institute, but they can be from different academic years.
                    </Text>
                    <Text fontSize='xl'>
                      2. Interdisciplinary teams can participate.
                    </Text>
                    <Text fontSize='xl'>
                      3. Modification of team post registration will not be allowed.
                    </Text>
                    <Text fontSize='xl'>
                      4. All the team members must be present during the final presentation; otherwise, their entry will be disqualified.
                    </Text>
                    <Text fontSize='xl'>
                      5. Any unfair means will lead to immediate disqualification.
                    </Text>
                    <Text fontSize='xl'>
                      6. The decision of the judges will be considered final and binding on all the participants.
                    </Text>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>
          {
            submission?.id ?
              (
                <GridItem>
                  <Flex
                    minH={"200px"}
                    border={'2px solid primaries.100'}
                    alignItems={"center"}
                    justifyContent={"center"}
                    flexDirection={'column'}
                    gap={5}
                  >
                    <Text fontSize={'2xl'} textAlign={"center"} color={textColor}>You have already submitted your entry</Text>
                  
                  </Flex>
                </GridItem>
              ) : (
                <GridItem>
                  <Formik
                    initialValues={{url:""}}
                    onSubmit={handleSubmit}
                  >
                    {({ handleBlur, handleChange, values, handleSubmit }) => (
                      <form onSubmit={handleSubmit}>
                        <Stack
                          spacing={8}
                        >
                          <FormField
                            label="url"
                            type='text'
                            name="url"
                            value={values.url}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="url"
                            bg={"#2F220D"}
            
                          />
                          
                          <ButtonWithModal
                            handleSubmit={() => handleSubmit(values)}
                          />
                        </Stack>
                      </form>
                    )}
                  </Formik>
                </GridItem>
              )
          }
        </SimpleGrid>
      </Box>
    </Layout>
  ) : (
    <ContentLoader />
  )
}

export default privateUserRoute(Inowave2)