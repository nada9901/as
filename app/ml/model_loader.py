import json
import os
from typing import Dict, Any

MODEL_PATH = os.path.join(os.path.dirname(__file__), "trained_model_data.json")

class XGBoostModelLoader:
    _instance = None

    def __init__(self):
        self.model_metadata: Dict[str, Any] = {}
        self.loaded = False
        self.load()

    def load(self):
        try:
            if os.path.exists(MODEL_PATH):
                with open(MODEL_PATH, "r", encoding="utf-8") as f:
                    self.model_metadata = json.load(f)
                self.loaded = True
            else:
                self.loaded = False
        except Exception as e:
            print(f"Error loading XGBoost artifact: {e}")
            self.loaded = False

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = XGBoostModelLoader()
        return cls._instance

def load_model_artifact():
    return XGBoostModelLoader.get_instance()
