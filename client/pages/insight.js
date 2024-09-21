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

const options = [
  { value: "1. Great things happen out of one’s comfort zone but what if a person is happy and satisfied in his comfort zone?", label: "1. Great things happen out of one’s comfort zone but what if a person is happy and satisfied in his comfort zone?" },
  { value: "2. Are good morals innate or a result of fear?", label: "2. Are good morals innate or a result of fear?" },
  { value: "3. Is honest disagreement a good sign of progress?", label: "3. Is honest disagreement a good sign of progress?" },
  { value: "4. Which is more important: creativity or efficiency?", label: "4. Which is more important: creativity or efficiency?" },

]


const Insight = () => {
  const textColor = useColorModeValue("gray.700", "gray.50")
  const [submission, setSubmission] = useState()
  const [loading, setLoading] = useState(true);
  const handleSubmit = async (values) => {
    console.log(values)
    if (!values?.submission?.name) {
      toast.error('Please Select a file')
      return;
    }
    console.log(values.submission.size)
    if (values.submission.size > 5000000) {
      toast.error('File Size Exceeded');
      return;
    }
    try {
      setLoading(true);
      const data = await uploadFile(values.submission)
      console.log("insight:",data);
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
      console.log("entrydata insight:",entryData.submission)
      setSubmission(entryData?.submission);
      
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
            fontSize={20}
            textTransform={"uppercase"}
            color={"#5FAB63"}
            cursor="pointer"
            display={'flex'}
            alignItems={'center'}
          >
            <ChevronLeftIcon w={6} h={6} /> <span>Back to all events</span>
          </chakra.h3>
        </NextLink>
        <chakra.h1
          py={5}
          fontSize={48}
          fontWeight={"bold"}
          color={textColor}
        >
          Insight
        </chakra.h1>
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          gap={10}
        >
          <GridItem>
            <Tabs onChange={(index) => setTabIndex(index)}>
              <TabList>
                <Tab>
                  Topics
                </Tab>
                <Tab>Instructions</Tab>
              </TabList>
              <TabPanels bg={"rgba(165, 151, 39, 0.7)"}>
                <TabPanel>
                  <Stack spacing={3}>
                    <Text fontSize='2xl'>
                      Topics
                    </Text>
                    {
                      options.map((item) => (
                        <Text fontSize='lg' key={item.value}>
                          {item.label}
                        </Text>
                      ))
                    }
                  </Stack>
                </TabPanel>
                <TabPanel>
                  <Stack spacing={3}>
                    <Text fontSize='2xl'>
                      Instructions
                    </Text>
                    <Text fontSize='lg'>
                      Round 1: Passage/poem writing: Four topics would be given, out of which participants have to choose one and write a passage, story, poem, or any other suitable form of creative writing.
                    </Text>
                    <Text fontSize='lg'>
                      Round 2: Third&lsquo;s POV: A short story would be given from a person&lsquo;s point of view and the participants will have to write the same story from a third person&lsquo;s point of view.
                    </Text>
                    <Text fontSize='lg'>
                      1. All rounds are elimination rounds and selected participants would be informed by our team.
                    </Text>
                    <Text fontSize='lg'>
                      2. Plagiarized entries will be disqualified.
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
                    <Text fontSize={'2xl'} textAlign={"center"}>You have already submitted your entry</Text>
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
                            bg={"rgba(165, 151, 39, 0.7)"}
            
                          />
                         <FileInput
                            accept={'.doc,.docx,.pdf'}
                            label='Upload Your Abstract ( .doc, .docx or .pdf upto 2 mb )'
                            name='submission'
                            onBlur={handleBlur}
                            bg={"rgba(165, 151, 39, 0.7)"}
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