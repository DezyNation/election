"use client";
import {
  Avatar,
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { FaCheck } from "react-icons/fa6";
import FullPageLoader from "./FullPageLoader";
import axios from "axios";
import Receipt from "./Receipt";

const Candidate = ({ id, name, avatar, myLocation }) => {
  const Toast = useToast();
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState("");
  const [receipt, setReceipt] = useState({
    status: false,
    candidateName: "",
    token: "",
    timestamp: "",
    voterName: "",
    voterId: "",
  });
  const { isOpen, onToggle } = useDisclosure();

  function casteVote() {
    setReceipt({
      ...receipt,
      status: true,
      candidateName: res.data?.candidateName || "Samarth Aggarwal",
      token: res.data?.token || "sdrftghj4567ojlkh",
      timestamp: res.data?.createdAt,
      voterName: res.data?.voterName || "Rama Das",
      voterId: res.data?.voterId || "23456",
    });
    onToggle()
    // setLoading(true);
    // axios
    //   .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/caste-vote`, {
    //     candidateId: id,
    //     secretPin: pin,
    //   })
    //   .then((res) => {
    //     setLoading(false);
    //     const data = {
    //       ...receipt,
    //       status: true,
    //       candidateName: res.data?.candidateName,
    //       token: res.data?.token,
    //       timestamp: res.data?.createdAt,
    //       voterName: res.data?.voterName,
    //       voterId: res.data?.voterId,
    //     };
    //     setReceipt(data);
    //     localStorage.setItem("receipt", JSON.stringify(data));
    //   })
    //   .catch((error) => {
    //     Toast({
    //       status: "error",
    //       title: "Error occured while voting",
    //       description:
    //         error?.response?.data?.error?.message ||
    //         error?.response?.data?.message ||
    //         error?.message,
    //     });
    //   });
  }

  useEffect(() => {
    const existingReceipt = JSON.parse(localStorage.getItem("receipt"));
    if (existingReceipt) {
      setLoading(true);
      setReceipt(existingReceipt);
    }
  }, []);

  return (
    <>
      {loading ? <FullPageLoader /> : null}
      <Box
        w={["full", "xs"]}
        p={4}
        boxShadow={"lg"}
        rounded={12}
        bgColor={"rgba(255, 255, 255, .7)"}
        backdropFilter={"auto"}
        backdropBlur={"5px"}
      >
        <VStack w={"full"}>
          <SkeletonCircle
            size={Boolean(name) ? 12 : 20}
            isLoaded={Boolean(name)}
          >
            <Avatar size={"lg"} name={name} src={avatar} />
          </SkeletonCircle>
          <Skeleton mt={4} padding={3} w={"56"} isLoaded={Boolean(name)}>
            <Text
              textAlign={"center"}
              fontSize={"xl"}
              className="messiri"
              fontWeight={"semibold"}
            >
              {name}
            </Text>
          </Skeleton>
          <Skeleton mt={4} w={"56"} isLoaded={Boolean(id)}>
            <Button
              w={"full"}
              bgColor={"#333"}
              color={"#FFF"}
              colorScheme="teal"
              leftIcon={<FaCheck />}
              onClick={onToggle}
            >
              Vote This Candidate
            </Button>
          </Skeleton>
        </VStack>
      </Box>

      <Receipt
        data={receipt}
        onClose={() => setReceipt({ ...receipt, status: false })}
      />

      {/* Voter ID Modal */}
      <Modal isOpen={isOpen} onClose={onToggle} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please Enter Your Secret PIN</ModalHeader>
          <ModalBody py={8}>
            <HStack justifyContent={"center"}>
              <PinInput mask otp onComplete={(value) => setPin(value)}>
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={"flex-end"} gap={6}>
              <Button onClick={onToggle}>Cancel</Button>
              <Button
                color={"#FFF"}
                bgColor={"#333"}
                colorScheme="teal"
                onClick={()=>casteVote()}
              >
                Confirm
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Candidate;
