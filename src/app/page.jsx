"use client";
import { useEffect, useState } from "react";
import { Box, HStack, Image, Text, VStack, useToast } from "@chakra-ui/react";
import { FaLocationDot } from "react-icons/fa6";
import CandidatesList from "./candidates/page";
import Timer from "@/components/Timer";

export default function Home() {
  const Toast = useToast();
  const [location, setLocation] = useState("");
  const [locationStatus, setLocationStatus] = useState("");
  const [myVote, setMyVote] = useState("");

  const tomorrow = new Date().setDate(new Date().getDate() + 1);

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  function success(pos) {
    var crd = pos.coords;
    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    setLocation(`${crd.latitude}, ${crd.longitude}`);
  }

  function errors(err) {
    Toast({
      status: "error",
      title: `GEO LOCATION ERROR (${err.code})`,
      description: err.message,
    });
  }
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          setLocationStatus(result.state);
          if (result.state === "granted") {
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "prompt") {
            //If prompt then the user will be asked to give permission
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
        });
    } else {
      Toast({
        title: "Please try another device or browser",
        description: "Geolocation is not supported by this browser.",
      });
    }
  }, []);

  useEffect(() => {
    console.log(location);
    console.log(locationStatus);
  }, [location]);

  return (
    <Box
      w={"full"}
      minH={"100vh"}
      bgImage={location ? "/gradient.jpg" : "/mountains.jpg"}
      bgPos={"center 20%"}
      bgAttachment={"fixed"}
      bgSize={"cover"}
      transition={"all 0.3s ease"}
      p={8}
    >
      <HStack justifyContent={"center"} w={"full"}>
        <Image src="/logo.png" boxSize={"12"} />
        <Box>
          <Text
            fontSize={"2xl"}
            className="messiri"
            fontWeight={"semibold"}
            color={"#444"}
          >
            Elections at KCS
          </Text>
          <Text fontSize={"10"} marginTop={"-2"}>
            Inspired by DoM
          </Text>
        </Box>
      </HStack>
      {locationStatus == "granted" ? <Timer targetDate={tomorrow} /> : <Box w={"full"} pt={48}></Box>}
      {locationStatus == "granted" ? (
        <CandidatesList />
      ) : (
        <VStack>
          <FaLocationDot color="#333" size={"128"} />
          <Text fontWeight={"bold"} textAlign={"center"}>
            Please allow location access to participate
          </Text>
        </VStack>
      )}
    </Box>
  );
}
