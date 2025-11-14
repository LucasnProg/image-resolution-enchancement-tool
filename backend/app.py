from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
from realesrgan import RealESRGAN
import numpy as np
import cv2

MODEL_PATH = 'backend\models\RealESRGAN_x4plus.pth'
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

try:
    model = RealESRGAN(scale=4, model_path=MODEL_PATH).to(DEVICE)
    model.load_weights(MODEL_PATH)
    print(f"Modelo carregado com sucesso no {DEVICE}")
except Exception as exc:
    print("Não foi possivel carregar o modelo")


app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
   CORSMiddleware,
   allow_origins = origins,
   allow_credentials = True,
   allow_methods= ["*"],
   allow_headers= ["*"] 
)
 
@app.post("/upscale/")
async def upscale_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        if model:
            img_np = np.array(image)
            img_np_rgb = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

            upscaled_image_np = model.predict(img_np_rgb)
            upscaled_image = Image.fromarray(cv2.cvtColor(upscaled_image_np, cv2.COLOR_BGR2RGB)) 
        else:
            width, height = image.size
            upscaled_image = image.resize((width * 2, height * 2), Image.LANCZOS)
            print("Usando mock de upscale, pois o modelo real não foi carregado.")

        img_byte_arr = io.BytesIO()
        output_format_save = file.filename.split(".")[-1].upper() if "." in file.filename else "PNG"

        if output_format_save not in ["JPEG", "PNG", "WEBP", "BMP"]:
            output_format_save = "PNG"

        upscaled_image.save(img_byte_arr, format=output_format_save)
        img_byte_arr.seek(0)

        media_type = file.content_type if file.content_type in ["image/jpeg", "image/png"] else "image/png"

        return StreamingResponse(img_byte_arr, media_type=file.content_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))