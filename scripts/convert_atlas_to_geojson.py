#!/usr/bin/env python3
import csv
import json
from pathlib import Path


INPUT_PATH = Path("/home/peto/pCloud_home/projects/footprinted-one/inputs/Atlas DB 2026-08-24-export.csv")
OUTPUT_DIR = Path("/home/peto/pCloud_home/projects/footprinted-one/outputs")
OUTPUT_PATH = OUTPUT_DIR / "atlas_sk.geojson"
INVALID_PATH = OUTPUT_DIR / "atlas_sk_invalid.geojson"


def normalize_text(value):
    if value is None:
        return ""
    return str(value).strip()


def parse_float(value):
    text = normalize_text(value)
    if text == "" or text.lower() in {"#n/a", "n/a", "na", "null", "none"}:
        return None

    text = text.replace("\u00a0", "").replace(" ", "")
    if "," in text and "." in text:
        text = text.replace(".", "").replace(",", ".")
    elif "," in text:
        text = text.replace(",", ".")

    try:
        return float(text)
    except ValueError:
        return None


def parse_int(value):
    text = normalize_text(value)
    if text == "" or text.lower() in {"#n/a", "n/a", "na", "null", "none"}:
        return None
    try:
        return int(float(text))
    except ValueError:
        return None


def row_to_properties(row):
    return {
        "Place": normalize_text(row.get("Place")),
        "Date": normalize_text(row.get("Date")),
        "Page": normalize_text(row.get("Page")),
        "Sector": normalize_text(row.get("Sector")),
        "CountryCode": normalize_text(row.get("Country Code")).upper(),
        "Year": parse_int(row.get("Year")),
        "Latitude": parse_float(row.get("Latitude")),
        "Longitude": parse_float(row.get("Longitude")),
        "Country": normalize_text(row.get("Country")),
        "Region": normalize_text(row.get("Region")),
        "RegionDistrict": normalize_text(row.get("Region District")),
    }


def build_feature(row, valid):
    props = row_to_properties(row)
    if valid:
        lat = props["Latitude"]
        lon = props["Longitude"]
        return {
            "type": "Feature",
            "properties": {
                **props,
                "valid": True,
            },
            "geometry": {
                "type": "Point",
                "coordinates": [lon, lat],
            },
        }

    return {
        "type": "Feature",
        "properties": {
            **props,
            "valid": False,
            "issue": "Missing or invalid coordinates",
        },
        "geometry": None,
    }


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    features = []
    invalid_features = []

    with INPUT_PATH.open("r", encoding="utf-8-sig", newline="") as csv_file:
        reader = csv.DictReader(csv_file, delimiter=";")
        for row in reader:
            props = row_to_properties(row)
            if props["CountryCode"] != "SK":
                continue

            lat = props["Latitude"]
            lon = props["Longitude"]

            if lat is not None and lon is not None and -90 <= lat <= 90 and -180 <= lon <= 180:
                feature = build_feature(row, valid=True)
                features.append(feature)
            else:
                feature = build_feature(row, valid=False)
                invalid_features.append(feature)
                features.append(feature)

    valid_geojson = {"type": "FeatureCollection", "features": features}
    invalid_geojson = {"type": "FeatureCollection", "features": invalid_features}

    with OUTPUT_PATH.open("w", encoding="utf-8") as out_file:
        json.dump(valid_geojson, out_file, ensure_ascii=False, indent=2)

    with INVALID_PATH.open("w", encoding="utf-8") as out_file:
        json.dump(invalid_geojson, out_file, ensure_ascii=False, indent=2)

    print(f"Wrote {len(features)} SK features to {OUTPUT_PATH}")
    print(f"Wrote {len(invalid_features)} invalid SK features to {INVALID_PATH}")
    print(f"Valid SK points: {sum(1 for f in features if f.get('properties', {}).get('valid') is True)}")


if __name__ == "__main__":
    main()
