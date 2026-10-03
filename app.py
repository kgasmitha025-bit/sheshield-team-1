from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from transformers import pipeline, AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch
import io

app = FastAPI(title="SheShield AI Server")

print("Loading SheShield BERT model...")

classifier = pipeline(
    "text-classification",
    model="Davephoenix/bert-bullying-detector"
)

print("BERT model loaded successfully!")

print("Loading SheShield Deepfake model...")

IMAGE_MODEL = "sakshamkr1/deitfake-v2"

image_processor = AutoImageProcessor.from_pretrained(IMAGE_MODEL)
image_model = AutoModelForImageClassification.from_pretrained(IMAGE_MODEL)
image_model.eval()

print("Deepfake model loaded successfully!")


class TextRequest(BaseModel):
    text: str


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "SheShield AI Server"
    }


@app.post("/analyze-text")
def analyze_text(request: TextRequest):
    text = request.text.strip()

    if not text:
        return {
            "success": False,
            "error": "Text is required"
        }

    result = classifier(text)[0]

    label = result["label"]
    confidence = round(result["score"] * 100, 2)

    is_bullying = label == "LABEL_1"

    return {
        "success": True,
        "prediction": "Bullying" if is_bullying else "Not Bullying",
        "label": label,
        "confidence": confidence,
        "model": "Davephoenix/bert-bullying-detector"
    }


@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()

        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        inputs = image_processor(
            images=image,
            return_tensors="pt"
        )

        with torch.no_grad():
            outputs = image_model(**inputs)

        probabilities = torch.softmax(outputs.logits, dim=-1)[0]

        prediction_index = torch.argmax(probabilities).item()
        prediction = image_model.config.id2label[prediction_index]
        confidence = round(
            probabilities[prediction_index].item() * 100,
            2
        )

        return {
            "success": True,
            "prediction": prediction,
            "confidence": confidence,
            "model": IMAGE_MODEL
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
