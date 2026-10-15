import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const s3 = new S3Client({ region: 'ap-northeast-2' });

export class PrintFileController {
  static async getUploadPresignedUrl(req: any, res: any) {
    const { orderId, fileName, fileType } = req.body;
    const s3Key = `print-originals/${orderId}/${Date.now()}_${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_PRINT_BUCKET_NAME,
      Key: s3Key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 1800 });
    return res.json({ uploadUrl, s3Key });
  }

  static async runPreflightCheck(req: any, res: any) {
    const { orderId, localTempFilePath, cutWidthMm, cutHeightMm } = req.body;

    try {
      const { stdout } = await execFileAsync('python3', [
        './workers/preflight_worker.py',
        localTempFilePath,
        String(cutWidthMm),
        String(cutHeightMm),
      ]);

      const preflightResult = JSON.parse(stdout);

      return res.json({
        success: true,
        orderId,
        preflight: preflightResult,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: 'PDF 분석 실패', error: error.message });
    }
  }
}
