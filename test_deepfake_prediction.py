from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch

MODEL = "sakshamkr1/deitfake-v2"
IMAGE = r"C:\Users\kamatchi shree\Downloads\deepfake-test.jpg"

processor = AutoImageProcessor.from_pretrained(MODEL)
model = AutoModelForImageClassification.from_pretrained(MODEL)

image = Image.open(IMAGE).convert("RGB")
inputs = processor(images=image, return_tensors="pt")

with torch.no_grad():
    outputs = model(**inputs)

probabilities = torch.softmax(outputs.logits, dim=-1)[0]

for index, probability in enumerate(probabilities):
    print(f"{model.config.id2label[index]}: {probability.item() * 100:.2f}%")

prediction = torch.argmax(probabilities).item()
print(f"\nPREDICTION: {model.config.id2label[prediction]}")
print(f"CONFIDENCE: {probabilities[prediction].item() * 100:.2f}%")
