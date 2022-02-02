import { Button, Flex, Input, Link, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import Animated from "../utils/Animated";

const Home = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const retrieveTweets = async () => {
    setLoading(true);
    if (username.length > 0) {
      const link = document.createElement("a");
      link.target = "_blank";
      link.download = `${username}.txt`;
      try {
        await axios
          .get(`${process.env.NEXT_PUBLIC_API}/search?username=${username}`, {
            responseType: "blob",
          })
          .then((res) => {
            setLoading(false);
            console.log(res.data);
            if (res.status === 200) {
              link.href = URL.createObjectURL(
                new Blob([res.data], { type: "text/plain" })
              );
              link.click();

              toast({
                duration: 5000,
                title: "Success",
                description: "Tweets retreived",
                status: "success",
              });
            } else if (res.data.message) {
              toast({
                duration: 5000,
                title: "Uh Oh :(",
                description: res.data.message,
                status: "error",
              });
            }
          });
      } catch (e) {
        if (e.toString().includes("status code 429")) {
          toast({
            duration: 5000,
            title: "Uh Oh :(",
            description: "Too many requests",
            status: "error",
          });
        } else {
          toast({
            duration: 5000,
            title: "Uh Oh :(",
            description: "An error has occurred",
            status: "error",
          });
        }
      }
      setLoading(false);
    }
  };
  return (
    <Flex
      flexDir={"column"}
      bgGradient="linear(to-tl, #7928CA, #FF0080)"
      w="100%"
      h="100vh"
      justifyContent={"center"}
    >
      <Text
        color="white"
        fontSize={40}
        textAlign={"center"}
        fontWeight={"200"}
        mb={2}
        alignSelf={"center"}
      >
        Download any twitter user&apos;s tweets
      </Text>
      <Flex w="auto" alignSelf={"center"}>
        <Animated>
          <Flex
            boxShadow={"2xl"}
            bg="white"
            p={20}
            rounded={10}
            flexDir={"column"}
            alignSelf="center"
          >
            <Input
              autoFocus
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              variant={"flushed"}
              w={["100%", 300, 400, 400]}
              placeholder="Username (without @)"
            />
            <Button
              isLoading={loading}
              onClick={retrieveTweets}
              mt={5}
              colorScheme={"twitter"}
            >
              Retrieve Tweets
            </Button>
          </Flex>
        </Animated>
      </Flex>
      <Flex alignSelf={"center"} pos="absolute" bottom={10}>
        <Text color="white" fontWeight="400" fontSize={25}>
          Created by:&nbsp;
        </Text>
        <Link
          href="https://github.com/HelixHEX"
          color="cyan.400"
          fontWeight="400"
          fontSize={25}
        >
          Elias Wambugu
        </Link>
      </Flex>
    </Flex>
  );
};

export default Home;
