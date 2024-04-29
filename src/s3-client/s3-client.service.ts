import { Inject, Injectable } from '@nestjs/common';
import EasyYandexS3 from 'easy-yandex-s3';

@Injectable()
export class S3ClientService {
	constructor(@Inject('S3_CLIENT') private readonly s3Client: EasyYandexS3) {}

	async uploadFile(buffer: Buffer, filename: string) {
		try {
			const result = await this.s3Client.Upload(
				{
					buffer,
					name: filename,
				},
				'',
			);
			return result['Location'];
		} catch (error) {
			throw error;
		}
	}
}
