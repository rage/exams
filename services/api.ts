import Axios from "axios"

const client = Axios.create({ baseURL: "http://localhost:3000/api/v0" })

export interface NewExam {
  name: string
  starts_at: Date
  ends_at: Date
  exercises: NewExercise[]
}

export interface Exam {
  id: string
  name: string
  starts_at: string
  ends_at: string
  exercises: Exercise[]
}

export interface NewExercise {
  content: string
}

export interface Exercise extends NewExercise {
  id: string
}

export async function createExam(exam: NewExam): Promise<Exam> {
  const res = await client.post("/exams", { exam })
  return res.data.exam
}

export async function fetchExam(id: string): Promise<Exam> {
  const res = await client.get(`/exams/${id}`)
  return res.data.exam
}
