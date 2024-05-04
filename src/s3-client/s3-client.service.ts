import { Inject, Injectable } from '@nestjs/common';
import EasyYandexS3 from 'easy-yandex-s3';
import { URL } from 'url';

@Injectable()
export class S3ClientService {
	constructor(@Inject('S3_CLIENT') private readonly s3Client: EasyYandexS3) {}

	async uploadFile(buffer: Buffer, filename: string, folder: string = '') {
		try {
			const result = await this.s3Client.Upload(
				{
					buffer,
					name: filename,
				},
				folder,
			);
			if (!!result && !!result['Location']) return result['Location'];
			throw new Error('Error while uploading file to the bucket');
		} catch (error) {
			throw error;
		}
	}

	async deleteFile(filePath: string) {
		try {
			const routeFullPath = new URL(filePath).pathname;
			const result = await this.s3Client.Remove(routeFullPath);
			if (!!result) return result;
			throw new Error('Error while removing file from bucket');
		} catch (error) {
			throw error;
		}
	}
}
