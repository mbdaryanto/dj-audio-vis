import { Field, Form, Formik } from "formik";
import { Button, FormControl, FormErrorMessage, FormLabel, Select, Text, Textarea, useToast, VStack } from "@chakra-ui/react";
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
      onSubmit={async (values, { resetForm, setErrors }) => {
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

            console.log(axiosError.response!.data!)
            if (axiosError.response!.status === 400) {
              const errorFields = Object.keys(axiosError.response!.data!)
              const errors = Object.fromEntries(
                Object.entries(axiosError.response!.data!)
                  .map(([key, value]) => [key, value.join("\n")])
              )
              setErrors(errors)
            }

            toast({
              status: "error",
              title: "update failed",
              description: axiosError.response?.data?.detail,
            })
          }
        }
      }}
    >
      {({ values, errors, isSubmitting, setFieldValue }) => (
        <Form>
          <VStack spacing={4} align="left">
            <FormControl>
              <FormLabel>Equipment</FormLabel>
              <Text>{initialValues.machine.name}</Text>
            </FormControl>

            <Field name="suspected_reason">
              {({ field, meta }) => (
                <FormControl isInvalid={meta.touched && !!meta.error}>
                  <FormLabel>Suspected Reason</FormLabel>
                  <Select
                    maxW="270px"
                    value={field?.id}
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
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="action_required">
              {({ field, meta }) => (
                <FormControl isInvalid={meta.touched && !!meta.error}>
                  <FormLabel>Action Required</FormLabel>
                  <Select
                    maxW="270px"
                    value={field?.id}
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
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="comments">
              {({ field, meta }) => (
              <FormControl isInvalid={meta.touched && !!meta.error}>
                <FormLabel>Comments</FormLabel>
                <Textarea {...field}/>
                <FormErrorMessage>{meta.error}</FormErrorMessage>
              </FormControl>
              )}
            </Field>

            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              maxW="270px"
              onClick={() => {
                console.log(errors)
              }}
            >
              UPDATE
            </Button>
          </VStack>
        </Form>
      )}
    </Formik>
  )
}

export default AnomalyForm
