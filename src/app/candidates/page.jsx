"use client";
import Candidate from "@/components/Candidate";
import Receipt from "@/components/Receipt";
import Timer from "@/components/Timer";
import { Box, HStack, Icon, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { BsCheck2Circle } from "react-icons/bs";

const CandidatesList = ({ location }) => {
  const Toast = useToast();

  const [receipt, setReceipt] = useState({
    status: false,
    candidateName: "",
    token: "",
    timestamp: "",
    voterName: "",
    voterId: "",
  })
  const [electionInfo, setElectionInfo] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    getElectionInfo();
  }, []);


  useEffect(() => {
    const existingReceipt = JSON.parse(localStorage.getItem("receipt"));
    if (existingReceipt) {
      setReceipt(existingReceipt);
    }
  }, []);

  useEffect(() => {
    if (!electionInfo) return;
    if (electionInfo?.status == "declared") {
      getResult();
    } else if (electionInfo?.status == "ongoing") {
      getCandidates();
    } else if (electionInfo?.status == "upcoming") {
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
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vote/view/result`)
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
      <Timer targetDate={electionInfo?.endAt} />
      <Text textAlign={"center"} fontSize={"lg"} fontWeight={"semibold"} pt={4}>
        {electionInfo?.title}
      </Text>
      <Text textAlign={"center"} fontWeight={"medium"}>
        {electionInfo?.description}
      </Text>
      {electionInfo?.status == "declared" ? (
        <HStack wrap={"wrap"} justifyContent={"space-between"} py={4} gap={6} spacing={6}>
          <Box p={4} flex={1} rounded={12} boxShadow={'lg'} bgColor={'#FFF'}>
            <Text fontWeight={'medium'}>Observation 1:</Text>
            <Text fontSize={'sm'}>{electionInfo?.observation1 || "Statement Pending"}</Text>
          </Box>
          <Box p={4} flex={1} rounded={12} boxShadow={'lg'} bgColor={'#FFF'}>
            <Text fontWeight={'medium'}>Observation 2:</Text>
            <Text fontSize={'sm'}>{electionInfo?.observation2 || "Statement Pending"}</Text>
          </Box>
        </HStack>
      ) : null}
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

      <Receipt
        data={receipt}
        onClose={() => setReceipt((prev) => ({ ...prev, status: false }))}
      />
    </>
  );
};

export default CandidatesList;
