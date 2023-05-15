// External Dependencies
import { FileIcon } from 'react-file-icon';
// Internal Dependencies
import './FileIcon.css';

/* Current extensions
   ------------------
    png
    pdf
    mp3
    mp4
    zip
    html
    css
    js
    json
    jpeg
    jpg
    txt
    psd
    ai
    doc
    xls
    indd
    ppt
    document
    spreadsheet
    presentation
    py
    java
    php
    sql
    c
    cpp
    pptx
    docx
    xlsx
    visio
    infopath
    svg
    md
    yaml
    Total: 35
*/

// FileIcon Component
const getFileIcon = (extension, fileName) => {
  // switch statement to return the correct file icon
  switch (extension) {
    case 'png':
      return (
        <FileIcon
          size={48}
          color="#DA4C4C"
          labelColor="#DA4C4C"
          labelUppercase
          type="image"
          glyphColor="rgba(255,255,255,0.4)"
          extension="png"
        />
      );
    case 'pdf':
      return (
        <FileIcon
          size={48}
          color="#F2385A"
          gradientColor="#FF5B6C"
          gradientOpacity={1}
          fold={false}
          radius={6}
          type="pdf"
          glyphColor="rgba(255,255,255,0.6)"
          extension="pdf"
        />
      );
    case 'mp3':
      return (
        <FileIcon
          size={48}
          color="#EB4C4C"
          labelColor="#EB4C4C"
          labelUppercase
          type="audio"
          glyphColor="rgba(255,255,255,0.4)"
          extension="mp3"
        />
      );
    case 'mp4':
      return (
        <FileIcon
          size={48}
          color="#1266F1"
          gradientColor="#00C2FF"
          gradientOpacity={1}
          fold={false}
          radius={6}
          type="video"
          glyphColor="rgba(255,255,255,0.6)"
          extension="mp4"
        />
      );
    case 'zip':
      return (
        <FileIcon
          size={48}
          color="#2B2D42"
          gradientColor="#8D99AE"
          gradientOpacity={1}
          fold={false}
          radius={6}
          type="zip"
          glyphColor="rgba(255,255,255,0.6)"
          extension="zip"
        />
      );
    case 'html':
      return (
        <FileIcon
          size={48}
          color="#FEC035"
          labelColor="#FEC035"
          labelUppercase
          type="code"
          glyphColor="rgba(255,255,255,0.4)"
          extension="html"
        />
      );
    case 'css':
      return (
        <FileIcon
          size={48}
          color="#2965F1"
          labelColor="#2965F1"
          labelUppercase
          type="code"
          glyphColor="rgba(255,255,255,0.4)"
          extension="css"
        />
      );
    case 'js':
      return (
        <FileIcon
          size={48}
          color="#EFD81D"
          labelColor="#EFD81D"
          labelUppercase
          type="code"
          glyphColor="rgba(255,255,255,0.4)"
          extension="js"
        />
      );
    case 'json':
      return (
        <FileIcon
          size={48}
          color="#F53838"
          labelColor="#F53838"
          labelUppercase
          type="code"
          glyphColor="rgba(255,255,255,0.4)"
          extension="json"
        />
      );
    case 'jpeg':
    case 'jpg':
      return (
        <FileIcon
          size={48}
          color="#D14423"
          labelColor="#D14423"
          labelUppercase
          type="presentation"
          glyphColor="rgba(255,255,255,0.4)"
          extension="jpg"
        />
      );
    case 'txt':
      return (
        <FileIcon
          size={48}
          color="#D14423"
          labelColor="#D14423"
          labelUppercase
          type="presentation"
          glyphColor="rgba(255,255,255,0.4)"
          extension="txt"
        />
      );
    case 'psd':
      return (
        <FileIcon
          className="ext-icon"
          size={4}
          color="#34364E"
          gradientOpacity={0}
          labelColor="#34364E"
          labelTextColor="#31C5F0"
          labelUppercase
          foldColor="#31C5F0"
          radius={2}
          extension="psd"
        />
      );
    case 'ai':
      return (
        <FileIcon
          size={2}
          color="#423325"
          gradientOpacity={0}
          labelColor="#423325"
          labelTextColor="#FF7F18"
          labelUppercase
          foldColor="#FF7F18"
          radius={2}
          extension="ai"
        />
      );
    case 'doc':
      return (
        <FileIcon
          size={48}
          color="#2C5898"
          labelColor="#2C5898"
          labelUppercase
          type="document"
          glyphColor="rgba(255,255,255,0.4)"
          extension="doc"
        />
      );
    case 'xls':
      return (
        <FileIcon
          size={48}
          color="#1A754C"
          labelColor="#1A754C"
          labelUppercase
          type="spreadsheet"
          glyphColor="rgba(255,255,255,0.4)"
          extension="xls"
        />
      );
    case 'indd':
      return (
        <FileIcon
          size={48}
          color="#4B2B36"
          gradientOpacity={0}
          labelColor="#4B2B36"
          labelTextColor="#FF408C"
          labelUppercase
          foldColor="#FF408C"
          radius={2}
          extension="indd"
        />
      );
    case 'ppt':
      return (
        <FileIcon
          size={48}
          color="#D14423"
          labelColor="#D14423"
          labelUppercase
          type="presentation"
          glyphColor="rgba(255,255,255,0.4)"
          extension="ppt"
        />
      );
    case 'document':
      return (
        <FileIcon
          size={48}
          color="#FF8500"
          gradientColor="#FFB900"
          gradientOpacity={1}
          fold={false}
          radius={6}
          type="document"
          glyphColor="rgba(255,255,255,0.6)"
        />
      );
    case 'spreadsheet':
      return (
        <FileIcon
          size={48}
          color="#11D51D"
          gradientColor="#82FA6C"
          gradientOpacity={1}
          fold={false}
          radius={6}
          type="spreadsheet"
          glyphColor="rgba(255,255,255,0.6)"
        />
      );
    case 'presentation':
      return (
        <FileIcon
          size={48}
          color="#1254F8"
          gradientColor="#00D2FF"
          gradientOpacity={1}
          fold={false}
          radius={6}
          type="presentation"
          glyphColor="rgba(255,255,255,0.6)"
        />
      );
    case 'py':
      return (
        <FileIcon
          size={48}
          color="#306998"
          labelColor="#306998"
          labelUppercase
          type="code"
          glyphColor="rgba(255,255,255,0.4)"
          extension="py"
        />
      );
    case 'java':
      return (
        <FileIcon
          size={48}
          color="#5382A1"
          labelColor="#5382A1"
          labelUppercase
          type="code"
          glyphColor="rgba(255,255,255,0.4)"
          extension="java"
        />
      );
    case 'php':
      return (
        <FileIcon
          size={48}
          color="#8892BF"
          labelColor="#8892BF"
          labelUppercase
          type="code"
          glyphColor="rgba(255,255,255,0.4)"
          extension="php"
        />
      );
    case 'sql':
      return (
        <FileIcon
          size={48}
          color="#4479A1"
          labelColor="#4479A1"
          labelUppercase
          type="code"
          glyphColor="rgba(255,255,255,0.4)"
          extension="sql"
        />
      );
    case 'c':
      return (
        <FileIcon
          size={48}
          color="#A8B9CC"
          labelColor="#A8B9CC"
          labelUppercase
          type="code"
          glyphColor="rgba(255,255,255,0.4)"
          extension="c"
        />
      );
    case 'cpp':
      return (
        <FileIcon
          size={48}
          color="#6296CC"
          labelColor="#6296CC"
          labelUppercase
          type="code"
          glyphColor="rgba(255,255,255,0.4)"
          extension="cpp"
        />
      );
    case 'pptx':
      return (
        <FileIcon
          size={48}
          color="#D04423"
          labelColor="#D04423"
          labelUppercase
          type="presentation"
          glyphColor="rgba(255,255,255,0.4)"
          extension="pptx"
        />
      );
    case 'docx':
      return (
        <FileIcon
          size={48}
          color="#2C5898"
          labelColor="#2C5898"
          labelUppercase
          type="document"
          glyphColor="rgba(255,255,255,0.4)"
          extension="docx"
        />
      );
    case 'xlsx':
      return (
        <FileIcon
          size={48}
          color="#1A754C"
          labelColor="#1A754C"
          labelUppercase
          type="spreadsheet"
          glyphColor="rgba(255,255,255,0.4)"
          extension="xlsx"
        />
      );
    case 'visio':
      return (
        <FileIcon
          size={48}
          color="#3955A3"
          labelColor="#3955A3"
          labelUppercase
          type="document"
          glyphColor="rgba(255,255,255,0.4)"
          extension="vsd"
        />
      );
    case 'infopath':
      return (
        <FileIcon
          size={48}
          color="#BF5E1E"
          labelColor="#BF5E1E"
          labelUppercase
          type="document"
          glyphColor="rgba(255,255,255,0.4)"
          extension="xsn"
        />
      );
    case 'svg':
      return (
        <FileIcon
          size={48}
          color="#FFB13B"
          labelColor="#FFB13B"
          labelUppercase
          type="image"
          glyphColor="rgba(255,255,255,0.4)"
          extension="svg"
        />
      );
    case 'md':
      return (
        <FileIcon
          size={48}
          color="#6A737D"
          labelColor="#6A737D"
          labelUppercase
          type="document"
          glyphColor="rgba(255,255,255,0.4)"
          extension="md"
        />
      );
    case 'yaml':
      return (
        <FileIcon
          size={48}
          color="#A8A938"
          labelColor="#A8A938"
          labelUppercase
          type="code"
          glyphColor="rgba(255,255,255,0.4)"
          extension="yaml"
        />
      );

    // default case
    default:
      return (
        <FileIcon
          size={48}
          color="#9933ff"
          gradientColor="#00D2FF"
          gradientOpacity={1}
          fold={false}
          radius={6}
          type={fileName}
          glyphColor="rgba(255,255,255,0.6)"
        />
      );
  }
};
export default getFileIcon;
