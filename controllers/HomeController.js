const BaseController = require("./BaseController");

class HomeController extends BaseController {
  index() {
    var data ={
      header: 'RiZU',
      services: [
        {
          id: 1,
          title: 'Artwork AI & Deep Learning',
          descriptions: [
            "Custom AI model development",
            "LLM fine-tuning & inference optimization",
            "Computer vision & audio processing",
            "Research-grade experimentation",
          ]
        },
        {
          id: 2,
          title: 'Software Architecture & Systems Design',
          descriptions: [
            "Scalable backend system design",
            "Microservices & cloud-native architecture",
            "High-performance API development",
            "System reliability & optimization",
          ]
        },
        {
          id: 3,
          title: 'Creative Tech & Automation',
          descriptions: [
            "AI VTuber systems",
            "TTS with emotion synchronization",
            "Automation pipelines",
            "Experimental interactive systems",
          ]
        }
      ],
      researches: [
        {
          id: 1,
          title: "The Impact of Keypoints Normalization on SIBI Recognition using Modified Shift-GCN",
          description: "This study implements Modified Shift-GCN for Indonesian Sign Language (SIBI) on a more complex dataset combining hand and body graphs with dynamic poses. It also examines the impact of key-point tracking and normalization on model performance. Experiments using 10-fold cross-validation show that normalization significantly improves accuracy to 97.9%, compared to 55.3% without normalization.",
          year: "2022",
          tags: ["Machine Learning", "Sign Language", "Graph Neural Networks"],
          ieee_url: "https://ieeexplore.ieee.org/document/10057716"
        },
        {
          id: 2,
          title: "Reversible Audio Data Hiding using Samples Greatest Common Factor and Audio Interpolation",
          description: "This study proposes an algorithm that uses the Great Common Factor (GCF) between the original and interpolated audio samples to determine insertion locations, achieving higher message capacity, preserved audio quality, and more efficient execution.",
          year: "2022",
          tags: ["Steganography", "Audio Processing", "Data Hiding"],
          ieee_url: "https://ieeexplore.ieee.org/document/9720763"
        },
        {
          id: 3,
          title: "Reversible Audio Steganography using Least Prime Factor and Audio Interpolation",
          description: "This study proposes a method that uses the Least Prime Factor of the difference between interpolated and original audio to determine sample space, partitions the payload accordingly, and embeds the decimal payload into the interpolated samples. Results show the method effectively improves payload capacity and stego-audio quality.",
          year: "2021",
          tags: ["Steganography", "Audio Processing", "Prime Factor"],
          ieee_url: "https://ieeexplore.ieee.org/document/9743066"
        },
        {
          id: 4,
          title: "Wavelet Transformation and Local Binary Pattern for Data Augmentation in Deep Learning-based Face Recognition",
          description: "This study evaluates various Wavelet Transform methods and Local Binary Pattern (LBP) for data augmentation in CNN and pre-trained VGG16 models on the Yale-B dataset. Results show that combining LBP and IDWT features from DWT as augmented data achieves the highest accuracy of 99.69%.",
          year: "2022",
          tags: ["Deep Learning", "Face Recognition", "Data Augmentation"],
          ieee_url: "https://ieeexplore.ieee.org/document/9914875"
        }
      ]
    }
    
    this.res.json(
      this.outputClass().toJson(
        data,
        'Landing page data successfully retrieved.'
      )
    );
  }
}

module.exports = HomeController;
