from transformers import pipeline

MODEL_NAME = "Davephoenix/bert-bullying-detector"

print("Loading BERT model...")

classifier = pipeline(
    "text-classification",
    model=MODEL_NAME
)

print("BERT model loaded successfully!")

tests = [
    "Hey, are you coming to college tomorrow?",
    "You are useless and nobody likes you.",
    "Stop messaging me. I don't want to talk to you."
]

for text in tests:
    result = classifier(text)[0]

    print("\nText:", text)
    print("Label:", result["label"])
    print("Confidence:", round(result["score"] * 100, 2), "%")
