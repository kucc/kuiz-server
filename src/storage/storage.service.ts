import { BadRequestException, Injectable, Req } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class StorageService {
  private S3: AWS.S3;
  constructor() {
    this.S3 = new AWS.S3({
      endpoint: process.env.AWS_S3_ENDPOINT,
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
  }

  async upload(@Req() req): Promise<string> {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: req.files.image.name,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
      Body: req.files.image.data,
    };

    const result = await this.S3.upload(params)
      .promise()
      .catch((error) => {
        throw new BadRequestException(`파일을 업로드할 수 없습니다. ${error}`);
      });

    return result.Location;
  }
}
