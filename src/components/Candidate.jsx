"use client";
import {
  Avatar,
  Box,
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  Progress,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import FullPageLoader from "./FullPageLoader";
import axios from "axios";
import Receipt from "./Receipt";

const Candidate = ({
  id,
  name,
  avatar,
  myLocation,
  resultDeclared,
  totalVotes,
  tokens,
}) => {
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

  const [tokenModalStatus, setTokenModalStatus] = useState(false);

  function casteVote() {
    setLoading(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vote/caste-vote`, {
        candidateId: id,
        secretPin: pin,
        location: myLocation,
      })
      .then((res) => {
        setLoading(false);
        if (!res.data?.token) {
          Toast({
            description: "No Token!",
          });
          return;
        }
        onToggle();
        const data = {
          ...receipt,
          status: true,
          candidateName: name,
          token: res.data?.token,
          timestamp: res.data?.createdAt,
          voterName: res.data?.voterName,
          voterId: res.data?.voterId,
        };
        setReceipt(data);
        localStorage.setItem("receipt", JSON.stringify(data));
      })
      .catch((error) => {
        onToggle();
        Toast({
          status: "error",
          title: "Error occured while voting",
          description:
            error?.response?.data?.error?.message ||
            error?.response?.data?.message ||
            error?.message,
        });
      });
  }

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
            {resultDeclared ? (
              <Box w={"full"}>
                <Progress
                  value={(Number(tokens?.length) / parseInt(totalVotes)) * 100}
                  colorScheme="yellow"
                  w={"full"}
                  rounded={"full"}
                />
                <Text
                  textAlign={"right"}
                  fontSize={"sm"}
                  fontWeight={"semibold"}
                >
                  {parseInt(tokens?.length)}{" "}
                  Votes
                </Text>
                <br />
                <Button w={"full"} onClick={() => setTokenModalStatus(true)}>
                  View Vote Tokens
                </Button>
              </Box>
            ) : (
              <Button
                w={"full"}
                bgColor={
                  resultDeclared || receipt?.candidateName == name
                    ? "whatsapp.500"
                    : "#333"
                }
                color={"#FFF"}
                colorScheme={
                  resultDeclared || receipt?.candidateName == name
                    ? "whatsapp"
                    : "teal"
                }
                leftIcon={<FaCheck />}
                onClick={() => {
                  if (!resultDeclared && receipt?.candidateName != name)
                    onToggle();
                  else console.log("Result declared!");
                }}
              >
                {receipt?.candidateName == name
                  ? "Your Voted Candidate"
                  : "Vote This Candidate"}
              </Button>
            )}
          </Skeleton>
        </VStack>
      </Box>

      <Receipt
        data={receipt}
        onClose={() => setReceipt((prev) => ({ ...prev, status: false }))}
      />

      {/* Voter ID Modal */}
      <Modal isOpen={isOpen} onClose={onToggle} isCentered={true}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please Enter Your Secret PIN</ModalHeader>
          <ModalBody py={8}>
            <Input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              textAlign={"center"}
              placeholder="Your Secret PIN"
              variant={"flushed"}
              textTransform={"uppercase"}
            />
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={"flex-end"} gap={6}>
              <Button onClick={onToggle}>Cancel</Button>
              <Button
                color={"#FFF"}
                bgColor={"#333"}
                colorScheme="teal"
                onClick={() => casteVote()}
              >
                Confirm
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Tokens List */}
      <Modal
        isOpen={tokenModalStatus}
        onClose={() => setTokenModalStatus(false)}
        isCentered={true}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{name}'s Vote Tokens</ModalHeader>
          <ModalBody py={8}>
            {tokens?.map((voteToken, key) => (
              <Text
                key={key}
                p={2}
                my={2}
                rounded={4}
                bgColor={
                  receipt?.token == voteToken ? "whatsapp.50" : "twitter.50"
                }
                border={"1px"}
                borderColor={
                  receipt?.token == voteToken ? "whatsapp.50" : "twitter.50"
                }
              >
                {voteToken}
              </Text>
            ))}
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={"flex-end"} gap={6}>
              <Button onClick={() => setTokenModalStatus(false)}>Close</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Candidate;
