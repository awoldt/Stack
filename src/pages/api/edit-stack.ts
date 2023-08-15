import { EditStack } from "@/functions";
import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";

const form = formidable({
  keepExtensions: true,
  allowEmptyFiles: true,
  minFileSize: 0,
  maxFileSize: 2000000, //2mb
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ msg: string }>
) {
  form.parse(req, async (err, fields, files: any) => {
    if (err) {
      console.log(err);
      if (err.httpCode === 413) {
        return res.status(413).json({ msg: "File size too large." });
      }
      return res
        .status(500)
        .json({ msg: "There was an error while processing upload." });
    }

    //make sure at least 1 language is included
    //make sure there is at least 1 language included in form
    if (fields.languages_used === undefined) {
      return res
        .status(400)
        .json({
          msg: "You must include at least one language for each stack.",
        });
    }
    const s = await EditStack(
      String(req.query.stack_id),
      req.cookies.uid!,
      files.stack_icon,
      files.stack_thumbnail,
      fields
    );

    if (s === null) {
      return res
        .status(500)
        .json({ msg: "There was an error while updating stack." });
    }
    if (s === "contains_profanity") {
      return res
        .status(400)
        .json({ msg: "Stack name and description cannot contain profanity" });
    }

    return res.json({ msg: "Stack successfully updated." });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
