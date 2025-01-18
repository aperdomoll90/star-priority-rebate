import { Client, Environment, ApiError } from 'square'

const client = new Client({
  accessToken: process.env.SQUARE_UP_KEY,
  environment: Environment.Production,
})

export const getProducts = async () => {
  try {
    const response = await client.catalogApi.listCatalog()

    return response.result.objects
  } catch (error) {
    console.log(error)
  }
}