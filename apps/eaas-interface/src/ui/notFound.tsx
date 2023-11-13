import { Center, Text, Flex, Link, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { RouteKey, RoutesPathMap } from "./routerConstants";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Center h="50%" minHeight="300px">
      <Flex w="500px" direction="column" align="center">
        <Text mt={3} fontSize="3xl">
          Page Not Found
        </Text>
        <Text mt={3} textAlign="center">
          This page does not exist. You may have mistyped the address or it has been moved to
          another URL. If you think this is an error, please{" "}
          <Link href={"/"} target="_blank" textDecor="underline">
            contact our support team
          </Link>
          .
        </Text>
        <Button
          onClick={() => {
            navigate(RoutesPathMap[RouteKey.HOME_PAGE]);
          }}
          mt={6}
        >
          Return Home
        </Button>
      </Flex>
    </Center>
  );
}
