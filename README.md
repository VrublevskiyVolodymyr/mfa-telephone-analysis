
# mfa-telephone-analysis

## Overview

The **mfa-telephone-analysis** project aims to process and analyze a large volume of telephone conversations for the Ministry of Foreign Affairs of Ukraine. The system creates a structured dataset from audio recordings, extracting essential information such as names, locations, emotional tones, and categorizing conversations into relevant topics.

## Default Categories

By default, the following five conversation topics are created:

1. Visa and Passport Services
2. Diplomatic Inquiries
3. Travel Advisories
4. Consular Assistance
5. Trade and Economic Cooperation

## API Endpoints

### Categories

- **GET /category**: Returns a list of all conversation topics.
- **POST /category**: Creates a new conversation topic.
    - Request: `{"title": "Topic Title", "points": ["Key Point 1", "Key Point 2"]}`
    - Success Response: `{"id": "new_category_id", "title": "Topic Title", "points": ["Key Point 1", "Key Point 2"]}`
    - Error Response: `422 Unprocessable Entity` if validation fails.
- **PUT /category/{category_id}**: Updates an existing conversation topic.
    - Request: `{"title": "New Topic Title", "points": ["New Key Point 1", "New Key Point 2"]}`
    - Success Response: `{"id": "category_id", "title": "New Topic Title", "points": ["New Key Point 1", "New Key Point 2"]}`
    - Error Response: `422 Unprocessable Entity` if validation fails.
- **DELETE /category/{category_id}**: Deletes a conversation topic by the specified identifier.
    - Success Response: `200 OK`
    - Error Response: `404 Not Found` if the category does not exist.

### Calls

- **POST /call**: Creates a new call based on the provided audio file URL. Supported formats are wav and mp3.
    - Request: `{"audio_url": "http://example.com/audiofile.wav"}`
    - Success Response: `{"id": "new_call_id"}`
    - Error Response: `422 Unprocessable Entity` if the audio file or URL is invalid.

- **GET /call/{id}**: Retrieves details of a call by the specified identifier.
    - Success Response:
      ```json
      {
        "id": "call_id",
        "name": "Call Name",
        "location": "Kyiv",
        "emotional_tone": "Neutral",
        "text": "Transcribed text",
        "categories": ["Topic Title 1", "Topic Title 2"]
      }
      ```
    - Response: `202 Accepted` if processing is not yet complete.

## Requirements

- The system operates without internet access, meaning it does not rely on external services. Audio file links can be sourced from a local network.
- Conversations are conducted in English.
- Documentation is available at [http://localhost:8080/docs](http://localhost:8080/docs).

## Requirements for Running the Project

Before running the **mfa-telephone-analysis** project, make sure you have the following installed on your computer:

### 1. Node.js

Download and install Node.js version **v20.15.1** from the [official Node.js website](https://nodejs.org/).

### 2. Docker

Download and install Docker from the [official Docker website](https://www.docker.com/products/docker-desktop).

### 3. Vosk Model

Download the Vosk model [vosk-model-en-us-0.22-lgraph](https://alphacephei.com/vosk/models), extract it, and place it in the project directory under `src/models`.

### 4. FFmpeg

**FFmpeg** is required for audio file processing. You can download it from the [official FFmpeg website](https://ffmpeg.org/download.html) or use Chocolatey:

1. Install Chocolatey if not already installed. Instructions can be found on the [Chocolatey website](https://chocolatey.org/).
2. Open the command prompt as administrator and run:
   ```bash
   choco install ffmpeg
   ```
   ## After Installation

Verify that the command works:

```bash
ffmpeg -version
```

## Installation

1. Download the source code and extract the files into a directory.
2. Ensure all dependencies are installed.
3. Install Docker and set it up.
4. Download the Vosk model [vosk-model-en-us-0.22-lgraph](https://alphacephei.com/vosk/models), extract it, and move it to the project directory under `src/models`.
5. For local audio file uploads, install `http-server`:
    - If you have npm installed, run:
      ```bash
      npm install -g http-server
      ```
    - Start the server:
      ```bash
      http-server ./path_to_audio_files
      ```
6. Ensure you are using Node.js version **v20.15.1**.
7. Install **ffmpeg** from the official site [FFmpeg Download](https://ffmpeg.org/download.html) or use Chocolatey:
    1. Install Chocolatey if not already installed. Instructions can be found on the [Chocolatey website](https://chocolatey.org/).
    2. Open the command prompt as administrator and run:
       ```bash
       choco install ffmpeg
       ```
    3. After installation, verify that the command works:
       ```bash
       ffmpeg -version
       ```

## Instructions for Running the Project

To set up and run the project, follow these steps:

1. Navigate to the project folder in the console:
   ```bash
   cd /path/to/your/project
   ```
2. Start the Docker container with the environment settings:
    ```bash
   docker compose --env-file ./environments/local.env -f docker-compose.db.yaml up --build -d
   ```
   
3. Navigate to the MinIO console at http://localhost:8001/login.
      Log in using the credentials specified in your .env file (MINIO_ROOT_USER and MINIO_ROOT_PASSWORD).
      Create a bucket with the name specified in your .env file for AWS_S3_BUCKET_NAME (e.g., auto-ria-clone-2024).
4. Open a new console and navigate back to the project folder:
    ```bash
   cd /path/to/your/project
    ```
5. Install the Swagger plugin using npm:
   ```bash
   npm install @nestjs/swagger swagger-ui-express
   ```
6. Run the project:
   ```bash
   npm run start:local
   ```
   
   Now the project is up and running, and you can interact with it through Swagger UI.


## Testing

To run the tests, execute the following command:

```bash
npm run test:unit
```

## Ensure that the following script is included in your package.json:

```json
"scripts": {
  "test:unit": "jest --config ./jest-unit.json"
}
```
For better test coverage, consider writing additional tests to cover edge cases and functionalities.

## Corner Cases Covered

- **Validation for Empty or Missing Required Fields**: Ensures that fields like `title` in categories are not left empty.
- **Handling Non-Existent Category IDs**: Provides error responses for attempts to update or delete categories that do not exist.
- **File Format Validation**: Validates audio files to ensure they are in supported formats (wav and mp3) before processing.
- **Audio File Processing Failures**: Implements error handling for scenarios where audio files cannot be processed correctly.

## Thoughts on Solutions

During the implementation of the **mfa-telephone-analysis** project, several challenges were encountered, particularly in the areas of audio file processing and information extraction. The design choices made prioritize a robust validation system to ensure data integrity and the accuracy of the information extracted from the audio files. By focusing on comprehensive error handling, we can provide clear feedback to users and streamline the overall user experience.

## Next Steps for Service Improvement

1. **Enhancing Emotional Tone Detection**: To improve the identification of emotional states, names, and locations from the transcribed text, we should augment our vocabulary files, which are responsible for these recognitions. These files can be found in `src/modules/calls/utils`.

2. **Improving Transcription Accuracy**: We can enhance transcription accuracy by downloading larger Vosk models from the official Vosk website. Placing these models in the `src/models` folder will allow for more nuanced audio processing and improved recognition of spoken content.

3. **Expanding Categorization Logic**: Future iterations of the project could benefit from expanding the categories based on user feedback, allowing for more relevant and organized conversation topics.


## Future Improvements

Enhance the accuracy of voice-to-text transcription by downloading larger **`Vosk models**` and placing them in the src/models folder. Update the model name in **`transcription.service.ts`** at the **`const modelPath`**.
Implement more advanced emotional tone analysis.
Expand the categories and improve the categorization logic based on user feedback.

## License

This project is licensed under the MIT License.

## Key Points:

Recommendations for enhancing test coverage are included.
The future improvements section has been retained with clear instructions.
Feel free to make any additional changes as necessary!





