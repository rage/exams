import Axios from "axios"

const client = Axios.create({ baseURL: "http://localhost:3000/api/v0" })

export interface NewExam {
  name: string
  starts_at: Date
  ends_at: Date
  time_minutes: number
  pre_instructions: string
  exercises: NewExercise[]
}

export interface Exam {
  id: string
  name: string
  starts_at: string
  ends_at: string
  time_minutes: number
  pre_instructions: string
  exercises: Exercise[]
}

export interface SimpleExam {
  id: string
  name: string
  starts_at: string
  ends_at: string
  pre_instructions: string
  time_minutes: number
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

export async function updateExam(exam: Exam): Promise<Exam> {
  const res = await client.patch(`/exams/${exam.id}`, { exam })
  return res.data.exam
}

export async function fetchExam(id: string): Promise<Exam> {
  const res = await client.get(`/exams/${id}`)
  return res.data.exam
}

export async function fetchExams(): Promise<SimpleExam[]> {
  const res = await client.get(`/exams`)
  return res.data.exams
}
