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

export async function createExam(
  exam: NewExam,
  accessToken: string,
): Promise<Exam> {
  const res = await client.post(
    "/exams",
    { exam },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  return res.data.exam
}

export async function updateExam(
  exam: Exam,
  accessToken: string,
): Promise<Exam> {
  const res = await client.patch(
    `/exams/${exam.id}`,
    { exam },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  return res.data.exam
}

export async function fetchExam(
  id: string,
  accessToken: string,
): Promise<Exam> {
  const res = await client.get(`/exams/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return res.data.exam
}

export async function fetchExams(accessToken: string): Promise<SimpleExam[]> {
  const res = await client.get(`/exams`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return res.data.exams
}

export async function startExam(
  examId: string,
  accessToken: string,
): Promise<void> {
  await client.post(
    `/exams/${examId}/start`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
}
