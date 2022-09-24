import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { atom, selector } from 'recoil'
import { object, string, number, Asserts } from 'yup'
import type { PagedResponse } from './common'

export interface MachineType {
  id: number
  name: string
}

export async function getMachineList(axios: AxiosInstance): Promise<PagedResponse<MachineType[]>> {
  const response = await axios.get<PagedResponse<MachineType[]>>('/machines/')
  return response.data
}

export interface SeverityType {
  id: number
  name: string
  color: string
}

export interface ReasonType {
  id: number
  reason: string
}

export interface ActionType {
  id: number
  name: string
}

export interface AnomalyType {
  id: number
  timestamp: string
  machine: MachineType
  severity: SeverityType
  is_new: boolean
  sensor: string
  sound_clip: string
  suspected_reason?: ReasonType
  action_required?: ActionType
  comments?: string
}

export async function getAnomalyList(axios: AxiosInstance, machine: number | string): Promise<PagedResponse<AnomalyType[]>> {
  const response = await axios.get<PagedResponse<AnomalyType[]>>('/anomaly/', {
    params: {
      machine: machine.toString()
    }
  })
  return response.data
}

export const recoilAxios = atom<AxiosInstance>({
  key: 'recoilAxios',
  default: axios.create(),
})

export const recoilMachines = selector<MachineType[]>({
  key: 'machinesAtom',
  get: async ({ get }) => {
    const axios = get(recoilAxios)
    const response = await getMachineList(axios)
    return response.results
  }
})

export const recoilSelectedMachine = atom<MachineType | null>({
  key: 'recoilSelectedMachine',
  default: null,
})

export const recoilAnomalies = selector<AnomalyType[]>({
  key: 'recoilAnomalies',
  get: async ({ get }) => {
    const axios = get(recoilAxios)
    const selectedMachine = get(recoilSelectedMachine)
    if (selectedMachine === null) return []
    const response = await getAnomalyList(axios, selectedMachine.id)
    return response.results
  }
})

export const reasonSchema = object({
  id: number().integer().required(),
  reason: string().required(),
})

export const actionSchema = object({
  id: number().integer().required(),
  name: string().required(),
})

export const anomalyUpdateSchema = object({
  suspected_reason: reasonSchema.nullable().optional(),
  action_required: actionSchema.nullable().optional(),
  comments: string(),
})

export async function patchAnomaly(
  axios: AxiosInstance,
  id: number,
  anomaly: Asserts<typeof anomalyUpdateSchema>
) {
  const response = await axios.patch(`/anomaly/${id}/`, {
    body: anomaly
  })
  console.log(response.data)
  return response.data
}

export async function markedAnomalyIsNotNew(
  axios: AxiosInstance,
  id: number,
) {
  const response = await axios.patch(`/anomaly/${id}/`, {
    body: { 'is_new': false }
  })
  console.log(response.data)
  return response.data
}
