import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  Flex,
  Image,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useContext } from "react";
import EventCard from "../components/EventCard";
import Layout from "../components/Layout";
import AppContext from "../context/AppContext";
import { masterEvents } from "../model/masterEvents";
import privateUserRoute from "../routers/privateUserRoute";

const Dashboard = () => {
  const { contEvents } = useContext(AppContext);
 // console.log("indashboard",contEvents);
  const textColor = useColorModeValue("white", "white");
  return (
     <Layout>
       <Flex
        textAlign={"center"}
        pt={2}
        justifyContent={"center"}
        direction={"column"}
        width={"full"}
       
        pb={"4px"}
      >
        <Box width={{ base: "full", sm: "lg", lg: "xl" }} margin={"auto"}>
          <chakra.h3
            fontWeight={"bold"}
            fontSize={20}
            textTransform={"uppercase"}
            color={"purple.400"}
          >
          </chakra.h3>
          <chakra.h1 py={2} fontSize={32} fontWeight={"bold"} color={textColor}>
            Registered Events
          </chakra.h1>
          {contEvents && contEvents.length === 0 && (
          <Text fontSize={{ base: "2xl", md: "5xl" }} color={"white"}>
            {" "}
            You haven&lsquo;t registered for any event
          </Text>
        )}
        </Box>
       
        <SimpleGrid
          columns={{ base: 1, md: 2, xl: 3 }}
          spacing={"8"}
          mt={8}
          px={{
            base: "16px",
            md: "48px",
            lg: "64px",
          }}
        >
          {console.log("LIne 61", contEvents)}
          {contEvents.map((event) => {
            console.log("line 68 in dashboard", event, masterEvents);
            const eve = masterEvents.find(
              (eve) =>
                eve.ems_id === event.ems_id 
                // &&
                // event.name != "Paper Presentation" &&
                // event.name != "Insight" 
            );
            return (
              <EventCard
                id={event?.event_id}
                event={event?.event_name}
                page={event?.event_route}
                key={event?.event_id}
                status={event.event_status}
                logo={event.logo}
              />
              
            );
          })}
        </SimpleGrid>
      </Flex>
    </Layout>
  );
};

export default privateUserRoute(Dashboard);




