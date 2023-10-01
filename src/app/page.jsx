"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaLocationDot } from "react-icons/fa6";
import CandidatesList from "./candidates/page";
import ReactMarkdown from "react-markdown";
import axios from "axios";

export default function Home() {
  const Toast = useToast();
  const [location, setLocation] = useState("");

  const [consentModal, setConsentModal] = useState(false);

  const [electionInfo, setElectionInfo] = useState(null);

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
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
    const consentStatus = localStorage.getItem("consented");
    if (consentStatus == "true" || consentStatus == true) {
      setConsentModal(false);
    } else {
      setConsentModal(true);
    }
  }, []);

  useEffect(() => {
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
  }, []);

  return (
    <>
      <Box
        w={"full"}
        minH={"100vh"}
        bgImage={location ? "/gradient.jpg" : "/mountains.jpg"}
        bgPos={"center 20%"}
        bgSize={"cover"}
        transition={"all 0.3s ease"}
        p={8}
      >
        <HStack justifyContent={["flex-start", "center"]} w={"full"}>
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
        <Box w={"full"} pt={location ? 8 : 48}></Box>
        {location ? (
          <CandidatesList location={location} />
        ) : (
          <VStack>
            <FaLocationDot color="#333" size={"128"} />
            <Text fontWeight={"bold"} textAlign={"center"}>
              Please allow location access to participate
            </Text>
          </VStack>
        )}

        <Box w={"full"} pt={24}></Box>
        <Text
          fontSize={"xs"}
          textAlign={"center"}
          py={4}
          cursor={"pointer"}
          onClick={() => setConsentModal(true)}
        >
          By participating in this poll you agree to our Terms & Conditions
        </Text>
      </Box>

      {/* Terms & Conditions */}
      <Modal isOpen={consentModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Terms and conditions of use</ModalHeader>
          <ModalBody>
            <Box p={4}>
              {<ReactMarkdown>{electionInfo?.terms || ""}</ReactMarkdown>}
            </Box>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={"flex-end"}>
              <Button
                onClick={() => {
                  localStorage.setItem("consented", true);
                  setConsentModal(false);
                }}
              >
                Agree & Continue
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
