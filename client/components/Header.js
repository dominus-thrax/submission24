import {
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { SwitchThemeButton } from "./Util/SwitchTheme";
import Link from "next/link";
import * as styles from "../styles/header.module.css";
import { ChevronDownIcon } from "@chakra-ui/icons";
import AppContext from "../context/AppContext";
import { logout } from "../action/user";

const Header = () => {
  const { colorMode } = useColorMode();
  const { user, dispatchUser, dispatchEvents } = useContext(AppContext);
  const handleLogout = async () => {
    try {
      const data = await logout(dispatchUser, dispatchEvents);
      if (data?.error) {
        console.log(data.error);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Flex
    alignItems={"center"}
    justifyContent={"center"} // Center logo horizontally
    py={"2px"}
    px={{
      base: "32px",
      md: "48px",
      lg: "64px",
    }}
    position="relative" // Set relative positioning on the container
    gap={"4px"}
  >
    <Link href="/" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
      <Image src="/logo.svg" width={500} height={200} alt={"logo"} />
    </Link>
    <Flex
      position="absolute" // Position the logout button container absolutely
      right="4px"
      top={40} // Align it to the right end
      alignItems={"center"}
      gap={"15px"}
      pr={4} // Add some padding to the right if needed
    >
      {user?.id && <Button onClick={handleLogout}>Log Out</Button>}
    </Flex>
  </Flex>
  
  
  );
};

export default Header;
