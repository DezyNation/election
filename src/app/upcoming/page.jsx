"use client";
import Timer from "@/components/Timer";
import { Box, Text, VStack, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";

const page = () => {
  const Toast = useToast();
  const [electionInfo, setElectionInfo] = useState(null);

  useEffect(() => {
    getElectionInfo();
  }, []);

  useEffect(() => {
    if(!electionInfo) return
    if (electionInfo?.status != "upcoming") {
      window.location.assign("/candidates")
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

  return (
    <>
      <VStack w={'full'} h={'100vh'} bgImage={'/gradient.jpg'} p={8}>
        <Text fontWeight={"semibold"} fontSize={"2xl"}>
          The election has not started yet!
        </Text>
        <br />
        <Timer targetDate={new Date(electionInfo?.startAt)} title={"The election will start in"} />
      </VStack>
    </>
  );
};

export default page;
