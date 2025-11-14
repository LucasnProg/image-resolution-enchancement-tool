from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
import numpy as np
import cv2

from realesrgan import RealESRGANer
from basicsr.archs.rrdbnet_arch import RRDBNet

MODEL_PATH = "models\RealESRGAN_x4plus.pth"
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# ---------------------------
# Carregar modelo RealESRGAN
# ---------------------------
try:
    # Define arquitetura do modelo ESRGAN x4
    rrdb_model = RRDBNet(
        num_in_ch=3, 
        num_out_ch=3, 
        num_feat=64, 
        num_block=23,
        num_grow_ch=32,
        scale=4
    )

    # Carrega o RealESRGANer
    model = RealESRGANer(
        scale=4,
        model_path=MODEL_PATH,
        model=rrdb_model,
        tile=1000, 
        tile_pad=20,
        pre_pad=0,
        half=False 
    )

    print(f"Modelo carregado com sucesso no {DEVICE}")

except Exception as exc:
    print("Não foi possível carregar o modelo:", exc)
    model = None


# ---------------------------
# FastAPI
# ---------------------------
app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ---------------------------
# Rota de upscale
# ---------------------------
@app.post("/upscale/")
async def upscale_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        if model:
            # Converter para BGR (OpenCV)
            img_np = np.array(image)
            img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

            # Rodar modelo RealESRGAN
            output, _ = model.enhance(img_bgr, outscale=4)

            # Voltar para RGB
            upscaled_image = Image.fromarray(cv2.cvtColor(output, cv2.COLOR_BGR2RGB))

        else:
            width, height = image.size
            upscaled_image = image.resize((width * 2, height * 2), Image.LANCZOS)
            print("Usando upscale fake. Modelo não carregado.")

        # Converter para bytes
        img_byte_arr = io.BytesIO()
        ext = file.filename.split(".")[-1].upper()

        if ext not in ["JPEG", "PNG", "WEBP", "BMP"]:
            ext = "PNG"

        upscaled_image.save(img_byte_arr, format=ext)
        img_byte_arr.seek(0)

        return StreamingResponse(img_byte_arr, media_type=file.content_type)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
