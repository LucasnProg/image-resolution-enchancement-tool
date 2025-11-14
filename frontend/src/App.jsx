import { useCallback, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { ReactCompareImage } from 'react-compare-image';
import './App.css'
import { upScaleImage } from './services/api';


function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [upscaleImage, setUpscaleImage] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const onDropImage = useCallback(
    async (accepteFiles) => {
      const file = accepteFiles[0];
      if(!file) return;

      setOriginalImage(URL.createObjectURL(file));
      setOriginalImage(null);
      setError(null);
      setLoading(true);

      const formData = new formData();
      formData.append('file', file);

      try{
        const response = upScaleImage(formData);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Erro ao fazer o upload do arquivo');
        }

        const blob = response.blob();

        setUpscaleImage(URL.createObjectURL(blob));
      } catch (error) {
        console.log('erro no upload da imagem: ',error);
        setError(error.mensage || 'falha ao processar imagem');
      } finally{
        setLoading(false);
      }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropZone({ onDrop, accept: { 'image/*': ['.jpeg', '.png', '.jpg'] } });

  return (
    <div className="App">
            <h1>Melhore a resolução da sua imagem</h1>

            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                    <p>Solte a imagem aqui...</p> :
                    <p>Arraste e solte uma imagem aqui, ou clique para selecionar</p>
                }
            </div>

            {loading && <p>Processando imagem...</p>}
            {error && <p className="error">{error}</p>}

            {(originalImage && upscaledImage) && (
                <div className="image-comparison-container">
                    <h2>Resultado</h2>
                    <ReactCompareImage
                        itemOne={<img src={originalImage} alt="Original" />}
                        itemTwo={<img src={upscaledImage} alt="Upscaled" />}
                        keyboardIncrement="1%"
                        position={50}
                        className="comparison-slider"
                    />
                    <button onClick={handleDownload} className="download-button">Baixar Imagem Melhorada</button>
                </div>
            )}
             {!originalImage && <p>Faça o upload de uma imagem para começar!</p>}
        </div>
  )
}

export default App
