export type Note = {
  id: string
  title: string
  body: string
  createdAt: string
  updatedAt: string
}

export type NoteSortOrder = 'updated-desc' | 'updated-asc'
