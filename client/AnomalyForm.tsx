import { Field, Form, Formik } from "formik";
import { Button, FormControl, FormLabel, Select, Text, Textarea, useToast, VStack } from "@chakra-ui/react";
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import type { AxiosError } from "axios"
import { AnomalyType, anomalyUpdateSchema, updateAnomaly, recoilActions, recoilAnomalies, recoilAxios, recoilMachines, recoilReasons } from "./api/alerts";


function AnomalyForm({ initialValues, onSave }: {
  initialValues: AnomalyType
  onSave?: (values: Partial<AnomalyType>) => void
}) {
  const toast = useToast()
  const axios = useRecoilValue(recoilAxios)
  const refreshAnomalies = useRecoilRefresher_UNSTABLE(recoilAnomalies)
  const availableActions = useRecoilValue(recoilActions)
  const availableReasons = useRecoilValue(recoilReasons)

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={anomalyUpdateSchema}
      onSubmit={async (values, { resetForm }) => {
        try {
          const validated = await anomalyUpdateSchema.validate({
            ...values,
            is_new: false,
          })
          const response = await updateAnomaly(axios, initialValues.id, validated)
          toast({
            status: "success",
            title: "update successful",
          })
          onSave(response)
          refreshAnomalies()
          resetForm({ values: {...initialValues, ...response}})
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
      {({ values, isSubmitting, setFieldValue }) => (
        <Form>
          <VStack spacing={4} align="left">
            <FormControl>
              <FormLabel>Equipment</FormLabel>
              <Text>{initialValues.machine.name}</Text>
            </FormControl>

            <FormControl>
              <FormLabel>Suspected Reason</FormLabel>
              <Select
                maxW="270px"
                value={values.suspected_reason?.id}
                onChange={(ev) => {
                  if (ev.target.value === null || ev.target.value === undefined) {
                    setFieldValue('suspected_reason', null)
                    return
                  }
                  try {
                    const newId = parseInt(ev.target.value)
                    const newReason = availableReasons.find(value => value.id === newId)
                    setFieldValue('suspected_reason', newReason)
                  } catch (err) {
                    setFieldValue('suspected_reason', null)
                  }
                }}
              >
                <option>Unknown Anomaly</option>
                {availableReasons.map(({ id, reason }) => (
                  <option key={id} value={id}>{reason}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Action Required</FormLabel>
              <Select
                maxW="270px"
                value={values.action_required?.id}
                onChange={(ev) => {
                  if (ev.target.value === null || ev.target.value === undefined) {
                    setFieldValue('action_required', null)
                    return
                  }
                  try {
                    const newId = parseInt(ev.target.value)
                    const newAction = availableActions.find(value => value.id === newId)
                    setFieldValue('action_required', newAction)
                  } catch (err) {
                    setFieldValue('action_required', null)
                  }
                }}
              >
                <option>Select Action</option>
                {availableActions.map(({ id, name }) => (
                  <option key={id} value={id}>{name}</option>
                ))}
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

            <Button type="submit" colorScheme="blue" isLoading={isSubmitting} maxW="270px">UPDATE</Button>
          </VStack>
        </Form>
      )}
    </Formik>
  )
}

export default AnomalyForm
