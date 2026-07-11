const BaseController = require("./BaseController");
const ImageProcessingService = require('../services/ImageProcessingService');

class ImageProcessingController extends BaseController {
    async index() {
        this.res.json({
            services: [
                {
                    name: 'compress_image',
                    description: 'Compress image',
                    endpoint: '/image-processing/compress',
                    input: 'image/png, image/jpeg',
                    output: 'image/jpeg',
                },
                {
                    name: 'convert_to_pdf',
                    description: 'Convert image to PDF',
                    endpoint: '/image-processing/to-pdf',
                    input: 'image/png, image/jpeg',
                    output: 'application/pdf',
                }
            ]
        });
    }

    async compress() {
        try {
            const base64Data = await ImageProcessingService.compress_image(this.req);
            this.output().toJson({
                image: `data:image/jpeg;base64,${base64Data}`,
                mimeType: 'image/jpeg'
            });
        } catch (error) {
            console.error('Error in compress:', error);
            this.output().toJson({ error: error.message || 'Failed to compress image' }, 'Failed to compress image', 500);
        }
    }

    async toPdf() {
        try {
            const base64Data = await ImageProcessingService.convert_to_pdf(this.req);
            this.output().toJson({
                image: `data:application/pdf;base64,${base64Data}`,
                mimeType: 'application/pdf'
            });
        } catch (error) {
            console.error('Error in toPdf:', error);
            this.output().toJson({ error: error.message || 'Failed to convert to PDF' }, 'Failed to convert to PDF', 500);
        }
    }
}
