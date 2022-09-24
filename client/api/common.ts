import { AxiosError } from "axios"


export interface PagedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T
}

export interface ErrorResponse {
  detail?: string | any
  non_field_errors?: string[]
}

export const nf = new Intl.NumberFormat()

export function getAxiosErrorDetail(error: any): string {
  const axiosError = error as AxiosError
  if (axiosError.isAxiosError) {
    if (!axiosError.response || !axiosError.response.data) return axiosError.message
    const errorResponse = error.response!.data! as ErrorResponse
    if (errorResponse.detail) {
      if (typeof errorResponse.detail === "string")
        return errorResponse.detail
      else return JSON.stringify(errorResponse.detail)
    }
    if (errorResponse.non_field_errors) {
      return errorResponse.non_field_errors.join("\n")
    }
    return axiosError.response.statusText
  }
  return "Unknown error"
}
