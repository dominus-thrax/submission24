import React, { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Layout from '../../components/Layout';
import Leaderboard from '../../components/Leaderboard';
import { Box, chakra, Flex, useColorModeValue } from '@chakra-ui/react'
import { getLeaderboard } from '../../action/entries';
import ContentLoader from '../../components/ContentLoader';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import AppContext from '../../context/AppContext';
import privateUserRoute from '../../routers/privateUserRoute';

const Leader = () => {
    const textColor = useColorModeValue("gray.700", "gray.50");
    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const cardBg = useColorModeValue("white.100", "secondaries.800");
    const { user } = useContext(AppContext);
    const senior = user.year === 'TE' || user.year === 'BE';
    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const data = await getLeaderboard('dataquest1')
                if (data?.error) {
                    console.log(data.error);
                }
                setSubmissions(data?.submissions);
            } catch (e) {
                console.log(e)
            }
            setLoading(false);
        }
        fetchSubmissions()
    }, [setSubmissions])
    return !loading ? (
        <Layout>
            <Box
                w='100%'
                px={{
                    base: '16px',
                    md: '48px',
                    lg: '64px'
                }}
                pt="100px"
            >
                <Flex
                    // alignItems={'center'}
                    justifyContent={'center'}
                    w='100%'
                    p={'20px'}
                    flexDirection={'column'}
                    rounded={"lg"}
                    bg={cardBg}
                    boxShadow={"md"}

                >
                    <NextLink href='/dataquest'>
                        <chakra.h3
                            fontWeight={"bold"}
                            fontSize={20}
                            textTransform={"uppercase"}
                            color={"green.400"}
                            cursor="pointer"
                            display={'flex'}
                            alignItems={'center'}
                            mb={3}
                        >
                            <ChevronLeftIcon w={6} h={6} /> <span>Back to Entry Submission</span>
                        </chakra.h3>
                    </NextLink>
                    <chakra.h1
                        fontSize={{
                            base: 36,
                            md: 48

                        }}

                        // textAlign={'center'}
                        fontWeight={"bold"}
                        color={textColor}
                        pb={'40px'}>Leaderboard {senior ? "( TE-BE )" : "( FE-SE )"}</chakra.h1>
                        {
                            submissions?.length > 100 ? (
                        <Leaderboard submissions={submissions} senior={senior} />
                            ) : (
                                <chakra.h3
                                    fontWeight={"bold"}
                                    fontSize={32}
                                    color={textColor}
                                    w={'100%'}
                                    cursor="pointer"
                                    textAlign={'center'}
                                    display={'flex'}
                                    alignItems={'center'}
                                    mb={3}
                                >
                                    Leaderboard will be live soon.
                                </chakra.h3>
                            )
                        }

                        

                </Flex>
            </Box>
        </Layout>
    ) : (
        <ContentLoader />
    )
}

export default privateUserRoute(Leader);