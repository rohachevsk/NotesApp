import type { Note } from '../types/note'

const STORAGE_KEY = 'notes'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isValidDate = (value: string) => !Number.isNaN(Date.parse(value))

const normalizeNote = (value: unknown): Note | null => {
  if (!isRecord(value)) return null

  const { id, title, body, createdAt, updatedAt } = value

  if (
    typeof id === 'string' &&
    typeof title === 'string' &&
    typeof body === 'string' &&
    typeof createdAt === 'string' &&
    typeof updatedAt === 'string' &&
    title.trim() &&
    body.trim() &&
    isValidDate(createdAt) &&
    isValidDate(updatedAt)
  ) {
    return {
      id,
      title: title.trim(),
      body: body.trim(),
      createdAt,
      updatedAt,
    }
  }

  // Keep notes created by the original one-field version of the app.
  if (typeof value.text === 'string' && value.text.trim()) {
    const text = value.text.trim()
    const legacyDate = typeof value.id === 'number' ? new Date(value.id) : new Date()
    const timestamp = Number.isNaN(legacyDate.getTime())
      ? new Date().toISOString()
      : legacyDate.toISOString()

    return {
      id: typeof value.id === 'number' ? String(value.id) : crypto.randomUUID(),
      title: text.split('\n')[0].slice(0, 60),
      body: text,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
  }

  return null
}

export const loadNotes = (): Note[] => {
  try {
    const savedNotes = localStorage.getItem(STORAGE_KEY)
    if (!savedNotes) return []

    const parsedNotes: unknown = JSON.parse(savedNotes)
    if (!Array.isArray(parsedNotes)) return []

    return parsedNotes
      .map(normalizeNote)
      .filter((note): note is Note => note !== null)
  } catch {
    return []
  }
}

export const saveNotes = (notes: Note[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {
    // Browsers can deny storage access or run out of quota.
  }
}
