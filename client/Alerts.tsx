import { Box, Center, Grid, GridItem, Heading, HStack, Image, LinkBox, LinkOverlay, Select, Text, VStack } from "@chakra-ui/react"
import { useRecoilState, useRecoilValue } from "recoil"
import { recoilAnomalies, recoilMachines, recoilSelectedMachine, AnomalyType } from "./api/alerts"
import { FaCaretLeft as BackIcon } from 'react-icons/fa'
import { useEffect, useState } from "react"
import { format, parseISO, previousDay } from "date-fns"
import AnomalyForm from "./AnomalyForm"


function formatId(id: number) {
  return String(id).padStart(8, '0');
}

function formatDateTime(s: string) {
  return format(parseISO(s), 'yyyy-MM-dd HH:mm:ss')
}

function AlertsPage() {
  const machines = useRecoilValue(recoilMachines)
  const [selectedMachine, setSelectedMachine] = useRecoilState(recoilSelectedMachine)
  const anomalies = useRecoilValue(recoilAnomalies)
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyType>()

  useEffect(() => {
    if (selectedMachine === null && Array.isArray(machines) && machines.length > 0) {
      setSelectedMachine(machines[0])
      setSelectedAnomaly(undefined)
    }
  }, [machines, selectedMachine])

  useEffect(() => {
    if (selectedAnomaly === undefined && Array.isArray(anomalies) && anomalies.length > 0) {
      setSelectedAnomaly(anomalies[0])
    }
  }, [anomalies, selectedAnomaly])

  return (
    <VStack w="100%" h="100%" spacing="0">
      <Box borderBottom="1px solid #72757A" w="100%" py="2px" px="14px">
        <Select
          maxW="200px"
          value={selectedMachine?.id ?? 1}
          onChange={(ev) => {
            const machineId = parseInt(ev.target.value)
            const _selected = machines.find((value) => value.id === machineId)
            if (_selected) setSelectedMachine(_selected)
          }}
        >
          {machines.map(({ id, name }) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </Select>
      </Box>
      <HStack w="100%" spacing="0" align="start">
        <Box borderRight="1px solid #72757A" w="25%" h="100%">
          <VStack w="100%" h="100%">
            <HStack spacing="2" borderBottom="1px solid #72757A" w="100%" p="14px">
              <BackIcon/>
              <Text>Back</Text>
            </HStack>

            <HStack spacing="2" borderBottom="1px solid #72757A" w="100%" px="14px" pt="4px" pb="10px" align="center">
              <Text>{anomalies.length} Alerts</Text>
              <Text
                bgColor="#3478FC"
                borderRadius={11}
                px="11px"
                py="2px"
                h="24px"
                textColor="white"
              >
                {anomalies.map(value => value.is_new ? 1 : 0).reduce((prev, current) => prev + current, 0)} New
              </Text>
            </HStack>

            <VStack spacing="10px" p="10px" w="100%">
              {anomalies.map((value) => (
                <LinkBox
                  key={value.id}
                  px="20px"
                  py="2px"
                  border={(selectedAnomaly && (selectedAnomaly.id === value.id)) ? "2px solid #3478FC" : "1px solid #72757A"}
                  w="100%"
                  _hover={{
                    bgColor: '#ddf'
                  }}
                  onClick={() => {
                    console.log('clicked on the LinkBox')
                    setSelectedAnomaly(value)
                  }}
                >
                  <VStack align="left" spacing="2px">
                    <Box pos="relative">
                      <LinkOverlay
                        href="#"
                        // onClick={(ev) => {
                        //   console.log('clicked on the overlay')
                        //   ev.preventDefault()
                        //   ev.stopPropagation()
                        // }}
                      >
                        ID #{formatId(value.id)}
                      </LinkOverlay>
                      {value.is_new && (
                        <Box
                          pos="absolute"
                          top="-23px"
                          left="-18px"
                          fontSize="40px"
                          textColor="#3478FC"
                        >
                          &bull;
                        </Box>
                      )}
                      <Box
                        pos="absolute"
                        top="2px"
                        right="-5px"
                        h="24px"
                        w="80px"
                        borderRadius="11px"
                        textColor="white"
                        textAlign="center"
                        bgColor={value.severity.color}
                      >
                        {value.severity.name}
                      </Box>
                    </Box>

                    <Text pt="5px" fontWeight="bold">{value.suspected_reason?.reason ?? 'Unknown Anomaly'}</Text>
                    <Text>Detected at {formatDateTime(value.timestamp)}</Text>
                    <Text pt="5px" pb="5px" textColor="#3478FC">{value.machine.name}</Text>

                  </VStack>
                </LinkBox>
              ))}
            </VStack>

          </VStack>
        </Box>
        <Box w="75%" h="100%" borderLeft="1px solid #72757A">
          {selectedAnomaly && (
            <VStack w="100%" p="20px" align="left">
              <Heading fontSize="30px" fontWeight="light">Alert ID #{formatId(selectedAnomaly.id)}</Heading>
              <Text>Detected at {formatDateTime(selectedAnomaly.timestamp)}</Text>
              <Box bgColor="#72757A" w="100%" h="1px" mt="20px" mb="20px"></Box>
              <Grid templateColumns="1fr 1fr" gap="8px">
                <GridItem>
                  <AudioTrackVis
                    title="Anomaly Machine Output"
                    audioUrl={selectedAnomaly.sound_file}
                    imageUrl={selectedAnomaly.plot_image ?? `/anomaly/${selectedAnomaly.id}/waveform/`}
                  />
                </GridItem>
                <GridItem>
                  <AudioTrackVis
                    title="Normal Machine Output"
                    audioUrl={selectedAnomaly.sound_file}
                    imageUrl={selectedAnomaly.plot_image ?? `/anomaly/${selectedAnomaly.id}/waveform/`}
                  />
                </GridItem>
              </Grid>
              <AnomalyForm
                key={selectedAnomaly.id}
                initialValues={selectedAnomaly}
                onSave={(savedData) => setSelectedAnomaly((prev) => ({...prev, ...savedData}))}
              />
            </VStack>
          )}
        </Box>
      </HStack>
    </VStack>
  )
}

const AudioTrackVis = ({ title, audioUrl, imageUrl }: {
  title: string
  audioUrl: string
  imageUrl: string
}) => (
  <VStack align="left">
    <Text fontSize="24">{title}</Text>
    <audio controls>
      <source src={audioUrl} type="audio/x-wav" />
    </audio>
    <Image src={imageUrl} />
  </VStack>
)

export default AlertsPage
