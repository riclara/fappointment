export const state = () => ({
  api: process.env.NODE_ENV === 'production' ? 'https://evening-fortress-57965.herokuapp.com' : 'http://localhost:8000'
})
