"use client";
import {
  Box,
  Button,
  Container,
  HStack,
  Input,
  Select,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

const page = () => {
  const Toast = useToast();
  const [secretPin, setSecretPin] = useState("");
  const [candidateId, setCandidateId] = useState("");

  const [candidates, setCandidates] = useState([]);
  const [allTokens, setAllTokens] = useState([]);
  const [myTokens, setMyTokens] = useState([]);

  useEffect(() => {
    fetchTokens();
  }, []);

  function fetchTokens() {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vote/valid-votes`)
      .then((res) => {
        setAllTokens(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function fetchMyTokens() {
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vote/verify`, {
        secretPin: secretPin,
        candidateId: candidateId,
      })
      .then((res) => {
        setMyTokens(res.data);
        fetchTokens();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getCandidates() {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/candidates/view/all`)
      .then((res) => {
        setCandidates(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Error occured getting candidates",
          description:
            err?.response?.data?.err?.message ||
            err?.response?.data?.message ||
            err?.message,
        });
      });
  }

  return (
    <>
      <Box
        p={8}
        bgImage={"/gradient.jpg"}
        bgSize={"cover"}
        w={"full"}
        minH={"100vh"}
      >
        <Text
          textAlign={"center"}
          fontWeight={"semibold"}
          fontSize={"3xl"}
          className="messiri"
        >
          Verify Your Token
        </Text>
        <br />
        <br />
        <Container maxW={"3xl"}>
          <Stack
            direction={["column", "row"]}
            w={"full"}
            p={3}
            bgColor={"#FFF"}
            rounded={"12"}
            boxShadow={"lg"}
            gap={6}
            flexWrap={"wrap"}
          >
            <Input
              placeholder="Enter your secret pin here..."
              onChange={(e) => setSecretPin(e.target.value)}
              variant={"flushed"}
            />
            <Select
              placeholder="Choose the candidate you voted"
              variant={"flushed"}
            >
              {candidates?.map((candidate, key) => (
                <option value={candidate?.volunteer?.idNumber} key={key}>
                  {candidate?.volunteer?.name}
                </option>
              ))}
            </Select>
            <HStack justifyContent={"flex-end"} w={"full"}>
              <Button colorScheme="facebook" onClick={() => fetchMyTokens()}>
                Verify
              </Button>
            </HStack>
          </Stack>
          <br />
          <br />
          {myTokens?.map((token, key) => (
            <HStack
              key={key}
              w={"full"}
              p={4}
              my={2}
              rounded={12}
              bgColor={"#FFF"}
              boxShadow={"lg"}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={4}
            >
              <Box maxW={['full', '75%']}>
                <Text fontWeight={"medium"} fontSize={'xs'}>{token?.token}</Text>
              </Box>
              <Box>
                <Text fontSize={'xs'}>{token?.candidate?.volunteer?.name}</Text>
              </Box>
              <Box
                boxSize={4}
                rounded={"full"}
                bgColor={token?.isVerified ? "whatsapp.50" : "red.50"}
              ></Box>
            </HStack>
          ))}
          <br />
          <br />
          {allTokens?.map((token, key) => (
            <HStack
              key={key}
              w={"full"}
              p={4}
              my={2}
              rounded={12}
              bgColor={"#FFF"}
              boxShadow={"lg"}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={4}
            >
              <Box maxW={['full', '75%']}>
                <Text fontWeight={"medium"} fontSize={'xs'}>{token?.token}</Text>
              </Box>
              <Box>
                <Text fontSize={'xs'}>{token?.candidate?.volunteer?.name}</Text>
              </Box>
              <Box
                boxSize={4}
                rounded={"full"}
                bgColor={token?.isVerified ? "whatsapp.50" : "red.50"}
              ></Box>
            </HStack>
          ))}
        </Container>
      </Box>
    </>
  );
};

export default page;
