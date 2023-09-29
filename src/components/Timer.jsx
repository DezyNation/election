"use client";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const Timer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  function calculateTimeLeft(targetDate) {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  }
  return (
    <>
      <HStack w={'full'} justifyContent={'center'}>
        <VStack
          w={["full", "xs"]}
          my={8}
          p={4}
          bgColor={"#FFFFFF64"}
          backdropFilter={'auto'}
          backdropBlur={'6px'}
          rounded={12}
          boxShadow={"md"}
        >
          <Text textAlign={"center"} fontSize={'xs'} className="messiri">This Election Will End In</Text>
          <HStack gap={8} alignItems="flex-end">
            <Box>
              <Text textAlign={"center"} fontWeight={"bold"} fontSize={"4xl"}>
                {timeLeft?.days}
              </Text>
              <Text
                textAlign={"center"}
                fontWeight={"medium"}
                marginTop={"-2"}
                fontSize={"xs"}
              >
                DAYS
              </Text>
            </Box>
            <Box>
              <Text textAlign={"center"} fontWeight={"bold"} fontSize={"4xl"}>
                {timeLeft?.hours}
              </Text>
              <Text
                textAlign={"center"}
                fontWeight={"medium"}
                marginTop={"-2"}
                fontSize={"xs"}
              >
                HOURS
              </Text>
            </Box>
            <Box>
              <Text textAlign={"center"} fontWeight={"bold"} fontSize={"4xl"}>
                {timeLeft?.minutes}
              </Text>
              <Text
                textAlign={"center"}
                fontWeight={"medium"}
                marginTop={"-2"}
                fontSize={"xs"}
              >
                MINS.
              </Text>
            </Box>
            <Box>
              <Text textAlign={"center"} fontWeight={"bold"} fontSize={"4xl"}>
                {timeLeft?.seconds}
              </Text>
              <Text
                textAlign={"center"}
                fontWeight={"medium"}
                marginTop={"-2"}
                fontSize={"xs"}
              >
                SEC.
              </Text>
            </Box>
          </HStack>
        </VStack>
      </HStack>
    </>
  );
};

export default Timer;
