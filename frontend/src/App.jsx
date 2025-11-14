import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import ReactCompareImage from "react-compare-image";
import { upScaleImage } from "./services/api";

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [upscaledImage, setUpscaledImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDropImage = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setOriginalImage(URL.createObjectURL(file));
    setUpscaledImage(null);
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await upScaleImage(formData);

      const blob = response.data;
      setUpscaledImage(URL.createObjectURL(blob));

    } catch (error) {
      console.error("Erro no upload da imagem:", error);
      setError(error.message || "Falha ao processar imagem");
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropImage,
    accept: { "image/*": [".jpeg", ".png", ".jpg"] },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Melhore a resolução da sua imagem
      </h1>

      <div
        {...getRootProps()}
        className={`w-full max-w-xl p-8 border-2 border-dashed rounded-2xl cursor-pointer transition 
          ${isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-400 bg-white"
          }
        `}
      >
        <input {...getInputProps()} />
        <p className="text-center text-gray-600">
          {isDragActive
            ? "Solte a imagem aqui..."
            : "Arraste e solte uma imagem ou clique para selecionar"}
        </p>
      </div>

      {loading && (
        <p className="mt-4 text-blue-600 font-semibold">Processando imagem...</p>
      )}

      {error && (
        <p className="mt-4 text-red-600 font-semibold">{error}</p>
      )}

      {originalImage && upscaledImage && (
        <div className="mt-10 w-full max-w-3xl bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Comparação</h2>

          <ReactCompareImage
            leftImage={originalImage}
            rightImage={upscaledImage}
            className="rounded-lg"
          />

          <a
            href={upscaledImage}
            download="imagem-upscale.png"
            className="mt-6 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            Baixar Imagem Melhorada
          </a>
        </div>
      )}

      {!originalImage && (
        <p className="mt-6 text-gray-500">Faça o upload de uma imagem para começar!</p>
      )}
    </div>
  );
}

export default App;