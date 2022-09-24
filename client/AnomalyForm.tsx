import { Field, Form, Formik } from "formik";
import { Button, FormControl, FormLabel, Select, Text, Textarea, useToast, VStack } from "@chakra-ui/react";
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import type { AxiosError } from "axios"
import { AnomalyType, anomalyUpdateSchema, patchAnomaly, recoilAnomalies, recoilAxios } from "./api/alerts";
import axios from "axios";


function AnomalyForm({ initialValues }: {
  initialValues: AnomalyType
}) {
  const toast = useToast()
  const axios = useRecoilValue(recoilAxios)
  const refreshAnomalies = useRecoilRefresher_UNSTABLE(recoilAnomalies)
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={anomalyUpdateSchema}
      onSubmit={async (values) => {
        try {
          const validated = await anomalyUpdateSchema.validate(values)
          const response = await patchAnomaly(axios, initialValues.id, validated)
          toast({
            status: "success",
            title: "update successful",
          })
          refreshAnomalies()
        } catch (err) {
          const axiosError = err as AxiosError
          if (axiosError.isAxiosError) {
            toast({
              status: "error",
              title: "update failed",
              description: axiosError.response?.data?.detail,
            })
          }
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <VStack spacing={4} align="left">
            <FormControl>
              <FormLabel>Equipment</FormLabel>
              <Text>{initialValues.machine.name}</Text>
            </FormControl>

            <FormControl>
              <FormLabel>Suspected Reason</FormLabel>
              <Select>
                <option>Unknown Anomaly</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Action Required</FormLabel>
              <Select>
                <option>Select Action</option>
              </Select>
            </FormControl>

            <Field name="comments">
              {({ field }) => (
              <FormControl>
                <FormLabel>Comments</FormLabel>
                <Textarea {...field}/>
              </FormControl>
              )}
            </Field>

            <Button type="submit" colorScheme="blue">UPDATE</Button>
          </VStack>
        </Form>
      )}
    </Formik>
  )
}

export default AnomalyForm
