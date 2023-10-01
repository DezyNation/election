"use client";
import {
  Box,
  Container,
  HStack,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

const page = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [allVolunteers, setAllVolunteers] = useState([]);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  function fetchVolunteers() {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/volunteers/view/all`)
      .then((res) => {
        setAllVolunteers(res.data);
        setVolunteers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function search(value) {
    if (!value) {
      setVolunteers(allVolunteers);
      return;
    }
    const data = volunteers.filter((user) =>
      user?.name?.toLowerCase()?.includes(value?.toLowerCase())
    );
    setVolunteers(data);
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
          Voters List
        </Text>
        <br />
        <br />
        <Container maxW={"3xl"}>
          <Input
            placeholder="Type here to search your name..."
            onChange={(e) => search(e.target.value)}
          />
          <br />
          <br />
          <HStack w={'full'} justifyContent={'space-between'}>
            <HStack
              p={4}
              bgColor={"#FFF"}
              rounded={12}
              boxShadow={"lg"}
              onClick={() =>
                setVolunteers(
                  volunteers.filter((volunteer) => !volunteer?.canVote)
                )
              }
            >
              <Text>Voted</Text>
              <Box boxSize={4} rounded={"full"} bgColor={"whatsapp.400"}></Box>
            </HStack>
            <HStack
              p={4}
              bgColor={"#FFF"}
              rounded={12}
              boxShadow={"lg"}
              onClick={() =>
                setVolunteers(
                  volunteers.filter((volunteer) => volunteer?.canVote)
                )
              }
            >
              <Text>Not Voted</Text>
              <Box boxSize={4} rounded={"full"} bgColor={"red.400"}></Box>
            </HStack>
            <HStack
              p={4}
              bgColor={"#FFF"}
              rounded={12}
              boxShadow={"lg"}
              onClick={() =>
                setVolunteers(
                  allVolunteers
                )
              }
            >
              <Text>All Voters</Text>
            </HStack>
          </HStack>
          <br />
          <br />
          {volunteers?.map((user, key) => (
            <HStack
              w={"full"}
              p={4}
              my={2}
              rounded={12}
              bgColor={"#FFF"}
              boxShadow={"lg"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Text fontWeight={"medium"}>{user?.name}</Text>
              <Box
                boxSize={4}
                rounded={"full"}
                bgColor={user?.canVote ? "whatsapp.400" : "red.400"}
              ></Box>
            </HStack>
          ))}
        </Container>
      </Box>
    </>
  );
};

export default page;
