import { Module } from '@nestjs/common';
import { S3ClientService } from './s3-client.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import EasyYandexS3 from 'easy-yandex-s3';

@Module({
	imports: [ConfigModule],
	providers: [
		S3ClientService,
		{
			provide: 'S3_CLIENT',
			useFactory: (configService: ConfigService) => {
				const accessKeyId = configService.get<string>(
					'YANDEX_ACCESS_KEY_ID',
				);
				const secretAccessKey = configService.get<string>(
					'YANDEX_SECRET_ACCESS_KEY',
				);
				const bucket = configService.get<string>('YANDEX_BUCKET');

				return new EasyYandexS3({
					auth: {
						accessKeyId,
						secretAccessKey,
					},
					Bucket: bucket,
					debug: false,
				});
			},
			inject: [ConfigService],
		},
	],
	exports: [S3ClientService],
})
export class S3ClientModule {}
