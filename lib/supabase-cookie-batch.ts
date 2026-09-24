type CookieChange = {
  name: string
  value: string
  options?: any
}

type RequestWithCookies = {
  cookies: { set: (name: string, value: string) => unknown }
}

type ResponseWithCookies = {
  cookies: { set: (name: string, value: string, options?: any) => unknown }
}

export function applySupabaseCookieBatch<TRequest extends RequestWithCookies, TResponse extends ResponseWithCookies>(
  request: TRequest,
  createResponse: (request: TRequest) => TResponse,
  cookiesToSet: CookieChange[],
): TResponse {
  for (const { name, value } of cookiesToSet) request.cookies.set(name, value)

  const response = createResponse(request)
  for (const { name, value, options } of cookiesToSet) {
    response.cookies.set(name, value, options)
  }
  return response
}
