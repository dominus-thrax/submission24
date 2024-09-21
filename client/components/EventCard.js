import { ArrowRightIcon } from "@chakra-ui/icons";
import { Box, Button, chakra, Flex, Image, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import { useContext } from "react";
import AppContext from "../context/AppContext";

const EventCard = ({ event, page }) => {
  console.log("eventcard ",event)
  const { user } = useContext(AppContext);
    const senior = user.year === "TE" || user.year === "BE";
    const router = useRouter();
    const { colorMode } = useColorMode();
  return (
    <Flex
        alignItems={"center"}
        justifyContent={"center"}
        flexDirection={"column"}
        p={"100px"}
        gap={"8px"}
        bgImage="/back.png"  // Replace with your image URL
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="contain" // Ensure the image retains its original form
        height="100%"
        width="100%"
        >
          <Box
            w={"100px"} // Set equal width and height for a perfect circle
            h={"100px"}
            bg={"secondaries.900"}
            p={4}
            borderRadius="full" // This makes the box a circle
            display="flex"
            alignItems="center"
            justifyContent="center"
          // border={"0.002px solid #ff4500"}
          >
            {/* <Image src={event.logo} alt="logo" /> */}
            <Image src={"/backimg.png"} alt="logo" />
          </Box>
          <chakra.h1 fontWeight={"bold"} fontSize={50} color={"#CFC36D"}>
            {event}
          </chakra.h1>
          <Button
            rightIcon={<ArrowRightIcon />}
            width={"100px"}
            p={"4px"}
            bg={"#88B788"}
            boxShadow={"0 9px #CFC36D"}
            color={colorMode === "light" ? "white" : "black"}
            _hover={{
              bg: "FFF500",
              boxShadow: "0 9px #999",
              color: colorMode === "light" ? "black" : "white"
            }}
            _active={{
              bg: "FF4500",
              boxShadow: "0 5px #666",
              transform: "translateY(4px)",
              transition: "transform 1s boxShadow 0.5s"
            }}
            onClick={() =>
            {
               
              
                router.push(page)
              
             
              
            }
          }
          >
            Play
          </Button>
        </Flex>
  )
}

export default EventCard





// import { ArrowRightIcon } from "@chakra-ui/icons";
// import { Box, Button, chakra, Flex, Image, useColorMode } from "@chakra-ui/react";
// import { useRouter } from "next/router";
// import React from "react";
// import { toast } from "react-toastify";
// import { useContext } from "react";
// import AppContext from "../context/AppContext";
// const EventCard = ({ event, page }) =>
// {
//   const { user } = useContext(AppContext);
//   const senior = user.year === "TE" || user.year === "BE";
//   const router = useRouter();
//   const { colorMode } = useColorMode();
//   return (
//     <Flex
//     alignItems={"center"}
//     justifyContent={"center"}
//     flexDirection={"column"}
//     p={"100px"}
//     gap={"8px"}
//     bgImage="/back.png"  // Replace with your image URL
//     bgPosition="center"
//     bgRepeat="no-repeat"
//     bgSize="contain" // Ensure the image retains its original form
//     height="100%"
//     width="100%"
//     >
//       <Box
//         w={"100px"} // Set equal width and height for a perfect circle
//         h={"100px"}
//         bg={"secondaries.900"}
//         p={4}
//         borderRadius="full" // This makes the box a circle
//         display="flex"
//         alignItems="center"
//         justifyContent="center"
//       // border={"0.002px solid #ff4500"}

//       >
//         <Image src={event.logo} alt="logo" />
//       </Box>
//       <chakra.h1 fontWeight={"bold"} fontSize={50} color={"#CFC36D"}>
//         {event.name}
//       </chakra.h1>
//       <Button
//         rightIcon={<ArrowRightIcon />}
//         width={"100px"}
//         p={"4px"}
//         bg={"#88B788"}
//         boxShadow={"0 9px #CFC36D"}
//         color={colorMode === "light" ? "white" : "black"}
//         _hover={{
//           bg: "FFF500",
//           boxShadow: "0 9px #999",
//           color: colorMode === "light" ? "black" : "white"
//         }}
//         _active={{
//           bg: "FF4500",
//           boxShadow: "0 5px #666",
//           transform: "translateY(4px)",
//           transition: "transform 1s boxShadow 0.5s"
//         }}
//         onClick={() =>
//         {
           
//           if(page!=="/dataquest"){
//             router.push(page)
//           }
//           else{
//              router.push("/dashboard")
//              toast.error("Submission for this event is not available")
//           }
          
//         }
//       }
//       >
//         Play
//       </Button>
//     </Flex>
//   );
// };

// export default EventCard;
