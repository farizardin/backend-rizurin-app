const sharp = require('sharp');
const PDFDocument = require('pdfkit');

class ImageProcessingService {
    constructor() {
        // implemented
    }

    async compress_image(req) {
        if (!req.file) {
            throw new Error('No image file uploaded. Please upload a file with the key "file".');
        }

        const imageBuffer = req.file.buffer;

        // Compress image using sharp
        const compressedBuffer = await sharp(imageBuffer)
            .jpeg({ quality: 60 }) // compress by reducing quality
            .toBuffer();

        return compressedBuffer.toString('base64');
    }

    async convert_to_pdf(req) {
        if (!req.file) {
            throw new Error('No image file uploaded. Please upload a file with the key "file".');
        }

        const imageBuffer = req.file.buffer;

        // Ensure the image is in a format suitable for pdfkit and get its metadata
        const processedImageBuffer = await sharp(imageBuffer)
            .jpeg({ quality: 80 })
            .toBuffer();
            
        const metadata = await sharp(processedImageBuffer).metadata();

        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ autoFirstPage: false });
                const buffers = [];
                
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve(pdfData.toString('base64'));
                });
                
                doc.addPage({
                    size: [metadata.width, metadata.height]
                });
                
                doc.image(processedImageBuffer, 0, 0, {
                    width: metadata.width,
                    height: metadata.height
                });

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new ImageProcessingService();