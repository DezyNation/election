"use client";
import Candidate from "@/components/Candidate";
import Timer from "@/components/Timer";
import { Box, HStack, Icon, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { BsCheck2Circle } from "react-icons/bs";

const CandidatesList = ({ location, ip }) => {
  const Toast = useToast();

  const [electionInfo, setElectionInfo] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    getElectionInfo();
  }, []);

  useEffect(() => {
    if (!electionInfo) return;
    if (electionInfo?.status == "declared") {
      getResult();
    } else if (electionInfo?.status == "ongoing") {
      getCandidates();
    } else {
      window.location.replace("/upcoming");
    }
  }, [electionInfo]);

  function getElectionInfo() {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/election-control`)
      .then((res) => {
        setElectionInfo(res.data?.data?.attributes);
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Error occured while getting election info",
          description:
            err?.response?.data?.err?.message ||
            err?.response?.data?.message ||
            err?.message,
        });
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

  function getResult() {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/votes/result`)
      .then((res) => {
        setCandidates(res.data);
      })
      .catch((err) => {
        Toast({
          status: "error",
          title: "Error occured while getting result",
          description:
            err?.response?.data?.err?.message ||
            err?.response?.data?.message ||
            err?.message,
        });
      });
  }

  return (
    <>
      <Timer targetDate={new Date(electionInfo?.endAt)} />
      <Text textAlign={"center"} fontSize={"lg"} fontWeight={"semibold"} pt={4}>
        {electionInfo?.title}
      </Text>
      <Text textAlign={"center"} fontWeight={"medium"}>
        {electionInfo?.description}
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
        {candidates?.map((candidate, key) => (
          <Candidate
            key={key}
            id={candidate?.volunteer?.idNumber}
            name={candidate?.volunteer?.name}
            avatar={candidate?.volunteer?.avatar}
            myLocation={location}
            myIp={ip}
            tokens={candidate?.votes?.map((vote) => vote?.token)}
            totalVotes={electionInfo?.totalVotes}
            resultDeclared={electionInfo?.status == "declared"}
          />
        ))}
      </Stack>

      <Box
        position={"fixed"}
        top={4}
        right={4}
        p={2}
        bgColor={"#FFF"}
        rounded={12}
        boxShadow={"lg"}
        minW={36}
      >
        <HStack>
          <Icon as={BsCheck2Circle} fontSize={"3xl"} color={"whatsapp.600"} />
          <Box>
            <Text fontSize={"10"}>Total Votes</Text>
            <Text fontWeight={"semibold"}>{electionInfo?.totalVotes}</Text>
          </Box>
        </HStack>
      </Box>
    </>
  );
};

export default CandidatesList;
