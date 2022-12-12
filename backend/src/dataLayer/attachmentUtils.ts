import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { createLogger } from "../utils/logger";

const XAWS = AWSXRay.captureAWS(AWS);
const s3Client = new XAWS.S3({
  signatureVersion: "v4",
});

const logger = createLogger("AttachmentUtils");

// TODO: Implement the fileStogare logic
export class AttachmentUtils {
  constructor(
    private readonly timeOut = process.env.SIGNED_URL_EXPIRATION,
    private readonly s3BucketName = process.env.S3_BUCKET_NAME
  ) {}

  getUploadUrl(todoId: string): string {
    logger.info("Getting all todo");

    const url = s3Client.getSignedUrl("putObject", {
      Bucket: this.s3BucketName,
      Key: todoId,
      Expires: this.timeOut,
    });
    logger.info(url);

    return url as string;
  }
}
