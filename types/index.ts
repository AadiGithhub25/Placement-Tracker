export interface RouteParams {
  params: {
    id: string
  }
}

export interface SessionUser {
  id: string
  email: string
  name: string
  role: string
}
