// Create new domain

import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import isAdmin from "../../lib/isAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  // const { token } = req.cookies;
  const { _id } = req.body;

  // if (!token) {
  //   return res.status(400).json({
  //     message: "Token is not provided",
  //     type: "UNAUTHORIZED",
  //   });
  // }

  // const { username } = jwt.verify(token, process.env.JWT_SECRET) as {
  //   username: string;
  // };

  // // Find the adminUser with the given username
  // // @ts-ignore
  // const admin = await User.findOne({
  //   username,
  // });

  // // If there is no adminUser with the given username
  // if (!admin || admin.role !== "admin") {
  //   return res.status(400).json({
  //     message: "Username or password is incorrect",
  //     type: "UNAUTHORIZED",
  //   });
  // }

  // Find the state
  // @ts-ignore
  // const state = await State.findOne({});
  // if (!state) {
  //   return res.status(500).json({
  //     message: "Server error",
  //     type: "SERVER_ERROR",
  //   });
  // }

  // Check if the user is admin
  await isAdmin(req, res);

  // Find the User
  // @ts-ignore
  const user = await User.findOne({
    _id,
  });

  if (!user) {
    return res.status(400).json({
      message: "User does not exist",
      type: "NOTFOUND",
    });
  }

  // If the state is found
  // If the state.shouldRedirectLimit is true make it false
  if (user.shouldRedirectOnLimit === true) {
    user.shouldRedirectOnLimit = false;
    await user.save();
  } else {
    user.shouldRedirectOnLimit = true;
    await user.save();
  }

  return res.status(200).json({
    message: "State changed successfully",
    type: "SUCCESS",
  });
}
