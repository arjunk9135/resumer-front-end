# Batch Job Posting and Resume Upload API Documentation

## Create a Batch for Job Postings

To create a new batch for job postings, send a POST request with the job name and description.

### Request
```bash
curl.exe -X POST `
   http://localhost:8000/batches/ `
   -F "job_name=<job title>" `
   -F "job_description=<job description>"
```
## Response

```json
{
   "id": "<batch_uuid>",
   "message": "Batch created successfully. Please upload a zip file with resumes."
}

```

### Request
```bash
GET http://127.0.0.1:8000/batches/<batch_uuid>/
```

## Response
```json
{
    "id": "<batch_uuid>",
    "job_name": "<job title>",
    "job_description": "<job description>",
    "created_at": "2025-06-18T15:45:36.850889Z",
    "status": "PENDING",
    "total_resumes": 0,
    "processed_resumes": 0,
    "resumes": []
}
```

## Upload resumes as a zip file to the url
```bash
curl.exe -X POST `
  "http://localhost:8000/batches/upload/" `
  -F "batch_id=<batch_uuid>" `
  -F "file=@C:\Users\Akhil\Pictures\cv_list\multi_page_cv\Multi_4.zip"
```
## Response
```json
{
   "message":"Resumes uploaded successfully",
   "id":"<batch_uuid>",
   "total_resumes":4
}
```
### Request Processed results
```bash
GET http://127.0.0.1:8000/batches/<batch_uuid>/
```
```json
{
    "id": "<batch_uuid>",
    "job_name": "Random.",
    "job_description": "Looking for a Python developer with experience in Django and REST APIs.",
    "created_at": "2025-06-18T15:45:36.850889Z",
    "status": "COMPLETED",
    "total_resumes": 4,
    "processed_resumes": 4,
    "resumes": [
        {
            "id": "<resume_1_uuid>",
            "filename": "Arjun_K_cv11978805_file.pdf",
            "status": "COMPLETED",
            "created_at": "2025-06-18T15:47:34.363055Z"
        },
        {
            "id": "<resume_2_uuid>",
            "filename": "Electronics_engineer_CV_12_04_2025.pdf",
            "status": "COMPLETED",
            "created_at": "2025-06-18T15:47:34.372382Z"
        },
        {
            "id": "<resume_3_uuid>",
            "filename": "Muhammad_Shahin_K_S.pdf",
            "status": "COMPLETED",
            "created_at": "2025-06-18T15:47:34.381827Z"
        },
        {
            "id": "<resume_4_uuid>",
            "filename": "Musthafa_Noushad.pdf",
            "status": "COMPLETED",
            "created_at": "2025-06-18T15:47:34.389851Z"
        }
    ]
}
```

## Summary of Endpoints

| Endpoint               | Method | Description                              |
|------------------------|--------|------------------------------------------|
| `/batches/`            | POST   | Create a new batch with job details      |
| `/batches/{batch_id}/` | GET    | Get batch status and details             |
| `/batches/upload/`     | POST   | Upload resumes zip file to a batch       |



"preinstall": "npm install -g vite",