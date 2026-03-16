import json
from urllib.parse import urlparse, parse_qs, unquote


def wms_url_to_json(url):
    parsed = urlparse(url)

    # Extract base URL
    base_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"

    # Parse query parameters
    params = parse_qs(parsed.query)

    # Flatten values and decode
    params = {k: unquote(v[0]) for k, v in params.items()}

    layer_json = {
        "id": params.get("LAYERS", "Unknown Layer"),
        "type": "WMS",
        "active": True,
        "daterange": False,
        "baseUrl": base_url,
        "serverType": "geoserver",
        "wmsParams": {
            "SERVICE": params.get("SERVICE"),
            "VERSION": params.get("VERSION"),
            "REQUEST": params.get("REQUEST"),
            "FORMAT": params.get("FORMAT"),
            "TRANSPARENT": params.get("TRANSPARENT"),
            "layers": params.get("LAYERS"),
            "STYLES": params.get("STYLES"),
            "CRS": params.get("SRS"),
            "WIDTH": params.get("WIDTH"),
            "HEIGHT": params.get("HEIGHT"),
            "BBOX": params.get("BBOX"),
        },
        "opacity": 0.9,
        "zIndex": 5,
        "visible": True,
        "transition": 0
    }

    return layer_json


url = input()

result = wms_url_to_json(url)

print(json.dumps(result, indent=4))