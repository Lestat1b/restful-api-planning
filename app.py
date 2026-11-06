from flask import Flask, jsonify, render_template, request
from pathlib import Path
import json
import re

app = Flask(__name__)
DATA_FILE = Path(__file__).parent / "data" / "breeds.json"

def load_breeds():
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))

def save_breeds(breeds):
    DATA_FILE.write_text(json.dumps(breeds, indent=2), encoding="utf-8")

@app.get("/")
def home():
    return render_template("index.html")

@app.get("/api/breeds")
def get_breeds():
    """Return all profiles; optional filters: q, group, size, activity."""
    breeds = load_breeds()
    q = request.args.get("q", "").strip().lower()
    group = request.args.get("group", "").strip().lower()
    size = request.args.get("size", "").strip().lower()
    activity = request.args.get("activity", "").strip().lower()

    if q:
        breeds = [b for b in breeds if q in b["name"].lower()
                  or q in b["temperament"].lower()]
    if group:
        breeds = [b for b in breeds if b["group"].lower() == group]
    if size:
        breeds = [b for b in breeds if b["size"].lower() == size]
    if activity:
        breeds = [b for b in breeds if activity in b["activity"].lower()]

    return jsonify({"count": len(breeds), "breeds": breeds})

@app.get("/api/breeds/<slug>")
def get_breed(slug):
    breed = next((b for b in load_breeds() if b["slug"] == slug), None)
    if breed is None:
        return jsonify({"error": "Breed not found"}), 404
    return jsonify(breed)

@app.post("/api/breeds")
def add_breed():
    """Add a breed profile. In a real deployment, protect this endpoint with authentication."""
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Request body must be valid JSON"}), 400

    required = ["name", "group", "size", "lifespan", "activity",
                "grooming", "temperament", "pros", "cons", "akc_url"]
    missing = [field for field in required if field not in data or data[field] in ("", None, [])]
    if missing:
        return jsonify({"error": "Missing required fields", "fields": missing}), 400

    for field in ["name", "group", "size", "lifespan", "activity",
                  "grooming", "temperament", "akc_url"]:
        if not isinstance(data[field], str) or not data[field].strip():
            return jsonify({"error": f"{field} must be a non-empty string"}), 400

    if data["size"] not in ["Small", "Medium", "Large"]:
        return jsonify({"error": "size must be Small, Medium, or Large"}), 400
    if not re.match(r"^https://www\.akc\.org/dog-breeds/.+/$", data["akc_url"]):
        return jsonify({"error": "akc_url must be an AKC breed page URL"}), 400
    for field in ["pros", "cons"]:
        if not isinstance(data[field], list) or not data[field] or not all(
            isinstance(item, str) and item.strip() for item in data[field]
        ):
            return jsonify({"error": f"{field} must be a list of non-empty strings"}), 400

    breeds = load_breeds()
    slug = re.sub(r"[^a-z0-9]+", "-", data["name"].lower()).strip("-")
    if any(b["slug"] == slug for b in breeds):
        return jsonify({"error": "A breed with this name already exists"}), 409

    new_breed = {key: data[key] for key in required}
    new_breed["slug"] = slug
    breeds.append(new_breed)
    save_breeds(breeds)
    return jsonify(new_breed), 201

@app.get("/api/groups")
def get_groups():
    groups = sorted({b["group"] for b in load_breeds()})
    return jsonify({"groups": groups})

if __name__ == "__main__":
    app.run(debug=True)
