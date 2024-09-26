import { Box, Button, chakra, Flex, Grid, GridItem, Link, SimpleGrid, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import privateUserRoute from '../routers/privateUserRoute';
import * as Yup from "yup";
import { Formik } from "formik";
import NextLink from 'next/link';
import { toast } from 'react-toastify';
import ButtonWithModal from '../components/ButtonWithModal';
import { getEntries, submitEntries } from '../action/entries';
import ContentLoader from '../components/ContentLoader';
import FormField from '../components/FormField';
import TextEditor from '../components/TextEditor';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import FileInput from '../components/FileInput';
import { uploadFile } from '../action/uploadFile';
import { useRouter } from 'next/router'


const Insight = () => {
  const textColor = useColorModeValue("white", "white")
  const [submission, setSubmission] = useState()
  const [loading, setLoading] = useState(true);
  const router=useRouter();
  const handleSubmit = async (values) => {
    //console.log(values)
    if (!values?.submission?.name) {
      toast.error('Please Select a file')
      return;
    }
   // console.log(values.submission.size)
    if (values.submission.size > 5000000) {
      toast.error('File Size Exceeded');
      return;
    }
    try {
      setLoading(true);
      const data = await uploadFile(values.submission)
     // console.log("insight:",data);
      if (data?.error) {
        toast.error('Someting Went Wrong')
        setLoading(false);
        return
      }
      const entryData = await submitEntries({
        submission:data.submission,
        topic:values.topic
      }, 'insight');
      if (entryData?.error) {
        toast.error(entryData?.error);
        setLoading(false);
        return;
      }
      //console.log("entrydata insight:",entryData.submission)
      setSubmission(entryData?.submission);
      
      toast.success('Entry Submitted Successfully');
    } catch (e) {
      console.log(e)
      toast.error('Someting Went Wrong')
    }
    setLoading(false);
  }
  useEffect(() => {
    const fetchStatus=async()=>
      {
          try
          {
              const res=await getStatus("insight");
              //console.log(res.status);
              if(res.status!==true)
              {
                 router.push('/dashboard');
              }
          }catch(err)
          {
            console.log(err);
          }
      }
      fetchStatus();
    const fetchSubmission = async () => {
      try {
        const entryData = await getEntries('insight');
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
            <ChevronLeftIcon w={6} h={6} /> <span>Back to all events</span>
          </chakra.h3>
        </NextLink>
        <chakra.h1
         py={5} fontSize={40} fontWeight={"bold"} color={textColor}
        >
          Insight
        </chakra.h1>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          gap={10}
        >
          <GridItem>
            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList color={textColor}>
                <Tab fontSize={20}>
                  Rounds
                </Tab>
                <Tab fontSize={20}>Instructions</Tab>
              </TabList>
              <TabPanels bg={"#2F220D"}>
                <TabPanel color={textColor}>
                  <Stack spacing={3}>
                  <Text fontSize='xl' textDecoration="underline">
                      Round 1
                  </Text>
                  <Text fontSize='lg'>
                      Participants write a letter to someone from the past or future (e.g., someone you know, a celebrity, any fictional character, or a person who influenced history), demonstrating their imagination and writing skills. It has to be submitted online within the given time slot.
                  </Text>

                  <Text fontSize='xl' textDecoration="underline">
                      Round 2
                  </Text>
                  <Text fontSize='lg'>
                      The 2nd round will feature "What if..." scenarios, challenging participants to creatively explore hypothetical situations.
                  </Text>

                   
                  </Stack>
                </TabPanel>
                <TabPanel color={textColor}>
                  <Stack spacing={3}>
                    {/* <Text fontSize='2xl'>
                      Instructions
                    </Text> */}
                   <Text fontSize='xl'>
                    1. Plagiarized entries will be disqualified.
                  </Text>
                  <Text fontSize='xl'>
                    2. Word limit for both rounds is 400 words, and participants should strictly adhere to it.
                  </Text>
                  <Text fontSize='xl'>
                    3. Every round is an elimination round.
                  </Text>
                  <Text fontSize='xl'>
                    4. Any unfair means will lead to immediate disqualification.
                  </Text>
                  <Text fontSize='xl'>
                    5. The decision of the organizers will be considered final and binding on all participants.
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
                    border={'2px solid green.300'}
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
                    initialValues={{ topic: "", submission: {} }}
                    onSubmit={handleSubmit}
                 
                  >
                    {({ handleBlur, handleChange, values, handleSubmit }) => (
                      <form onSubmit={handleSubmit}>
                        <Stack
                          spacing={10}
                        >
                          <FormField
                            label="Topic ( Please copy & paste topic from list of adjacent topic )"
                            type='text'
                            name="topic"
                            value={values.topic}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Topic"
                            bg={"#2F220D"}
            
                          />
                         <FileInput
                            accept={'.doc,.docx,.pdf'}
                            label='Upload Your Abstract ( .doc, .docx or .pdf upto 2 mb )'
                            name='submission'
                            onBlur={handleBlur}
                            bg={"#2F220D"}
                          />
                         
                          <ButtonWithModal handleSubmit={() => handleSubmit(values)} />
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

export default privateUserRoute(Insight)