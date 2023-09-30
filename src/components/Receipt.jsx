"use client";
import {
  Avatar,
  Box,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { BsInfoCircleFill } from "react-icons/bs";

const Receipt = ({ data, onClose }) => {
  const {
    status,
    token,
    timestamp,
    candidateName,
    candidateAvatar,
    voterName,
    voterId,
  } = data;
  return (
    <>
      <Modal
        isCentered={true}
        isOpen={status}
        onClose={() => onClose()}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text
              textAlign={"center"}
              fontSize={"3xl"}
              fontWeight={"semibold"}
              className="messiri"
            >
              Haribol!
            </Text>
          </ModalHeader>
          <ModalBody>
            <VStack w={"full"}>
              <Text fontSize={"sm"} textAlign={"center"}>
                You have succesfully casted your vote for
              </Text>
              <Avatar name={candidateName} src={candidateAvatar} size={"lg"} />
              <Text textAlign={"center"} fontWeight={"semibold"}>
                {candidateName}
              </Text>
            </VStack>
            <Box
              py={4}
              w={"full"}
              borderBottom={"1px"}
              borderStyle={"dashed"}
              borderColor={"gray.300"}
            ></Box>
            <br />
            <Text textAlign={"center"}>Your Token</Text>
            <Text fontWeight={"bold"} textAlign={"center"}>
              {token}
            </Text>
            <br />
            <Text textAlign={"center"}>{voterName}</Text>
            <Text textAlign={"center"}>{voterId}</Text>
            <br />
            <br />
            <Box w={"full"}>
              <Text fontSize={"xs"} textAlign={"center"}>
                Voting Timestamp
              </Text>
              <Text fontSize={"sm"} textAlign={"center"} fontWeight={'medium'}>
                {new Date(timestamp || null)?.toLocaleString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <HStack w={"full"} justifyContent={"center"}>
              <BsInfoCircleFill size={10} />
              <Text fontSize={"sm"}>
                Please save this receipt for future references
              </Text>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Receipt;
