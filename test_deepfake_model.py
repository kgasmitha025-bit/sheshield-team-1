from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch

MODEL = "sakshamkr1/deitfake-v2"

print("Downloading/loading model...")
processor = AutoImageProcessor.from_pretrained(MODEL)
model = AutoModelForImageClassification.from_pretrained(MODEL)

print("MODEL LOADED")
print("Labels:", model.config.id2label)
print("Parameters:", sum(p.numel() for p in model.parameters()))
