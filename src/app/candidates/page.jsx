"use client";
import Candidate from "@/components/Candidate";
import { Box, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { BsCheck2Circle } from "react-icons/bs";

const CandidatesList = ({ location }) => {
  return (
    <>
      <Text textAlign={"center"} fontWeight={"medium"}>
        Please choose your favorite candidate.
      </Text>
      <Box pb={8} w={"full"}></Box>
      <Stack
        w={"full"}
        alignItems={"center"}
        justifyContent={"center"}
        direction={"row"}
        flexWrap={"wrap"}
        gap={8}
      >
        <Candidate id={4} name={"Subal Das"} myLocation={location} />
        <Candidate />
        <Candidate />
        <Candidate />
        <Candidate />
        <Candidate />
        <Candidate />
      </Stack>

      <Box
        position={"fixed"}
        top={4}
        right={4}
        p={2}
        bgColor={"#FFF"}
        rounded={12}
        boxShadow={'lg'}
        minW={36}
      >
        <HStack>
          <Icon as={BsCheck2Circle} fontSize={'3xl'} color={'whatsapp.600'} />
          <Box>
            <Text fontSize={'10'}>Total Votes</Text>
            <Text fontWeight={'semibold'}>124</Text>
          </Box>
        </HStack>
      </Box>
    </>
  );
};

export default CandidatesList;
