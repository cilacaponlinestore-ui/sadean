import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import * as crypto from 'crypto';

@Injectable()
export class StorageService {
  private minioClient: Minio.Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT') || 'localhost',
      port: parseInt(this.configService.get('MINIO_PORT') || '9000'),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY') || 'minioadmin',
      secretKey: this.configService.get('MINIO_SECRET_KEY') || 'minioadmin',
    });

    this.bucket = this.configService.get('MINIO_BUCKET') || 'sadean';
    this.initBucket();
  }

  private async initBucket() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucket);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucket, 'us-east-1');
        
        // Set public read policy
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucket}/*`],
            },
          ],
        };

        await this.minioClient.setBucketPolicy(
          this.bucket,
          JSON.stringify(policy),
        );
      }
    } catch (error) {
      console.error('Error initializing MinIO bucket:', error);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 5MB.');
    }

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${crypto.randomUUID()}.${fileExtension}`;

    // Upload to MinIO
    await this.minioClient.putObject(
      this.bucket,
      fileName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype },
    );

    // Return public URL
    const endPoint = this.configService.get('MINIO_ENDPOINT') || 'localhost';
    const port = this.configService.get('MINIO_PORT') || '9000';
    const useSSL = this.configService.get('MINIO_USE_SSL') === 'true';
    const protocol = useSSL ? 'https' : 'http';

    return `${protocol}://${endPoint}:${port}/${this.bucket}/${fileName}`;
  }

  async deleteFile(fileName: string): Promise<void> {
    await this.minioClient.removeObject(this.bucket, fileName);
  }

  getPublicUrl(fileName: string): string {
    const endPoint = this.configService.get('MINIO_ENDPOINT') || 'localhost';
    const port = this.configService.get('MINIO_PORT') || '9000';
    const useSSL = this.configService.get('MINIO_USE_SSL') === 'true';
    const protocol = useSSL ? 'https' : 'http';

    return `${protocol}://${endPoint}:${port}/${this.bucket}/${fileName}`;
  }
}