import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from '../context/useTheme';

const TinyEditor = ({ value, onChange, height = 400 }) => {
  const { theme } = useTheme();
  
  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      value={value}
      onEditorChange={onChange}
      init={{
        height: height,
        menubar: 'file edit view insert format tools table help',
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | bold italic underline | ' +
          'alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist outdent indent | link image media | ' +
          'removeformat | help',
        skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
        content_css: theme === 'dark' ? 'dark' : 'default',
        content_style: `
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            font-size: 14px; 
            line-height: 1.6;
          }
        `,
        images_upload_handler: async (blobInfo, progress) => {
          try {
            const formData = new FormData();
            formData.append('image', blobInfo.blob(), blobInfo.filename());
            
            const token = localStorage.getItem("token");
            const response = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/api/upload/image`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
            
            return response.data.url;
          } catch (error) {
            console.error('Image upload failed:', error);
            throw new Error('Image upload failed');
          }
        }
      }}
    />
  );
};

export default TinyEditor;
