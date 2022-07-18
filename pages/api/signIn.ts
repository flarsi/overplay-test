import { NextApiRequest, NextApiResponse } from "next";

type ResponseError = {
  message: string;
};

export default async function signInHandler(
  req: NextApiRequest,
  res: NextApiResponse<string | ResponseError>
) {
  const { query } = req;
  const { email, password } = query;
  const body = JSON.stringify({email, password})

  const response = await fetch(`http://localhost:8080/api/signin`, {
    body,
    method: "POST"
  }).then((res) => res.json()).then(data => data)
  return response
    ? res.status(200).json(response)
    : res.status(404).json({ message: `User with this email: ${email} not found or password wrong.` });
}
