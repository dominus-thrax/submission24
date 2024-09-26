import AWS from "./awsClient";
import { v4 as uuidv4 } from "uuid";

// bucket_name=submission-pulzion-24
// region=ap-south-1
export const uploadFile = async (file) => {
  const id = uuidv4();

  var upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: "submission-pulzion-24",
      Key: `submission/${id}_${file.name}`,
      Body: file,
    },
    region: "ap-south-1",
  });
  try {
    const res = await upload.promise();
    //console.log("upload: ",res);
    if (res?.Location) {
      return { submission: res.Location };
    }
    return {
      error: "Something went wrong",
    };
  } catch (e) {
    return {
      error: "Something went wrong",
    };
  }
};
