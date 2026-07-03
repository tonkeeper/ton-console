export type ApiErrorBody = {
  error?: string
  code?: number
}

export function isUnauthorizedError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false
  }

  if ("status" in error && error.status === 401) {
    return true
  }

  if ("error" in error) {
    const responseError = (error as { error?: unknown }).error

    if (responseError && typeof responseError === "object") {
      if ("status" in responseError && responseError.status === 401) {
        return true
      }

      if ("code" in responseError && responseError.code === 0) {
        return true
      }
    }
  }

  return false
}

export function getApiErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "error" in error) {
    const responseError = (error as { error?: unknown }).error

    if (typeof responseError === "string") {
      return responseError
    }

    if (
      responseError &&
      typeof responseError === "object" &&
      "error" in responseError &&
      typeof (responseError as ApiErrorBody).error === "string"
    ) {
      return (responseError as ApiErrorBody).error
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Something went wrong. Please try again."
}
