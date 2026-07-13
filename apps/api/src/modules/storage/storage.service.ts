import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

@Injectable()
export class StorageService {
  private supabase;
  private bucket: string;

  constructor(private configService: ConfigService) {
    const url = this.configService.get('SUPABASE_URL')!;
    const serviceKey = this.configService.get('SUPABASE_SERVICE_ROLE_KEY')!;
    this.supabase = createClient(url, serviceKey);
    this.bucket = this.configService.get('SUPABASE_STORAGE_BUCKET') || 'sadean';
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 5MB.');
    }

    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${crypto.randomUUID()}.${fileExtension}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }

    const { data: urlData } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }

  async deleteFile(fileName: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([fileName]);

    if (error) {
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }

  getPublicUrl(fileName: string): string {
    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
}
