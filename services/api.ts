import Axios from "axios"

const client = Axios.create({ baseURL: "/api/v0" })

export interface NewExam {
  name: String
  starts_at: Date
  ends_at: Date
  exercises: Exercise[]
}

export interface Exercise {
  content: String
}

export async function createExam(exam: NewExam) {
  const res = await client.post("/exams", { exam })
  console.log(JSON.stringify(res.data))
}
