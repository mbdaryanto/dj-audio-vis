import { AnomalyType } from "./api/alerts";
import { object, string, number } from 'yup'
import { Form, Formik } from "formik";
import { Button, FormControl, FormLabel, Select, Text, Textarea, VStack } from "@chakra-ui/react";

const reasonSchema = object({
  id: number().integer().required(),
  reason: string().required(),
})

const actionSchema = object({
  id: number().integer().required(),
  name: string().required(),
})

const anomalyUpdateSchema = object({
  suspected_reason: reasonSchema.nullable().optional(),
  action_required: actionSchema.nullable().optional(),
  comments: string(),
})

function AnomalyForm({ initialValues }: {
  initialValues: AnomalyType
}) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={anomalyUpdateSchema}
      onSubmit={async () => {

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

            <FormControl>
              <FormLabel>Suspected Reason</FormLabel>
              <Textarea
              />
            </FormControl>

            <Button type="submit" colorScheme="blue">UPDATE</Button>
          </VStack>
        </Form>
      )}
    </Formik>
  )
}

export default AnomalyForm
