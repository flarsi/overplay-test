import { NextApiRequest, NextApiResponse } from "next";

type ResponseError = {
  message: string;
};

export default async function animationHandler(
  req: NextApiRequest,
  res: NextApiResponse<string | ResponseError>
) {
  const { query } = req;
  const { name } = query;

  const response = await fetch(`http://localhost:8080/api/animations`, {
    method: "GET"
  }).then((res) => res.json()).then(data => data)
  return response
    ? res.status(200).json(response)
    : res.status(404).json({ message: `Animation with name: ${name} not found.` });
}
